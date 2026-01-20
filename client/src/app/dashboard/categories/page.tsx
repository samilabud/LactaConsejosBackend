"use client";
import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../global-context";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Modal,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const backendBaseURL = process.env.BACKEND_URL;
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

export default function Categories() {
  const { setGlobalState } = useContext(GlobalContext);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (setGlobalState) {
      setGlobalState({ title: "Administrar Categorías" });
    }
    loadCategories();
  }, [setGlobalState]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendBaseURL}/articles/categories`, {
        mode: "cors",
      });
      const data = await response.json();
      setCategories(data.filter((c: string) => c && c.trim() !== ""));
    } catch (err) {
      console.error("Could not load categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (name: string) => {
    setOldName(name);
    setNewName(name);
    setOpen(true);
  };

  const handleCloseModal = () => setOpen(false);

  const renameCategory = async () => {
    if (!newName || newName.trim().length === 0) {
      alert("Por favor, ingresa un nombre válido.");
      return;
    }

    try {
      const response = await fetch(`${backendBaseURL}/articles/categories/rename`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ oldName, newName }),
      });

      if (response.ok) {
        handleCloseModal();
        loadCategories();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error al renombrar la categoría");
      }
    } catch (err) {
      console.error("Error renaming category", err);
      alert("Error al conectar con el servidor");
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Listado de categorías">
          <TableHead>
            <TableRow>
              <TableCell>Nombre de la Categoría</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, idx) => (
              <TableRow key={idx}>
                <TableCell component="th" scope="row">
                  {category}
                </TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => handleOpenModal(category)}
                    startIcon={<EditIcon />}
                  >
                    Renombrar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="Renombrar categoría"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ textAlign: "center", mb: 2 }}>
            Renombrar Categoría
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Cambiando el nombre de <strong>{oldName}</strong> en todos los artículos.
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel htmlFor="newName" focused shrink>
              Nuevo Nombre
            </InputLabel>
            <Input
              id="newName"
              value={newName}
              fullWidth
              onChange={(e) => setNewName(e.target.value)}
            />
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button variant="contained" onClick={renameCategory}>
              Guardar Cambios
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
