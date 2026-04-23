import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
  try {
    const { name, description, owner_email } = await c.req.json();

    if (!name) {
      return c.json({ error: "Name is required" }, 400);
    }

    const db = c.env.DB;
    const result = await db
      .prepare(
        `INSERT INTO establishments (name, description, owner_email) 
         VALUES (?, ?, ?)`
      )
      .bind(name, description || "", owner_email || "")
      .run();

    return c.json({
      id: result.meta.last_row_id,
      name,
      description,
      owner_email,
    });
  } catch (error) {
    console.error("Create establishment error:", error);
    return c.json({ error: "Failed to create establishment" }, 500);
  }
});

app.get("/", async (c) => {
  try {
    const db = c.env.DB;
    const result = await db
      .prepare(
        `SELECT * FROM establishments 
         ORDER BY created_at DESC`
      )
      .all();

    return c.json(result.results);
  } catch (error) {
    console.error("Fetch establishments error:", error);
    return c.json({ error: "Failed to fetch establishments" }, 500);
  }
});

app.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const db = c.env.DB;

    const establishment = await db
      .prepare("SELECT * FROM establishments WHERE id = ?")
      .bind(id)
      .first();

    if (!establishment) {
      return c.json({ error: "Establishment not found" }, 404);
    }

    return c.json(establishment);
  } catch (error) {
    console.error("Fetch establishment error:", error);
    return c.json({ error: "Failed to fetch establishment" }, 500);
  }
});

app.get("/:id/wallets", async (c) => {
  try {
    const establishmentId = c.req.param("id");
    const db = c.env.DB;

    // Get establishment
    const establishment = await db
      .prepare("SELECT * FROM establishments WHERE id = ?")
      .bind(establishmentId)
      .first();

    if (!establishment) {
      return c.json({ error: "Establishment not found" }, 404);
    }

    // Get wallets
    const wallets = await db
      .prepare("SELECT * FROM wallets WHERE establishment_id = ? AND is_active = 1")
      .bind(establishmentId)
      .all();

    return c.json({
      establishment,
      wallets: wallets.results,
    });
  } catch (error) {
    console.error("Fetch establishment wallets error:", error);
    return c.json({ error: "Failed to fetch wallets" }, 500);
  }
});

app.post("/:id/wallets", async (c) => {
  try {
    const establishmentId = c.req.param("id");
    const { crypto_symbol, address } = await c.req.json();

    if (!crypto_symbol || !address) {
      return c.json({ error: "Crypto symbol and address are required" }, 400);
    }

    const db = c.env.DB;

    const result = await db
      .prepare(
        `INSERT INTO wallets (establishment_id, crypto_symbol, address) 
         VALUES (?, ?, ?)`
      )
      .bind(establishmentId, crypto_symbol, address)
      .run();

    return c.json({
      id: result.meta.last_row_id,
      establishment_id: establishmentId,
      crypto_symbol,
      address,
    });
  } catch (error) {
    console.error("Create wallet error:", error);
    return c.json({ error: "Failed to create wallet" }, 500);
  }
});

export default app;
