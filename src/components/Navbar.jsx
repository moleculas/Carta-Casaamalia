import React from 'react';
import { fade, makeStyles, IconButton, AppBar, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import Box from '@material-ui/core/Box';
import logo from '../images/logo_header.png';


const useStyle = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    simpleButton: {
        marginLeft: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${240}px)`,
            marginLeft: 240,
        },
    },
    logoIcon: {
        borderRadius: 25,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        marginRight: 10,
        padding: 3,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    logo: {
        width: '35px'
    },
    fonsLogo: {
        borderRadius: 60,
        backgroundColor: fade(theme.palette.common.white, 0.15),       
        padding: 7,
        marginTop: 5,
        marginBottom: 5,
        marginRight: 20,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    }

}));

const Navbar = (props) => {

    const classes = useStyle();

    return (
        <AppBar className={classes.appBar}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="menu"
                    className={classes.menuButton}
                    onClick={() => props.accionAbrir()}
                >
                    <MenuIcon />
                </IconButton>
                <Box className={classes.fonsLogo}>
                    <img src={logo} className={classes.logo} alt="logo" />
                </Box>
                <Typography className={classes.title} variant="h5">
                    Backend Gestió Carta Casa Amàlia
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;
