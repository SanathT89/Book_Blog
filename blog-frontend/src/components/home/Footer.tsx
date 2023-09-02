import {Box,Button,Typography} from "@mui/material"
import { homepageStyles } from "../../styles/homepage-styles"

const Footer = () => {
  return <Box sx={homepageStyles.footerContainer}>
    <Button variant="contained" sx={homepageStyles.footerBtn}>
        View Articles
    </Button>
    <Typography sx={homepageStyles.footerText}>Made By T Sanath &#x2661; </Typography>
    <Button variant="contained" sx={homepageStyles.footerBtn}>
        Publish One
    </Button>
  </Box>
  
}

export default Footer 