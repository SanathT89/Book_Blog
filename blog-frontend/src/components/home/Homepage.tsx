import {Box, Typography} from '@mui/material'
import { homepageStyles } from '../../styles/homepage-styles';


const Homepage = () => {
  return (
  <Box sx={homepageStyles.container}>

    <Box sx={homepageStyles.wrapper}>
      <Typography sx={homepageStyles.text}>Write and Share Your Blog With Millions Of People
      </Typography>
      <img 
      width="50%" 
      height="50%" 
      //@ts-ignore
      style={homepageStyles.image} 
      src="/articles.png" alt="Blog"/>
    </Box>

    <Box sx={homepageStyles.wrapper}>
      <img 
      width="50%" 
      height="50%" 
      //@ts-ignore
      style={homepageStyles.image} 
      src="/publish.png" alt="Publish"/>
      <Typography sx={homepageStyles.text}>Embark on a Literary Adventure through Stories and Prose
      </Typography>
    </Box>

    <Box sx={homepageStyles.wrapper}>
      <Typography sx={homepageStyles.text}>Scripting Life's Narratives in the Blogosphere
      </Typography>
      <img 
      width="50%" 
      height="50%" 
      //@ts-ignore
      style={homepageStyles.image} 
      src="/blog.png" alt="Articles"/>
        
    </Box>

  </Box>
  );
};

export default Homepage