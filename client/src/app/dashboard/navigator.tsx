import * as React from "react";
import Divider from "@mui/material/Divider";
import Drawer, { DrawerProps } from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import PublishIcon from "@mui/icons-material/Publish";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import { GlobalContext } from "./global-context";
import { signOut } from "../../auth";

const categories = [
  {
    id: "Articulos",
    children: [
      {
        id: "Listado",
        icon: <ArticleIcon />,
        active: true,
        href: "/dashboard/articles",
        pageTitle: "Artículos",
      },
      {
        id: "Publicar",
        icon: <PublishIcon />,
        href: "/dashboard/article/add/",
        pageTitle: "Agregar Artículo",
      },
    ],
  },
];

const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};

export default function Navigator(props: DrawerProps) {
  const { ...other } = props;
  const { globalState } = React.useContext(GlobalContext);

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          sx={{ ...item, ...itemCategory, fontSize: 22, color: "#fff" }}
        >
          Administración Lacta Consejos
        </ListItem>

        <Link href={`/dashboard`}>
          <ListItemButton
            sx={{ ...item, ...itemCategory }}
            selected={globalState?.title === "Dashboard"}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Inicio</ListItemText>
          </ListItemButton>
        </Link>
        {categories.map(({ id, children }) => (
          <Box sx={{ bgcolor: "#101F33" }} key={id}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: "#fff" }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, href, pageTitle }) => (
              <Link href={href} key={childId}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={globalState?.title === pageTitle}
                    sx={item}
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText>{childId}</ListItemText>
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}

        <ListItemButton
          sx={{ ...item, ...itemCategory }}
          onClick={() => {
            signOut();
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText>Salir</ListItemText>
        </ListItemButton>
      </List>
    </Drawer>
  );
}
