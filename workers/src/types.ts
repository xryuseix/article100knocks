export type Article = {
  id: string;
  url: string;
  date: string;
};

export type ArticleReq = Partial<Article>;
