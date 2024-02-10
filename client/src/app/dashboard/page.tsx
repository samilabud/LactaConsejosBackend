export default function Page() {
  return (
    <div className="flex flex-wrap">
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
    </div>
  );
}
