import { createSlice } from "@reduxjs/toolkit";

export const authSlice =createSlice({
    name:"auth",
    initialState:{isLoggedIN:false},
    reducers:{
        login(state) {
            state.isLoggedIN =true;
        }, 
        logout(state){
            state.isLoggedIN=false;
        },
    },
});

export const authActions =authSlice.actions;
