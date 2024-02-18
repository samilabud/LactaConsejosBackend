"use client";
import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "./global-context";

export default function Page() {
  const { setGlobalState } = useContext(GlobalContext);
  useEffect(() => {
    if (setGlobalState) {
      setGlobalState({ title: "Dashboard" });
    }
  }, [setGlobalState]);
  return (
    <main className="flex flex-wrap">
      <a className="menuItem" href="/dashboard/articles">
        Ver Lista de Artículos
      </a>
      <a className="menuItem" href="/dashboard/article/add">
        Publicar Articulos
      </a>
      <a className="menuItem" href="/dashboard">
        Cambiar Datos de Perfil
      </a>
      <a className="menuItem" href="/dashboard">
        Publicar centro de lactancia
      </a>
    </main>
  );
}
