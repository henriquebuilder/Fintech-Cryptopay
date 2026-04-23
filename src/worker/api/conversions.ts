import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Get crypto balances for an establishment
app.get("/:establishmentId/balances", async (c) => {
  const establishmentId = c.req.param("establishmentId");
  
  const balances = await c.env.DB.prepare(
    `SELECT * FROM crypto_balances WHERE establishment_id = ? ORDER BY crypto_symbol`
  )
    .bind(establishmentId)
    .all();

  return c.json(balances.results || []);
});

// Get conversion settings for an establishment
app.get("/:establishmentId/settings", async (c) => {
  const establishmentId = c.req.param("establishmentId");
  
  const establishment = await c.env.DB.prepare(
    `SELECT auto_convert_enabled, auto_convert_percent, bank_account_holder, 
     bank_account_number, bank_name, bank_account_type 
     FROM establishments WHERE id = ?`
  )
    .bind(establishmentId)
    .first();

  return c.json(establishment || {});
});

// Update conversion settings
app.put("/:establishmentId/settings", async (c) => {
  const establishmentId = c.req.param("establishmentId");
  const body = await c.req.json();
  
  const {
    auto_convert_enabled,
    auto_convert_percent,
    bank_account_holder,
    bank_account_number,
    bank_name,
    bank_account_type,
  } = body;

  await c.env.DB.prepare(
    `UPDATE establishments 
     SET auto_convert_enabled = ?, 
         auto_convert_percent = ?,
         bank_account_holder = ?,
         bank_account_number = ?,
         bank_name = ?,
         bank_account_type = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  )
    .bind(
      auto_convert_enabled ? 1 : 0,
      auto_convert_percent || 0,
      bank_account_holder || null,
      bank_account_number || null,
      bank_name || null,
      bank_account_type || null,
      establishmentId
    )
    .run();

  return c.json({ success: true });
});

// Create a manual conversion request
app.post("/:establishmentId/convert", async (c) => {
  const establishmentId = c.req.param("establishmentId");
  const body = await c.req.json();
  
  const { crypto_symbol, amount_crypto } = body;

  // Get current balance
  const balance = await c.env.DB.prepare(
    `SELECT available_balance FROM crypto_balances 
     WHERE establishment_id = ? AND crypto_symbol = ?`
  )
    .bind(establishmentId, crypto_symbol)
    .first();

  if (!balance || parseFloat(balance.available_balance as string) < parseFloat(amount_crypto)) {
    return c.json({ error: "Insufficient balance" }, 400);
  }

  // Mock exchange rate (in production, fetch from API like CoinGecko)
  const exchangeRates: Record<string, number> = {
    USDT: 1.0,
    BTC: 45000,
    ETH: 2500,
    BNB: 320,
  };
  
  const rate = exchangeRates[crypto_symbol] || 1;
  const amountUsd = (parseFloat(amount_crypto) * rate).toFixed(2);
  const brlRate = 5.2; // Mock BRL/USD rate
  const amountBrl = (parseFloat(amountUsd) * brlRate).toFixed(2);

  // Create conversion request
  await c.env.DB.prepare(
    `INSERT INTO conversion_requests 
     (establishment_id, crypto_symbol, amount_crypto, amount_usd, amount_fiat, 
      fiat_currency, exchange_rate, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      establishmentId,
      crypto_symbol,
      amount_crypto,
      amountUsd,
      amountBrl,
      "BRL",
      rate,
      "pending"
    )
    .run();

  // Update balance
  await c.env.DB.prepare(
    `UPDATE crypto_balances 
     SET available_balance = available_balance - ?,
         pending_conversion = pending_conversion + ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE establishment_id = ? AND crypto_symbol = ?`
  )
    .bind(amount_crypto, amount_crypto, establishmentId, crypto_symbol)
    .run();

  return c.json({ 
    success: true, 
    amount_usd: amountUsd,
    amount_brl: amountBrl,
    rate 
  });
});

// Get conversion history
app.get("/:establishmentId/history", async (c) => {
  const establishmentId = c.req.param("establishmentId");
  
  const conversions = await c.env.DB.prepare(
    `SELECT * FROM conversion_requests 
     WHERE establishment_id = ? 
     ORDER BY created_at DESC 
     LIMIT 50`
  )
    .bind(establishmentId)
    .all();

  return c.json(conversions.results || []);
});

// Update crypto balance (called after transaction confirmed)
app.post("/:establishmentId/update-balance", async (c) => {
  const establishmentId = c.req.param("establishmentId");
  const body = await c.req.json();
  
  const { crypto_symbol, amount_crypto, auto_convert_percent } = body;

  // Check if balance record exists
  const existing = await c.env.DB.prepare(
    `SELECT id FROM crypto_balances 
     WHERE establishment_id = ? AND crypto_symbol = ?`
  )
    .bind(establishmentId, crypto_symbol)
    .first();

  if (!existing) {
    // Create new balance record
    await c.env.DB.prepare(
      `INSERT INTO crypto_balances 
       (establishment_id, crypto_symbol, available_balance, total_received) 
       VALUES (?, ?, ?, ?)`
    )
      .bind(establishmentId, crypto_symbol, amount_crypto, amount_crypto)
      .run();
  } else {
    // Update existing balance
    await c.env.DB.prepare(
      `UPDATE crypto_balances 
       SET available_balance = available_balance + ?,
           total_received = total_received + ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE establishment_id = ? AND crypto_symbol = ?`
    )
      .bind(amount_crypto, amount_crypto, establishmentId, crypto_symbol)
      .run();
  }

  // If auto-convert is enabled, create conversion request
  if (auto_convert_percent && auto_convert_percent > 0) {
    const convertAmount = (parseFloat(amount_crypto) * (auto_convert_percent / 100)).toFixed(8);
    
    if (parseFloat(convertAmount) > 0) {
      const exchangeRates: Record<string, number> = {
        USDT: 1.0,
        BTC: 45000,
        ETH: 2500,
        BNB: 320,
      };
      
      const rate = exchangeRates[crypto_symbol] || 1;
      const amountUsd = (parseFloat(convertAmount) * rate).toFixed(2);
      const brlRate = 5.2;
      const amountBrl = (parseFloat(amountUsd) * brlRate).toFixed(2);

      await c.env.DB.prepare(
        `INSERT INTO conversion_requests 
         (establishment_id, crypto_symbol, amount_crypto, amount_usd, amount_fiat, 
          fiat_currency, exchange_rate, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          establishmentId,
          crypto_symbol,
          convertAmount,
          amountUsd,
          amountBrl,
          "BRL",
          rate,
          "auto-pending"
        )
        .run();

      // Deduct from available balance
      await c.env.DB.prepare(
        `UPDATE crypto_balances 
         SET available_balance = available_balance - ?,
             pending_conversion = pending_conversion + ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE establishment_id = ? AND crypto_symbol = ?`
      )
        .bind(convertAmount, convertAmount, establishmentId, crypto_symbol)
        .run();
    }
  }

  return c.json({ success: true });
});

export default app;
