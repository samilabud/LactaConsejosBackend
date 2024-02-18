"use client";
import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import HelpIcon from "@mui/icons-material/Help";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { GlobalContext } from "./global-context";

export default function Header() {
  const globalContext = useContext(GlobalContext);
  return (
    <React.Fragment>
      <AppBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            alignContent="center"
            height={130}
            spacing={1}
          >
            <Grid item lg>
              <Typography color="inherit" variant="h5" component="h1">
                {globalContext?.globalState?.title}
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Help">
                <IconButton color="inherit">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
