import React, { useState } from 'react';
import Constantes from "../constantes";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Navbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Carta from './Carta';
import Vins from './Vins';
import Login from './Login';
import { makeStyles, Hidden } from '@material-ui/core';
import Cajon from './Cajon';

const subProduccio = Constantes.SUBDIRECTORI_PRODUCCIO;
const estilos = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
}))

const Contenedor = () => {

    const classes = estilos()
    const [abrir, setAbrir] = useState(false)

    const accionAbrir = () => {
        setAbrir(!abrir)
    }
    let baseName;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        baseName='';           
    }else{
        baseName=subProduccio;      
    }    

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Router basename={baseName} >
                <Navbar accionAbrir={accionAbrir} />
                <Hidden xsDown>
                    <Cajon
                        variant="permanent"
                        open={true}
                    />
                </Hidden>
                <Hidden smUp>
                    <Cajon
                        variant="temporary"
                        open={abrir}
                        onClose={accionAbrir}
                    />
                </Hidden>
                <div className={classes.content}>
                    <div className={classes.toolbar}></div>

                    <Switch>
                        <Route path="/" exact>
                            <Carta />
                        </Route>
                        <Route path="/vins" >
                            <Vins />
                        </Route>                        
                        <Route path="/login" >
                            <Login />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    )
}

export default Contenedor
