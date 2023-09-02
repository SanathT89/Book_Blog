//@ts-nocheck
import { useQuery } from "@apollo/client";
import { Avatar, Box, LinearProgress, Typography } from "@mui/material";
import { profileStyles } from "../../../styles/profile-styles";
import BlogItem from "../../blogs/BlogItem";
import { GET_USER_BLOGS } from "../../graphql/queries";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("userData") as string);
  const { loading, data, error } = useQuery(GET_USER_BLOGS, {
    variables: {
      id: JSON.parse(localStorage.getItem("userData") as string).id,
    },
  });
  console.log(data);

  if (error) {
    return <p>ERROR</p>;
  }

  return loading ? (
    <LinearProgress />
  ) : (
    data && (
      <Box sx={profileStyles.container}>
        <Box sx={profileStyles.blogsContainer}>
          <Typography sx={profileStyles.text} variant="h3">
            My Posts
          </Typography>
          <Box sx={profileStyles.cardsContainer}>
            {data.user.blogs.map((item) => (
              <BlogItem
                showActions={true}
                blog={{
                  title: item.title,
                  content: item.content,
                  date: item.date,
                  id: item.id,
                }}
              />
            ))}
          </Box>
        </Box>
        <Box sx={profileStyles.profileContainer}>
          <Box sx={profileStyles.userContainer}>
            <Avatar sx={profileStyles.avatar}></Avatar>
            <Typography variant="h3" fontFamily="Work Sans">
              Name {user.name}
            </Typography>
            <Typography variant="h4" fontFamily="Work Sans">
              Email: {user.email}
            </Typography>
            <Typography variant="h4" fontFamily="monospace">
              You Wrote {data?.user?.blogs?.length} Blogs 🎉🧨
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  );
};

export default Profile;