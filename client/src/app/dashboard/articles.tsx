import React, { useState } from "react";
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
import { Button, Typography } from "@mui/material";
import parse from "html-react-parser";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import Modal from "@mui/material/Modal";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  textAlign: "right",
};

const backendBaseURL = process.env.BACKEND_URL;

export default function Articles({
  dataArticles,
  loadArticles,
}: {
  dataArticles: ArticlesResponse;
  loadArticles: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [articleIdToDelete, setArticleIdToDelete] = useState<string>();
  const [articleTitleToDelete, setArticleTitleToDelete] = useState<string>();

  const handleOpenModal = (id: string, title: string) => {
    setArticleIdToDelete(id);
    setArticleTitleToDelete(title);
    setOpen(true);
  };
  const handleCloseModal = () => setOpen(false);

  const deleteArticle = () => {
    fetch(`${backendBaseURL}/articles/${articleIdToDelete}`, {
      headers: {
        "Content-Type": "application/json", // Set the content type if you're sending JSON data
      },
      method: "DELETE",
      mode: "cors",
    })
      .then((res) => res.json())
      .then(() => {
        handleCloseModal();
        loadArticles();
      })
      .catch((err) => console.error(err));
  };

  return dataArticles ? (
    <>
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
                    src={`data:image/png;base64,${row.image}`}
                    alt={row.title}
                  />
                </TableCell>
                <TableCell align="right">
                  <Link href={`/dashboard/article/edit/${row._id}`}>
                    <EditIcon sx={{ color: "#009BE5" }} />
                  </Link>
                  <DeleteIcon
                    sx={{ color: "#009BE5", cursor: "pointer", marginLeft: 1 }}
                    onClick={() => handleOpenModal(row._id, row.title)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="Confirmacion para borrar el artículo"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center" }}
          >
            <span>
              ¿Desea borrar el artìculo <strong>{articleTitleToDelete}</strong>{" "}
              articulo?
            </span>
          </Typography>
          <Button onClick={deleteArticle}>Si</Button>
          <Button onClick={handleCloseModal}>No</Button>
        </Box>
      </Modal>
    </>
  ) : (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}
