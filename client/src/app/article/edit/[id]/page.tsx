"use client";
import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../../../global-context";
import { SingleArticleResponse } from "../../../ownTypes";
import {
  Box,
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  LinearProgress,
} from "@mui/material";
import Image from "next/image";
import SaveIcon from "@mui/icons-material/Save";
import { Button } from "@mui/material";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { toolbarconfig } from "../../../../_lib/editor-toolbar-config";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function EditArticle({
  params: { id },
}: {
  params: any;
  id: string;
}) {
  const { setGlobalState } = useContext(GlobalContext);
  useEffect(() => {
    if (setGlobalState) {
      setGlobalState({ title: "Editar Artículo" });
    }
  }, [setGlobalState]);

  const [dataArticle, setDataArticle] = useState<SingleArticleResponse>();

  const [editorState, setEditorState] = useState(() => {
    const content = ContentState.createFromText("Content is loading...");
    return EditorState.createWithContent(content);
  });

  const onEditorChange = (newEditorState: any) => {
    setEditorState(newEditorState);
  };

  const backendBaseURL = process.env.BACKEND_URL;

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
    const blocksFromHTML = convertFromHTML(dataArticle?.content || "");
    const content = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(content));
  }, [dataArticle]);

  return dataArticle ? (
    <>
      <FormGroup>
        <FormControl fullWidth>
          <InputLabel htmlFor="title" disableAnimation>
            Titulo
          </InputLabel>
          <Input
            id="title"
            aria-describedby="Titulo del articulo"
            value={dataArticle.title}
            fullWidth
            required
          />
        </FormControl>

        <FormControl fullWidth sx={{ marginTop: 5, marginBottom: 5 }}>
          <InputLabel htmlFor="content" disableAnimation>
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
            src={`${backendBaseURL}${dataArticle.image}`}
            alt={dataArticle.title}
          />
          <Input
            id="image"
            aria-describedby="Contenido del articulo"
            value={dataArticle.image}
            fullWidth
            multiline
            required
          />
        </FormControl>

        <FormControl fullWidth>
          <Button endIcon={<SaveIcon />} fullWidth>
            Save
          </Button>
        </FormControl>
      </FormGroup>
    </>
  ) : (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}
