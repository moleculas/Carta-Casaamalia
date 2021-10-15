import { createMuiTheme } from "@material-ui/core/styles";
//import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles'
import { blueGrey, red } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#f1c761',
            light: '#f6dc9d',
            dark: '#e0b652'
           
        },
        secondary: blueGrey,
        error: red,
    },
    typography: {
        h1: {
            fontFamily: [
                'Montserrat',
            ].join(','),
        },
        h2: {
            fontFamily: [
                'Montserrat',
            ].join(','),
        },
        h3: {
            fontFamily: [
                'Montserrat',
            ].join(','),
        },
        h4: {
            fontFamily: [
                'Montserrat',
            ].join(','),
        },
        h5: {
            fontFamily: [
                'Montserrat',
            ].join(','),
        },
        h6: {
            fontFamily: [
                'Montserrat',
            ].join(','),
        },
        //defecto
        body1: {
            fontFamily: [
                'Roboto',
            ].join(','),
            fontSize: '0.9rem',
            '@media (min-width:600px)': {
                fontSize: '1rem',
            }
        },
        body2: {
            fontFamily: [
                'Roboto',
            ].join(','),
            fontSize: '0.8rem',
            '@media (min-width:600px)': {
                fontSize: '0.9rem',
            }
        },
    }
})

export default theme;