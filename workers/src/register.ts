import { urls } from "./schema";
import { Article } from "./types";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

const isExistArticle = async (article: Article, dbEnv: D1Database) => {
  const db = drizzle(dbEnv);
  const result = await db
    .select()
    .from(urls)
    .where(eq(urls.url, article.url))
    .all();
  
    const getDate = (date: string) => {
      return new Date(date).toISOString().split('T')[0];
    }
  
  for (const r of result) {
    try {
      if (getDate(r.date) === getDate(article.date)) {
        return true;
      }
    } catch (e) {
      return true;
    }
  }
  return false;
};

export const reginsterArticle = async (article: Article, dbEnv: D1Database) => {
  const db = drizzle(dbEnv);
  if (await isExistArticle(article, dbEnv)) {
    return { status: "error", message: "error: already exists" };
  }
  try {
    const result = await db.insert(urls).values(article).execute();
    return { status: result.success ? "ok" : "error" };
  } catch (e) {
    console.error(e);
    return { status: "error", message: "error: internal server error" };
  }
};
