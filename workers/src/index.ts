import { Hono, MiddlewareHandler } from "hono";
import { reginsterArticle } from "./register";
import { Article, ArticleReq } from "./types";
import { v4 as uuidv4 } from "uuid";
import { handleInteractionRequest, verifyKeyMiddleware } from "./discord";
import { APIInteraction } from "discord-api-types/v10";
import { HonoAppContext } from "./bindings";

const app = new Hono<HonoAppContext>();

const middleware = (): MiddlewareHandler<HonoAppContext> => async (c, next) => {
  const authorization = c.req.header("Authorization");
  if (authorization !== c.env.WORKER_TOKEN) {
    return c.text("Unauthorized", 401);
  }
  return await next();
}

app.get("/", (c) => c.text("It works!"));

app.post("/register", middleware(), async (c) => {
  let param: ArticleReq;
  try {
    param = await c.req.json<ArticleReq>();
    if (typeof param.url !== "string" || param.url === "") {
      return c.json({ status: "error", message: "url is required" });
    }
  } catch (e) {
    return c.json({ status: "error", message: "invalid json" });
  }

  let date;
  try {
    date = param.date
      ? new Date(param.date).toISOString()
      : new Date().toISOString();
  } catch (e) {
    return c.json({ status: "error", message: "invalid date" });
  }

  const article: Article = {
    id: uuidv4(),
    url: param.url,
    date,
  };

  const res = await reginsterArticle(article, c.env.DB);
  return c.json(res);
});

app.post("/api/interactions", verifyKeyMiddleware(), async (c) => {
  const interaction = await c.req.json<APIInteraction>();
  const response = await handleInteractionRequest(interaction);
  if (response) {
    return c.json(response);
  } else {
    return c.json({ status: "error", message: "unknown interaction" })
  }
});

export default app;
