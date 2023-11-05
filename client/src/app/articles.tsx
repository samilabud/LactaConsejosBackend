import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import { ArticlesResponse } from "./ownTypes";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import parse from "html-react-parser";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";

export default function Articles({
  dataArticles,
}: {
  dataArticles: ArticlesResponse;
}) {
  const backendBaseURL = process.env.BACKEND_URL;
  return dataArticles ? (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Listado de articulos">
        <TableHead>
          <TableRow>
            <TableCell>Titulo</TableCell>
            <TableCell>Contenido</TableCell>
            <TableCell>Imagen</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {dataArticles.map((row) => (
            <TableRow
              key={row._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell>
                <Typography
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {parse(row.content)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Image
                  width={80}
                  height={80}
                  src={`${backendBaseURL}${row.image}`}
                  alt={row.title}
                />
              </TableCell>
              <TableCell align="right">
                <Link href={`/article/edit/${row._id}`}>
                  <EditIcon sx={{ color: "#009BE5" }} />
                </Link>
                <DeleteIcon sx={{ color: "#009BE5" }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}
