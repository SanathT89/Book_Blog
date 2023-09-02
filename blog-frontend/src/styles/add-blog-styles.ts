import { CSSProperties } from "react";
import { Styles } from "./homepage-styles";

export const addStyles: Styles = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "green",
  },
  blogHeader: {
    display: "flex",
    justifyContent: "space-around",
    fontWeight: "bold",
    padding: 3,
    alignItems: "center",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
  },
};

export const htmlElmStyles: { [key: string]: CSSProperties } = {
  h2: {
    fontSize: "40px",
    fontWeight: "500",
    fontFamily: "Work Sans",
    marginLeft: "50px",
    marginRight: "50px",
    marginTop: "40px",
    outline: "none",
  },
  p: {
    border: "none",
    outline: "none",
    marginLeft: "50px",
    marginRight: "50px",
    marginTop: "30px",
    fontFamily: "Work Sans",
    minHeight: "300px",
    fontSize: "18px",
  },
};