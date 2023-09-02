import { SxProps } from '@mui/material';

export type Styles ={
    [key: string]: SxProps;
};

export const homepageStyles:Styles ={
    container:{
        display:"flex",
        flexDirection:"column",
        gap:10,
    },
    wrapper:{
        display:"flex",
        justifyContent:"centre",
        gap: 4,
        alignItems:"centre",
        padding:6,

    },
    text:{
        fontFamily:"Work Sans",
        fontWeight:"500",
        fontSize:{lg:50,md:40,sm:35,xs:20},
    },
    image: {
        boxShadow:"10px 10px 25px #000",
        borderRadius:20,
    },
    footerContainer:{
        bgcolor:"#404040",
        display:"flex",
        alignItems:'center',
        height:"20vh",
        justifyContent:"center",
        gap:20,
    },
    footerBtn:{
        borderRadius:10,
        bgcolor:"blueviolet",
        width:200,
        ":hover":{
            bgcolor:"#bd63fa",
        },
    },
    footerText:{
        fontFamily:"Work Sans",
        fontWeight:"500",
        fontSize:20,
        color:"white",
    },
};