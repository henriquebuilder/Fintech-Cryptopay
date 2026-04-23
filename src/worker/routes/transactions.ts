import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
  try {
    const { establishmentId, crypto, amount, txHash } = await c.req.json();

    if (!establishmentId || !crypto || !amount) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const db = c.env.DB;

    // Get establishment to check fee rate
    const establishment = await db
      .prepare("SELECT transaction_fee_percent FROM establishments WHERE id = ?")
      .bind(establishmentId)
      .first();

    const feePercent = Number(establishment?.transaction_fee_percent) || 0.8;
    const amountNum = parseFloat(amount);
    const platformFee = amountNum * (feePercent / 100);
    const merchantNet = amountNum - platformFee;

    // Insert transaction with fees calculated
    const result = await db
      .prepare(
        `INSERT INTO transactions (
          establishment_id, 
          crypto_symbol, 
          amount_crypto, 
          amount_usd,
          platform_fee_crypto,
          platform_fee_usd,
          merchant_net_crypto,
          merchant_net_usd,
          tx_hash,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        establishmentId,
        crypto,
        amount,
        amount.toString(),
        platformFee.toFixed(6),
        platformFee.toFixed(2),
        merchantNet.toFixed(6),
        merchantNet.toFixed(2),
        txHash || `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
        txHash ? "confirmed" : "pending"
      )
      .run();

    // Update establishment stats if confirmed
    if (txHash) {
      await db
        .prepare(
          `UPDATE establishments 
           SET total_revenue_usd = total_revenue_usd + ?,
               total_transactions = total_transactions + 1,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`
        )
        .bind(merchantNet.toFixed(2), establishmentId)
        .run();

      // Update crypto balances and trigger auto-conversion if enabled
      const settings = await db
        .prepare("SELECT auto_convert_enabled, auto_convert_percent FROM establishments WHERE id = ?")
        .bind(establishmentId)
        .first();

      const autoConvertPercent = settings?.auto_convert_enabled ? (Number(settings.auto_convert_percent) || 0) : 0;

      // Check if balance record exists
      const existingBalance = await db
        .prepare("SELECT id FROM crypto_balances WHERE establishment_id = ? AND crypto_symbol = ?")
        .bind(establishmentId, crypto)
        .first();

      if (!existingBalance) {
        // Create new balance record
        await db
          .prepare(
            `INSERT INTO crypto_balances 
             (establishment_id, crypto_symbol, available_balance, total_received) 
             VALUES (?, ?, ?, ?)`
          )
          .bind(establishmentId, crypto, merchantNet.toFixed(8), merchantNet.toFixed(8))
          .run();
      } else {
        // Update existing balance
        await db
          .prepare(
            `UPDATE crypto_balances 
             SET available_balance = available_balance + ?,
                 total_received = total_received + ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE establishment_id = ? AND crypto_symbol = ?`
          )
          .bind(merchantNet.toFixed(8), merchantNet.toFixed(8), establishmentId, crypto)
          .run();
      }

      // If auto-convert is enabled, create conversion request
      if (autoConvertPercent > 0) {
        const convertAmount = merchantNet * (autoConvertPercent / 100);

        if (convertAmount > 0) {
          const exchangeRates: Record<string, number> = {
            USDT: 1.0,
            BTC: 45000,
            ETH: 2500,
            BNB: 320,
          };

          const rate = exchangeRates[crypto] || 1;
          const amountUsd = (convertAmount * rate).toFixed(2);
          const brlRate = 5.2;
          const amountBrl = (parseFloat(amountUsd) * brlRate).toFixed(2);

          await db
            .prepare(
              `INSERT INTO conversion_requests 
               (establishment_id, crypto_symbol, amount_crypto, amount_usd, amount_fiat, 
                fiat_currency, exchange_rate, status) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
            )
            .bind(
              establishmentId,
              crypto,
              convertAmount.toFixed(8),
              amountUsd,
              amountBrl,
              "BRL",
              rate,
              "auto-pending"
            )
            .run();

          // Deduct from available balance
          await db
            .prepare(
              `UPDATE crypto_balances 
               SET available_balance = available_balance - ?,
                   pending_conversion = pending_conversion + ?,
                   updated_at = CURRENT_TIMESTAMP
               WHERE establishment_id = ? AND crypto_symbol = ?`
            )
            .bind(convertAmount.toFixed(8), convertAmount.toFixed(8), establishmentId, crypto)
            .run();
        }
      }
    }
    if (txHash) {
      await db
        .prepare(
          `UPDATE establishments 
           SET total_transactions = total_transactions + 1,
               total_revenue_usd = total_revenue_usd + ?,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`
        )
        .bind(merchantNet.toFixed(2), establishmentId)
        .run();
    }

    return c.json({
      id: result.meta.last_row_id,
      txHash: txHash || null,
      status: txHash ? "confirmed" : "pending",
      platformFee: platformFee.toFixed(2),
      merchantNet: merchantNet.toFixed(2),
      feePercent,
    });
  } catch (error) {
    console.error("Transaction error:", error);
    return c.json({ error: "Failed to process transaction" }, 500);
  }
});

app.get("/", async (c) => {
  try {
    const db = c.env.DB;
    const result = await db
      .prepare(
        `SELECT * FROM transactions 
         ORDER BY created_at DESC 
         LIMIT 50`
      )
      .all();

    return c.json(result.results);
  } catch (error) {
    console.error("Fetch transactions error:", error);
    return c.json({ error: "Failed to fetch transactions" }, 500);
  }
});

export default app;
