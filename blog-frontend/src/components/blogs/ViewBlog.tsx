import { useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { BiScan, BiSend } from "react-icons/bi";
import { FaComments } from "react-icons/fa";
import { ImMail } from "react-icons/im";
import { useParams } from "react-router-dom";
import { blogPageStyles } from "../../styles/view-styles";
import { GET_BLOG_BY_ID } from "../graphql/queries";
import { BsCalendar2DateFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { ADD_COMMENT, DELETE_COMMENT } from "../graphql/mutations";
import { AiOutlineDelete } from "react-icons/ai";
//import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
function getInitials(name: string) {
  const nameAr = name.split(" ");
  if (nameAr.length > 1) {
    return `${nameAr[0][0]}${nameAr[1][0]}`;
  }
  return `${nameAr[0][0]}`;
}
const ViewBlog = () => {
  const isLoggedIn = useSelector((state: any) => state.isLoggedIn);
  const user: string = JSON.parse(
    localStorage.getItem("userData") as string
  )?.id;
  const { register, handleSubmit } = useForm();
  const id = useParams().id;
  const [addCommentToBlog, addCommentResponse] = useMutation(ADD_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);
  const { data, error, loading, refetch } = useQuery(GET_BLOG_BY_ID, {
    variables: {
      id,
    },
  });
  if (loading) {
    return <LinearProgress />;
  }
  if (error) {
    return (
      <Dialog open={true}>
        <DialogContent>Error Fetching Blog</DialogContent>
      </Dialog>
    );
  }
  const commentHandler = async (data: any) => {
    if (isLoggedIn) {
      const text = data.comment;
      const date = new Date();

      try {
        await addCommentToBlog({
          variables: {
            text,
            date,
            blog: id,
            user,
          },
        });

        /*toast.promise(refetch(), {
          error: "Unexpected Error",
          success: "Fetching Complete",
          loading: "Hold On!",
        });*/
      } catch (err: any) {
        return console.log(err.message);
      }
    } else {
      //toast.error("You Need To Login First!");
    }
  };
  const handleCommentDelete = async (id: string) => {
    try {
      await deleteComment({
        variables: {
          id,
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
  };
  return (
    data && (
      <Box sx={blogPageStyles.container}>
        <Box sx={blogPageStyles.profileHeader}>
          <Typography sx={blogPageStyles.headerText}>
            {data.blog.user.name}
          </Typography>
          <Box sx={blogPageStyles.profileHeaderItems}>
            {/*  */}
            <ImMail size={20} />
            <Typography sx={blogPageStyles.headerText}>
              {data.blog.user.email}
            </Typography>
            <Box
              sx={{ ml: "auto", display: "flex", gap: 3, alignItems: "center" }}
            >
              <BsCalendar2DateFill />
              <Typography fontFamily="work sans" fontWeight="500">
                {new Date(Number(data.blog.date)).toDateString()}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography sx={blogPageStyles.blogTitle}>{data.blog.title}</Typography>
        <Typography sx={blogPageStyles.blogContent}>
          {data.blog.content}{" "}
        </Typography>
        <Box sx={blogPageStyles.commentBox}>
          Comments: {"   "}
          <IconButton>
            <FaComments size={"30"} />
          </IconButton>
        </Box>
        {isLoggedIn && (
          <Box sx={blogPageStyles.commentInputContainer}>
            <Typography margin={2} fontFamily={"Arvo"}>
              Add Your Comment
            </Typography>
            <Box sx={blogPageStyles.inputLayout}>
              <TextField
                {...register("comment")}
                type="textarea"
                sx={blogPageStyles.textField}
                InputProps={{
                  style: {
                    width: "60vw",
                    borderRadius: "20px",
                    fontFamily: "work sans",
                  },
                  endAdornment: (
                    <IconButton onClick={handleSubmit(commentHandler)}>
                      <BiSend size="25" />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </Box>
        )}
        {data.blog.comments.length > 0 && (
          <Box sx={blogPageStyles.comments}>
            {data.blog.comments.map((comment: any) => (
              <Box key={comment.id} sx={blogPageStyles.commentItem}>
                <Avatar
                  sx={{ padding: 1, color: "red", bgcolor: "transparent" }}
                >
                  {getInitials(comment.user.name)}
                </Avatar>
                <Typography sx={blogPageStyles.commentText}>
                  {comment.text}
                </Typography>
                {comment.user.id === user && (
                  <IconButton
                    onClick={async () => await handleCommentDelete(comment.id)}
                    sx={{ ml: "auto" }}
                    color="error"
                  >
                    <AiOutlineDelete />
                  </IconButton>
                )}
              </Box>
            ))}{" "}
          </Box>
        )}
      </Box>
    )
  );
};

export default ViewBlog;