import { blueGrey, indigo, grey } from '@mui/material/colors';

export const light = {
  palette: {
    mode: 'light',
    secondary: {
      main: blueGrey[100]
    }
  }
};

export const dark = {
  palette: {
    mode: 'dark',
    primary: {
      main: indigo[900],
    },
    background: {
      paper: grey[800]
    },
    secondary: {
      main: blueGrey[300]
    }
  }
};

export function getCachedTheme() {
  let lightTheme = true;
  let cachedTheme = localStorage.getItem('theme');
  cachedTheme = cachedTheme != null ? JSON.parse(cachedTheme) : lightTheme;
  return cachedTheme;
}