"use client";
import { useState, useContext, useEffect, ChangeEvent } from "react";
import { GlobalContext } from "../../../global-context";
import { SingleArticleResponse } from "../../../ownTypes";
import {
  Box,
  FormControl,
  Input,
  InputLabel,
  LinearProgress,
  Typography,
  Chip,
} from "@mui/material";
import Image from "next/image";
import SaveIcon from "@mui/icons-material/Save";
import { Button } from "@mui/material";
import { EditorProps } from "react-draft-wysiwyg";
import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import { toolbarconfig } from "../../../../../_lib/editor-toolbar-config";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Modal from "@mui/material/Modal";
import dynamic from "next/dynamic";

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

const Editor = dynamic<EditorProps>(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export default function Edit({
  //@ts-ignore
  params: { id },
}) {
  const { setGlobalState } = useContext(GlobalContext);
  useEffect(() => {
    if (setGlobalState) {
      setGlobalState({ title: "Editar Artículo" });
    }
  }, [setGlobalState]);

  const [dataArticle, setDataArticle] = useState<SingleArticleResponse>();
  const [title, setTitle] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [dataCategories, setDataCategories] = useState<string[]>();
  const [editorState, setEditorState] = useState(() => {
    const content = ContentState.createFromText("Content is loading...");
    return EditorState.createWithContent(content);
  });
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await fetch(`${backendBaseURL}/articles/${id}`, {
          mode: "cors",
        });
        setDataArticle(await response?.json());
      } catch (err) {
        console.log(err, `Could not load the article id:${id}`);
      }
    };
    loadArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const onCategoryChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setCategory(event.target.value);
  };

  useEffect(() => {
    setTitle(dataArticle?.title);

    const blocksFromHTML = convertFromHTML(dataArticle?.content || "");
    const content = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(content));
  }, [dataArticle]);

  const saveArticle = async () => {
    let bufferImage = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      bufferImage = buffer.toString("base64");
    }

    const data = {
      title: title ? title.trim() : "",
      content: convertContentToHTML(editorState),
      image: file ? bufferImage : dataArticle?.image,
      category: category ? category.trim() : "",
    };

    fetch(`${backendBaseURL}/articles/${id}`, {
      headers: {
        "Content-Type": "application/json", // Set the content type if you're sending JSON data
      },
      method: "PATCH",
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
    try {
      saveArticle();
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    }
  };

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const onTitleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setTitle(event.target.value);
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

  return dataArticle && dataCategories ? (
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
            defaultValue={dataArticle.category}
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
          <Image
            width={80}
            height={80}
            src={`data:image/png;base64,${dataArticle.image}`}
            alt={dataArticle.title}
          />
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
            Artículo actualizado satisfactoriamente!
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
