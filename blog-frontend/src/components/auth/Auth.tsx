import { Box, InputLabel, TextField, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import { authStyles } from "../../styles/auth-styles";
import { ImBlogger } from 'react-icons/im';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { USER_LOGIN, USER_SIGNUP } from "../graphql/mutations";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth-slice";
import {useNavigate} from "react-router-dom";
type Inputs ={
  name:string;
  email:string ;
  password: string;
};

const Auth = () => {
  const navigate =useNavigate();
  const isLoggedIn =useSelector((state:any)=>state.isLoggedIn);
  console.log(isLoggedIn);
  const { register, formState: { errors }, handleSubmit, } = useForm<Inputs>();
  const dispatch = useDispatch();
  const [login] =useMutation(USER_LOGIN);
  const [signup] =useMutation(USER_SIGNUP);
  const [isSignup, setIsSignup] = useState(false);
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
  const onResRecieved =(data:any)=>{
    console.log(data);
    if(data.signup){
      const {id,email,name} = data.signup;
      localStorage.setItem("userData",JSON.stringify({id,name,email}));

    }
    else{
      const {id,email,name} = data.login;
      localStorage.setItem("userData",JSON.stringify({id,name,email}));
    }
    dispatch(authActions.login());
    return navigate("/blogs")
  }
  const onSubmit = async ({name,email,password}: Inputs) => {
    if(isSignup){
      //signup
      try{ 
        const res = await signup({variables:{
        name,email,password,
      }});
      if (res.data){
        onResRecieved(res.data);
      }
      
      }catch(err:any){
        console.log(err.message);
      }
      
    }
    else{
      //login
      try{
        const res = await login({variables:{
          email,
          password,
        },
      });
      if (res.data){
        onResRecieved(res.data);
      }
      } catch(err:any){
        console.log(err.message);
      }
      
    }
  };
  return (
    <Box sx={authStyles.container}>
      <Box sx={authStyles.logoTitle}>
        <ImBlogger size={'30px'} style={{ borderRadius: "50%", padding: "10px", background: "#6c5250" }} />
        <Typography sx={authStyles.logoText}>Prose and Parchment</Typography>
      </Box>
      <Box sx={{ ...authStyles.formContainer, width: isBelowMd ? "50%" : "300px" }}>
        <Typography sx={authStyles.logoText}>{isSignup ? "Signup" : "Login"}</Typography>
        {/*@ts-ignore*/}
        <form onSubmit={handleSubmit(onSubmit)} style={authStyles.form}>
          {isSignup && (
            <>
              <InputLabel aria-label="name"></InputLabel>
              <TextField margin="normal" inputProps={{ style: { borderRadius: 10 } }} aria-label="name" label="Name"
                {...register("name", { required: true })}
              />
            </>
          )}
          <InputLabel aria-label="email"></InputLabel>
          <TextField error={Boolean(errors.email)} margin="normal" inputProps={{ style: { borderRadius: 10 } }} aria-label="email" label="Email" type={"email"}
            {...register("email", { required: true, validate: (val: string) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(val), })}
          />
          <InputLabel aria-label="pass"></InputLabel>
          <TextField placeholder="Length greater than 5" helperText={Boolean(errors.password) ? "Length should be greater than 5" : ""} error={Boolean(errors.password)} margin="normal" inputProps={{ style: { borderRadius: 10 } }} aria-label="pass" label="Password" type="password" {...register("password", { required: true, minLength: 6 })} />
          <Button variant="contained" sx={authStyles.submitBtn}>Submit</Button>
          <Button
            onClick={() => setIsSignup((prev) => !prev)}
            //@ts-ignore
            sx={{ ...authStyles.submitBtn, ...authStyles.switchBtn }}
          >
            Switch to {isSignup ? "Login" : "Signup"}
          </Button>
        </form>
      </Box>
    </Box>
  )
}

export default Auth