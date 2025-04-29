import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#54B435", // Vert ArenaGo
    },
    secondary: {
      main: "#03DAC6",
    },
    text: {
      primary: "#fff",
      secondary: "#aaa",
    },
  },
  typography: {
    fontFamily: "Segoe UI, Roboto, sans-serif",
  },
});

export default darkTheme;
