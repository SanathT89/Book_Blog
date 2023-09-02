import { useMutation } from "@apollo/client";
import { Box, Button, Typography } from "@mui/material";
import { useRef } from "react";
import { addStyles, htmlElmStyles } from "../../styles/add-blog-styles";
import { ADD_BLOG } from "../graphql/mutations";
//import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const contentRef = useRef<HTMLParagraphElement | null>(null);
  const [addBlog] = useMutation(ADD_BLOG);
  const handleSubmit = async () => {
    if (
      headingRef.current &&
      headingRef.current?.innerText.trim().length > 0 &&
      contentRef.current &&
      contentRef.current?.innerText.trim().length > 0
    ) {
      const title = headingRef.current.innerText;
      const content = contentRef.current.innerText;
      const date = new Date();
      const user = JSON.parse(localStorage.getItem("userData") as string).id;
      try {
        //toast.loading("Publishing Article", { id: "add" });
        const res = await addBlog({
          variables: {
            title,
            content,
            date,
            user,
          },
        });
        const data = await res.data;
        console.log(data);
        //toast.success("Done Publishing", { id: "add" });
        navigate(`/blogs`);
      } catch (err: any) {
        //toast.error("Error Publishing", { id: "add" });
        console.log(err.message);
      }
    }
  };
  const user: string = JSON.parse(
    localStorage.getItem("userData") as string
  )?.name;
  return (
    <Box sx={addStyles.conatiner}>
      <Box sx={addStyles.blogHeader}>
        <Typography fontFamily={"arvo"}>Authored By: {user}</Typography>
        <Button
          sx={{ borderRadius: 10 }}
          onClick={handleSubmit}
          color="success"
          variant="contained"
        >
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
  );
};

export default AddBlog;