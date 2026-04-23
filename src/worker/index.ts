import { Hono } from "hono";
import transactions from "./routes/transactions";
import establishments from "./routes/establishments";
import analytics from "./routes/analytics";
import plans from "./routes/plans";
import conversions from "./api/conversions";
import pix from "./api/pix";
import services from "./api/services";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.route("/api/transactions", transactions);
app.route("/api/establishments", establishments);
app.route("/api/analytics", analytics);
app.route("/api/plans", plans);
app.route("/api/conversions", conversions);
app.route("/api/pix", pix);
app.route("/api/services", services);

export default app;
