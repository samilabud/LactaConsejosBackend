export type SingleArticleResponse =
  | {
      _id: string;
      title: string;
      content: string;
      image: string;
      category: string;
    }
  | undefined;
export type ArticlesResponse =
  | {
      _id: string;
      title: string;
      content: string;
      image: string;
      category: string;
    }[]
  | undefined;
