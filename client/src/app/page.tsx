"use client";
import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "./global-context";
import Articles from "./articles";
import { ArticlesResponse } from "./ownTypes";

export default function Page() {
  const { setGlobalState } = useContext(GlobalContext);
  useEffect(() => {
    if (setGlobalState) {
      setGlobalState({ title: "Artículos" });
    }
  }, [setGlobalState]);

  const [dataArticles, setDataArticles] = useState<ArticlesResponse>();
  const backendBaseURL = process.env.BACKEND_URL;
  const loadArticles = async () => {
    try {
      const response = await fetch(`${backendBaseURL}/articles/`, {
        mode: "cors",
      });
      setDataArticles(await response?.json());
    } catch (err) {
      console.log(err, "Could not load articles");
    }
  };
  useEffect(() => {
    loadArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Articles dataArticles={dataArticles} loadArticles={loadArticles} />;
}
