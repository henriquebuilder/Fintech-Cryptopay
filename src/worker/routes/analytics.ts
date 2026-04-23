import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/establishment/:id", async (c) => {
  try {
    const establishmentId = c.req.param("id");
    const db = c.env.DB;

    // Get establishment details
    const establishment = await db
      .prepare("SELECT * FROM establishments WHERE id = ?")
      .bind(establishmentId)
      .first();

    if (!establishment) {
      return c.json({ error: "Establishment not found" }, 404);
    }

    // Check if premium plan
    if (establishment.subscription_plan !== "premium") {
      return c.json({ error: "Analytics available only for Premium plan" }, 403);
    }

    // Get transaction statistics
    const stats = await db
      .prepare(
        `SELECT 
          COUNT(*) as total_transactions,
          SUM(CAST(amount_usd AS REAL)) as total_revenue,
          SUM(CAST(platform_fee_usd AS REAL)) as total_fees,
          SUM(CAST(merchant_net_usd AS REAL)) as net_revenue,
          AVG(CAST(amount_usd AS REAL)) as avg_transaction
         FROM transactions 
         WHERE establishment_id = ? AND status = 'confirmed'`
      )
      .bind(establishmentId)
      .first();

    // Get daily revenue (last 30 days)
    const dailyRevenue = await db
      .prepare(
        `SELECT 
          DATE(created_at) as date,
          COUNT(*) as transactions,
          SUM(CAST(amount_usd AS REAL)) as revenue,
          SUM(CAST(merchant_net_usd AS REAL)) as net_revenue
         FROM transactions 
         WHERE establishment_id = ? 
           AND status = 'confirmed'
           AND created_at >= datetime('now', '-30 days')
         GROUP BY DATE(created_at)
         ORDER BY date DESC`
      )
      .bind(establishmentId)
      .all();

    // Get crypto breakdown
    const cryptoBreakdown = await db
      .prepare(
        `SELECT 
          crypto_symbol,
          COUNT(*) as transactions,
          SUM(CAST(amount_usd AS REAL)) as total_usd
         FROM transactions 
         WHERE establishment_id = ? AND status = 'confirmed'
         GROUP BY crypto_symbol`
      )
      .bind(establishmentId)
      .all();

    // Get recent transactions
    const recentTransactions = await db
      .prepare(
        `SELECT * FROM transactions 
         WHERE establishment_id = ? 
         ORDER BY created_at DESC 
         LIMIT 10`
      )
      .bind(establishmentId)
      .all();

    return c.json({
      establishment,
      stats,
      dailyRevenue: dailyRevenue.results,
      cryptoBreakdown: cryptoBreakdown.results,
      recentTransactions: recentTransactions.results,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return c.json({ error: "Failed to fetch analytics" }, 500);
  }
});

export default app;
