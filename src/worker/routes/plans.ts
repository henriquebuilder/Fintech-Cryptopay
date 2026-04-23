import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  try {
    const db = c.env.DB;
    const result = await db
      .prepare("SELECT * FROM subscription_plans ORDER BY fee_percent DESC")
      .all();

    return c.json(result.results);
  } catch (error) {
    console.error("Fetch plans error:", error);
    return c.json({ error: "Failed to fetch plans" }, 500);
  }
});

app.post("/upgrade/:establishmentId", async (c) => {
  try {
    const establishmentId = c.req.param("establishmentId");
    const { planName } = await c.req.json();

    if (!["free", "premium"].includes(planName)) {
      return c.json({ error: "Invalid plan name" }, 400);
    }

    const db = c.env.DB;

    // Get the plan details
    const plan = await db
      .prepare("SELECT * FROM subscription_plans WHERE name = ?")
      .bind(planName)
      .first();

    if (!plan) {
      return c.json({ error: "Plan not found" }, 404);
    }

    // Update establishment
    await db
      .prepare(
        `UPDATE establishments 
         SET subscription_plan = ?, 
             transaction_fee_percent = ?,
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`
      )
      .bind(planName, plan.fee_percent, establishmentId)
      .run();

    return c.json({
      message: "Plan updated successfully",
      plan: planName,
      fee_percent: plan.fee_percent,
    });
  } catch (error) {
    console.error("Upgrade plan error:", error);
    return c.json({ error: "Failed to upgrade plan" }, 500);
  }
});

export default app;
