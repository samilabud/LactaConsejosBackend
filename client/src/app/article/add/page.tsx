"use client";
import { useState, useContext, useEffect, ChangeEvent } from "react";
import { GlobalContext } from "../../global-context";
import {
  Box,
  Chip,
  FormControl,
  Input,
  InputLabel,
  LinearProgress,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Button } from "@mui/material";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { toolbarconfig } from "../../../_lib/editor-toolbar-config";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Modal from "@mui/material/Modal";
import { useRouter } from "next/navigation";

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

export default function Page() {
  const { setGlobalState } = useContext(GlobalContext);
  const router = useRouter();

  useEffect(() => {
    if (setGlobalState) {
      setGlobalState({ title: "Agregar Artículo" });
    }
  }, [setGlobalState]);

  const [title, setTitle] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [dataCategories, setDataCategories] = useState<string[]>();

  const [editorState, setEditorState] = useState(() => {
    const content = ContentState.createFromText("");
    return EditorState.createWithContent(content);
  });
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`${backendBaseURL}/articles/categories`, {
          mode: "cors",
        });
        setDataCategories(await response?.json());
      } catch (err) {
        console.log(err, `Could not load the categories`);
      }
    };
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addArticle = (imagePath: string) => {
    const data = {
      title: title,
      content: convertContentToHTML(editorState),
      image: `/images/articles/${imagePath}`,
      category: category,
    };
    fetch(`${backendBaseURL}/articles/`, {
      headers: {
        "Content-Type": "application/json", // Set the content type if you're sending JSON data
      },
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        handleOpenModal();
      })
      .catch((err) => console.error(err));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      // handle the error
      if (!res.ok) throw new Error(await res.text());
      const { path } = await res.json();
      // @ts-ignore
      addArticle(path);
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    }
  };

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => {
    setOpen(false);
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  const onTitleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setTitle(event.target.value);
  };

  const onCategoryChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setCategory(event.target.value);
  };

  const onEditorChange = (newEditorState: any) => {
    setEditorState(newEditorState);
  };

  // This function converts the editor content to HTML
  function convertContentToHTML(editorState: EditorState) {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const markup = draftToHtml(rawContentState);
    return markup;
  }

  return dataCategories ? (
    <>
      <form onSubmit={onSubmit}>
        <FormControl fullWidth>
          <InputLabel htmlFor="title" focused shrink>
            Titulo
          </InputLabel>
          <Input
            id="title"
            aria-describedby="Titulo del articulo"
            value={title}
            fullWidth
            required
            onChange={(e) => onTitleChange(e)}
          />
        </FormControl>

        <FormControl sx={{ marginTop: 5 }}>
          <InputLabel htmlFor="category" focused shrink>
            Categoria
          </InputLabel>
          <Input
            id="category"
            aria-describedby="Categoría del articulo"
            value={category}
            fullWidth
            required
            onChange={(e) => onCategoryChange(e)}
          />
          <Box sx={{ marginTop: 2 }}>
            {dataCategories.map((category, idx) => (
              <Chip
                key={idx}
                label={category}
                variant="outlined"
                onClick={() => setCategory(category)}
                sx={{ marginRight: 1 }}
              />
            ))}
          </Box>
        </FormControl>

        <FormControl fullWidth sx={{ marginTop: 5, marginBottom: 5 }}>
          <InputLabel htmlFor="content" focused shrink>
            Contenido
          </InputLabel>
          <Box sx={{ marginTop: 5 }}>
            <Editor
              editorState={editorState}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
              onEditorStateChange={onEditorChange}
              toolbar={toolbarconfig}
            />
          </Box>
        </FormControl>

        <FormControl fullWidth sx={{ marginTop: 5, marginBottom: 5 }}>
          <Input
            id="image"
            aria-describedby="Imagen para el articulo"
            fullWidth
            type="file"
            name="file"
            onChange={(e) => {
              const inputElement = e.target as HTMLInputElement;
              setFile(inputElement.files?.[0]);
            }}
          />
        </FormControl>

        <FormControl fullWidth>
          <Button endIcon={<SaveIcon />} fullWidth type="submit">
            Save
          </Button>
        </FormControl>
      </form>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center" }}
          >
            Artículo agregado satisfactoriamente!
          </Typography>
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </Box>
      </Modal>
    </>
  ) : (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}
