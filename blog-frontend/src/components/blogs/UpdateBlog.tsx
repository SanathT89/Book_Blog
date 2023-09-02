import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useEffect, useRef } from "react";
//import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { addStyles, htmlElmStyles } from "../../styles/add-blog-styles";
import { UPDATE_BLOG } from "../graphql/mutations";
import { GET_BLOG_BY_ID } from "../graphql/queries";

const UpdateBlog = () => {
  const id = useParams().id;
  const [updateBlog] = useMutation(UPDATE_BLOG);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const contentRef = useRef<HTMLParagraphElement | null>(null);
  const { data, error, loading, refetch } = useQuery(GET_BLOG_BY_ID, {
    variables: {
      id,
    },
  });
  useEffect(() => {
    if (data && headingRef.current && contentRef.current) {
      headingRef.current.innerHTML = data.blog.title;
      contentRef.current.innerHTML = data.blog.content;
    }
  }, [id, data]);

  if (loading) {
    return <LinearProgress color="warning" />;
  }

  const handleSubmit = async () => {
    if (
      headingRef.current &&
      headingRef.current?.innerText.trim().length > 0 &&
      contentRef.current &&
      contentRef.current?.innerText.trim().length > 0
    ) {
      const title = headingRef.current.innerText;
      const content = contentRef.current.innerText;
      console.log(title);
      console.log(content);

      try {
        const res = await updateBlog({
          variables: {
            id,
            title,
            content,
          },
        });
        /*toast.promise(refetch(), {
          error: "Unexpected Error",
          success: "Fetching Complete",
          loading: "Hold On!",
        });*/
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };

  return (
    data && (
      <Box sx={addStyles.conatiner}>
        <Box sx={addStyles.blogHeader}>
          <Typography>Authored By: </Typography>
          <Button onClick={handleSubmit} color="success" variant="contained">
            Publish
          </Button>
        </Box>
        <Box sx={addStyles.formContainer}>
          <h2 ref={headingRef} style={htmlElmStyles.h2} contentEditable>
            Post Your Story Title
          </h2>
          <p ref={contentRef} style={htmlElmStyles.p} contentEditable>
            Describe Your Story
          </p>
        </Box>
      </Box>
    )
  );
};

export default UpdateBlog;