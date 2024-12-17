import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
    direction: "rtl",
    typography: {
        fontFamily: "'Cairo', Arial, sans-serif",
        
      },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FFFFFF",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.5)",
            },
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.5)",

            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: "white", // Sets the color of the dropdown icon
          },
        },
      },
    },
});

export default Theme