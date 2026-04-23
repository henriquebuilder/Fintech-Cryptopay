import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Generate PIX static QR code
app.post("/generate-qr", async (c) => {
  try {
    const { establishmentId, amount, description } = await c.req.json();

    if (!establishmentId) {
      return c.json({ error: "Missing establishment ID" }, 400);
    }

    const db = c.env.DB;

    // Get active PIX key for establishment
    const pixKey = await db
      .prepare("SELECT * FROM pix_keys WHERE establishment_id = ? AND is_active = 1 LIMIT 1")
      .bind(establishmentId)
      .first();

    if (!pixKey) {
      return c.json({ error: "No active PIX key found. Create one first." }, 400);
    }

    // Generate unique transaction ID
    const txId = `TX${Date.now()}${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

    // Generate PIX BR Code (simplified version)
    const pixData = generateBRCode({
      pixKey: pixKey.key_value as string,
      merchantName: "CryptoPay Gateway",
      merchantCity: "SAO PAULO",
      txId,
      amount: amount || "",
      description: description || "Pagamento CryptoPay",
    });

    // Store QR code transaction
    await db
      .prepare(
        `INSERT INTO pix_transactions (
          establishment_id, 
          pix_key_id, 
          amount_brl, 
          tx_id,
          qr_code_data,
          status
        ) VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(establishmentId, pixKey.id, amount || "0", txId, pixData, "pending")
      .run();

    return c.json({
      qrCode: pixData,
      pixKey: pixKey.key_value,
      txId,
      amount,
    });
  } catch (error: unknown) {
    console.error("Error generating PIX QR:", error);
    return c.json({ error: "Failed to generate PIX QR code" }, 500);
  }
});

// Create PIX key
app.post("/keys", async (c) => {
  try {
    const { establishmentId, keyType, keyValue } = await c.req.json();

    if (!establishmentId || !keyType || !keyValue) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const db = c.env.DB;

    // Check if key already exists
    const existing = await db
      .prepare("SELECT id FROM pix_keys WHERE key_value = ?")
      .bind(keyValue)
      .first();

    if (existing) {
      return c.json({ error: "This PIX key is already registered" }, 400);
    }

    const result = await db
      .prepare(
        "INSERT INTO pix_keys (establishment_id, key_type, key_value) VALUES (?, ?, ?)"
      )
      .bind(establishmentId, keyType, keyValue)
      .run();

    return c.json({
      id: result.meta.last_row_id,
      keyType,
      keyValue,
    });
  } catch (error: unknown) {
    console.error("Error creating PIX key:", error);
    return c.json({ error: "Failed to create PIX key" }, 500);
  }
});

// Get PIX keys
app.get("/keys/:establishmentId", async (c) => {
  try {
    const establishmentId = c.req.param("establishmentId");
    const db = c.env.DB;

    const { results } = await db
      .prepare("SELECT * FROM pix_keys WHERE establishment_id = ? ORDER BY created_at DESC")
      .bind(establishmentId)
      .all();

    return c.json(results);
  } catch (error: unknown) {
    console.error("Error fetching PIX keys:", error);
    return c.json({ error: "Failed to fetch PIX keys" }, 500);
  }
});

// Get PIX transactions
app.get("/transactions/:establishmentId", async (c) => {
  try {
    const establishmentId = c.req.param("establishmentId");
    const db = c.env.DB;

    const { results } = await db
      .prepare(
        `SELECT pt.*, pk.key_value, pk.key_type 
         FROM pix_transactions pt
         LEFT JOIN pix_keys pk ON pt.pix_key_id = pk.id
         WHERE pt.establishment_id = ?
         ORDER BY pt.created_at DESC
         LIMIT 100`
      )
      .bind(establishmentId)
      .all();

    return c.json(results);
  } catch (error: unknown) {
    console.error("Error fetching PIX transactions:", error);
    return c.json({ error: "Failed to fetch PIX transactions" }, 500);
  }
});

// Webhook for PIX payment notifications (simulated)
app.post("/webhook", async (c) => {
  try {
    const { endToEndId, txId, amount, payerName, payerDocument } = await c.req.json();

    if (!endToEndId || !txId || !amount) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const db = c.env.DB;

    // Find transaction by txId
    const transaction = await db
      .prepare("SELECT * FROM pix_transactions WHERE tx_id = ? AND status = 'pending'")
      .bind(txId)
      .first();

    if (!transaction) {
      return c.json({ error: "Transaction not found or already processed" }, 404);
    }

    const establishmentId = transaction.establishment_id as number;

    // Get establishment settings for auto-conversion
    const establishment = await db
      .prepare("SELECT auto_convert_enabled, auto_convert_percent FROM establishments WHERE id = ?")
      .bind(establishmentId)
      .first();

    const autoConvert = establishment?.auto_convert_enabled === 1;
    const convertPercent = Number(establishment?.auto_convert_percent) || 100;

    // Update transaction status
    await db
      .prepare(
        `UPDATE pix_transactions 
         SET status = 'confirmed', 
             end_to_end_id = ?,
             payer_name = ?,
             payer_document = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
      .bind(endToEndId, payerName || "", payerDocument || "", transaction.id)
      .run();

    // If auto-conversion enabled, convert BRL to crypto
    if (autoConvert) {
      const amountBRL = parseFloat(amount);
      const convertAmount = amountBRL * (convertPercent / 100);
      const remainingAmount = amountBRL - convertAmount;

      // Simulate BRL -> USDT conversion (1 BRL = ~0.20 USDT)
      const exchangeRate = 0.20;
      const cryptoAmount = convertAmount * exchangeRate;

      // Update transaction with conversion info
      await db
        .prepare(
          `UPDATE pix_transactions 
           SET crypto_symbol = 'USDT',
               crypto_amount = ?,
               conversion_rate = ?,
               converted_at = CURRENT_TIMESTAMP
           WHERE id = ?`
        )
        .bind(cryptoAmount.toFixed(6), exchangeRate, transaction.id)
        .run();

      // Update crypto balance
      await db
        .prepare(
          `INSERT INTO crypto_balances (establishment_id, crypto_symbol, available_balance, total_received)
           VALUES (?, 'USDT', ?, ?)
           ON CONFLICT(establishment_id, crypto_symbol) 
           DO UPDATE SET 
             available_balance = CAST(available_balance AS REAL) + CAST(excluded.available_balance AS REAL),
             total_received = CAST(total_received AS REAL) + CAST(excluded.total_received AS REAL)`
        )
        .bind(establishmentId, cryptoAmount.toFixed(6), cryptoAmount.toFixed(6))
        .run();

      return c.json({
        status: "confirmed",
        converted: true,
        cryptoAmount: cryptoAmount.toFixed(6),
        cryptoSymbol: "USDT",
        remainingBRL: remainingAmount.toFixed(2),
      });
    }

    return c.json({ status: "confirmed", converted: false });
  } catch (error: unknown) {
    console.error("Error processing PIX webhook:", error);
    return c.json({ error: "Failed to process payment" }, 500);
  }
});

// Helper function to generate PIX BR Code
function generateBRCode(params: {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  txId: string;
  amount?: string;
  description?: string;
}): string {
  // Simplified BR Code generation (EMV QR Code standard)
  // In production, use a proper library like pix-utils or pix-payload

  const { pixKey, merchantName, merchantCity, txId, amount } = params;

  // Build payload
  let payload = "00020126";

  // Merchant account info
  const accountInfo = `0014BR.GOV.BCB.PIX01${String(pixKey.length).padStart(2, "0")}${pixKey}`;
  payload += `26${String(accountInfo.length).padStart(2, "0")}${accountInfo}`;

  // Merchant category code
  payload += "52040000";

  // Transaction currency (BRL = 986)
  payload += "5303986";

  // Amount (if specified)
  if (amount && parseFloat(amount) > 0) {
    const amountStr = parseFloat(amount).toFixed(2);
    payload += `54${String(amountStr.length).padStart(2, "0")}${amountStr}`;
  }

  // Country code
  payload += "5802BR";

  // Merchant name
  payload += `59${String(merchantName.length).padStart(2, "0")}${merchantName}`;

  // Merchant city
  payload += `60${String(merchantCity.length).padStart(2, "0")}${merchantCity}`;

  // Additional data
  const additionalData = `05${String(txId.length).padStart(2, "0")}${txId}`;
  payload += `62${String(additionalData.length).padStart(2, "0")}${additionalData}`;

  // CRC16 placeholder
  payload += "6304";

  // Calculate CRC16 (simplified - in production use proper CRC16-CCITT)
  const crc = calculateCRC16(payload).toString(16).toUpperCase().padStart(4, "0");
  payload += crc;

  return payload;
}

function calculateCRC16(str: string): number {
  // Simplified CRC16-CCITT calculation
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return crc & 0xffff;
}

export default app;
