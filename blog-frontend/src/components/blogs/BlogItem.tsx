import { Card, CardActions, Icon, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { blogStyles, randomBgColor } from "../../styles/blog-list-styles";
import { BlogType } from "../../types/types";
import { FcCalendar } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useMutation } from "@apollo/client";
import { DELETE_BLOG } from "../graphql/mutations";
import { FaUser } from "react-icons/fa";
type Props = {
  blog: BlogType;
  showActions?: boolean;
};
const BlogItem = (props: Props) => {
  const navigate = useNavigate();
  const [deleteBlog, data] = useMutation(DELETE_BLOG);
  const handleClick = () => {
    return navigate(`/blog/view/${props.blog.id}`);
  };
  const editHandler = () => {
    return navigate(`/blog/update/${props.blog.id}`);
  };
  const deleteHandler = async () => {
    try {
      await deleteBlog({
        variables: {
          id: props.blog.id,
        },
      });
    } catch (err: any) {
      return console.log(err.message);
    }
  };

  return (
    <Card sx={blogStyles.card}>
      {props.showActions && (
        <CardActions>
          <IconButton onClick={editHandler}>
            <AiOutlineEdit />
          </IconButton>
          <IconButton onClick={deleteHandler}>
            <AiOutlineDelete />
          </IconButton>
        </CardActions>
      )}
      <Box
        onClick={handleClick}
        sx={{ ...blogStyles.cardHeader, bgcolor: randomBgColor() }}
      >
        <Box sx={blogStyles.dateContainer}>
          <FcCalendar size={"30px"} />
          <Typography
            fontFamily={"Arvo"}
            fontSize={{ lg: "20px", md: "18px", sm: "16px", xs: "12px" }}
            color="white"
            variant="caption"
          >
            {new Date(Number(props.blog.date)).toDateString()}
          </Typography>
        </Box>
        <Typography variant="h4" sx={blogStyles.title}>
          {props.blog.title}
        </Typography>
        <Typography sx={blogStyles.author}>
          <FaUser color="white" /> {props.blog.user?.name}
        </Typography>
      </Box>
      <Box sx={blogStyles.cardContent}>
        <Typography sx={blogStyles.contentText}>
          {props.blog.content}
        </Typography>
      </Box>
    </Card>
  );
};

export default BlogItem;