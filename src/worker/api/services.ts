import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Get all service categories
app.get("/categories", async (c) => {
  try {
    const db = c.env.DB;
    const { results } = await db
      .prepare("SELECT * FROM service_categories WHERE is_active = 1 ORDER BY sort_order")
      .all();

    return c.json(results);
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);
    return c.json({ error: "Failed to fetch categories" }, 500);
  }
});

// Get services by category
app.get("/category/:categoryId", async (c) => {
  try {
    const categoryId = c.req.param("categoryId");
    const db = c.env.DB;

    const { results } = await db
      .prepare(
        `SELECT s.*, sc.display_name as category_name 
         FROM services s
         JOIN service_categories sc ON s.category_id = sc.id
         WHERE s.category_id = ? AND s.is_active = 1
         ORDER BY s.service_name`
      )
      .bind(categoryId)
      .all();

    return c.json(results);
  } catch (error: unknown) {
    console.error("Error fetching services:", error);
    return c.json({ error: "Failed to fetch services" }, 500);
  }
});

// Get service details
app.get("/:serviceId", async (c) => {
  try {
    const serviceId = c.req.param("serviceId");
    const db = c.env.DB;

    const service = await db
      .prepare(
        `SELECT s.*, sc.display_name as category_name 
         FROM services s
         JOIN service_categories sc ON s.category_id = sc.id
         WHERE s.id = ?`
      )
      .bind(serviceId)
      .first();

    if (!service) {
      return c.json({ error: "Service not found" }, 404);
    }

    return c.json(service);
  } catch (error: unknown) {
    console.error("Error fetching service:", error);
    return c.json({ error: "Failed to fetch service" }, 500);
  }
});

// Purchase service
app.post("/purchase", async (c) => {
  try {
    const {
      serviceId,
      amountBRL,
      cryptoSymbol,
      amountCrypto,
      txHash,
      phoneNumber,
      documentNumber,
      additionalData,
    } = await c.req.json();

    if (!serviceId || !amountBRL || !cryptoSymbol || !amountCrypto) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const db = c.env.DB;

    // Get service details
    const service = await db
      .prepare("SELECT * FROM services WHERE id = ? AND is_active = 1")
      .bind(serviceId)
      .first();

    if (!service) {
      return c.json({ error: "Service not found or inactive" }, 404);
    }

    // Validate amount range
    const minAmount = parseFloat(service.min_amount_brl as string);
    const maxAmount = parseFloat(service.max_amount_brl as string);
    const requestedAmount = parseFloat(amountBRL);

    if (requestedAmount < minAmount || requestedAmount > maxAmount) {
      return c.json(
        { error: `Amount must be between R$ ${minAmount} and R$ ${maxAmount}` },
        400
      );
    }

    // Calculate fees and exchange rate
    const feePercent = Number(service.processing_fee_percent) || 2.0;
    const processingFee = requestedAmount * (feePercent / 100);
    const totalBRL = requestedAmount + processingFee;

    // Exchange rate (simplified - in production, use real-time rates)
    const exchangeRate = 5.0; // 1 USDT = 5 BRL (example)
    const totalCrypto = totalBRL / exchangeRate;

    // Create purchase record
    const result = await db
      .prepare(
        `INSERT INTO service_purchases (
          service_id,
          amount_brl,
          amount_crypto,
          crypto_symbol,
          exchange_rate,
          processing_fee_brl,
          total_paid_crypto,
          tx_hash,
          phone_number,
          document_number,
          additional_data,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        serviceId,
        amountBRL,
        amountCrypto,
        cryptoSymbol,
        exchangeRate,
        processingFee.toFixed(2),
        totalCrypto.toFixed(6),
        txHash || "",
        phoneNumber || "",
        documentNumber || "",
        additionalData || "",
        "processing"
      )
      .run();

    const purchaseId = result.meta.last_row_id;

    // Simulate service provisioning
    // In production, integrate with actual service providers (RecargaPay, etc.)
    setTimeout(async () => {
      try {
        const voucherCode = generateVoucherCode(service.service_name as string);
        const voucherPin = generateVoucherPin();

        await db
          .prepare(
            `UPDATE service_purchases 
             SET status = 'completed',
                 voucher_code = ?,
                 voucher_pin = ?,
                 completed_at = CURRENT_TIMESTAMP
             WHERE id = ?`
          )
          .bind(voucherCode, voucherPin, purchaseId)
          .run();
      } catch (error) {
        console.error("Error completing purchase:", error);
      }
    }, 2000);

    return c.json({
      purchaseId,
      status: "processing",
      amountBRL,
      processingFee: processingFee.toFixed(2),
      totalBRL: totalBRL.toFixed(2),
      totalCrypto: totalCrypto.toFixed(6),
      estimatedTime: "2-5 minutos",
    });
  } catch (error: unknown) {
    console.error("Error processing purchase:", error);
    return c.json({ error: "Failed to process purchase" }, 500);
  }
});

// Get purchase status
app.get("/purchase/:purchaseId", async (c) => {
  try {
    const purchaseId = c.req.param("purchaseId");
    const db = c.env.DB;

    const purchase = await db
      .prepare(
        `SELECT sp.*, s.service_name, s.provider_name, sc.display_name as category_name
         FROM service_purchases sp
         JOIN services s ON sp.service_id = s.id
         JOIN service_categories sc ON s.category_id = sc.id
         WHERE sp.id = ?`
      )
      .bind(purchaseId)
      .first();

    if (!purchase) {
      return c.json({ error: "Purchase not found" }, 404);
    }

    return c.json(purchase);
  } catch (error: unknown) {
    console.error("Error fetching purchase:", error);
    return c.json({ error: "Failed to fetch purchase" }, 500);
  }
});

// Get user purchase history
app.get("/history/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const db = c.env.DB;

    const { results } = await db
      .prepare(
        `SELECT sp.*, s.service_name, s.provider_name, sc.display_name as category_name
         FROM service_purchases sp
         JOIN services s ON sp.service_id = s.id
         JOIN service_categories sc ON s.category_id = sc.id
         WHERE sp.user_id = ?
         ORDER BY sp.created_at DESC
         LIMIT 50`
      )
      .bind(userId)
      .all();

    return c.json(results);
  } catch (error: unknown) {
    console.error("Error fetching history:", error);
    return c.json({ error: "Failed to fetch history" }, 500);
  }
});

// Helper functions
function generateVoucherCode(serviceName: string): string {
  const prefix = serviceName.substring(0, 3).toUpperCase();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${random}`;
}

function generateVoucherPin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default app;
