import React, { useContext } from 'react';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    makeStyles
} from '@material-ui/core';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import { Link } from "react-router-dom";
import { CartaContext } from '../context/CartaProvider';
import { withRouter } from "react-router-dom";

const estilos = makeStyles(theme => ({
    link: {
        textDecoration: 'none',
        color: 'inherit'
    }
}))

const Menu = (props) => {

    const classes = estilos();
    const {
        logged,
        setLogged,
        setItemsCat1,
        setItemsCat2,
        setItemsCat3,
        setItemsCat4,
        setItemsCat5,
        setItemsCat6,
        setItemsCat7,
        setItemsCat8,
        setDadesCarregadesCarta,
        setDadesCarregadesVins,
        setLaDataXMLCarta,
        setLaDataXMLVins
    } = useContext(CartaContext);
    const tancarSessio = () => {
        setLogged(false);
        setItemsCat1([]);
        setItemsCat2([]);
        setItemsCat3([]);
        setItemsCat4([]);
        setItemsCat5([]);
        setItemsCat6([]);
        setItemsCat7([]);
        setItemsCat8([]);
        setDadesCarregadesCarta(false);
        setDadesCarregadesVins(false);
        setLaDataXMLCarta('');
        setLaDataXMLVins('');
        props.history.push('/login');
    }
    
    return (
        <div>
            <List component='nav'>
                {logged ? (
                    <div>
                        <Link to="/" className={classes.link}>
                            <ListItem button>
                                <ListItemIcon>
                                    <RestaurantIcon />
                                </ListItemIcon>
                                <ListItemText primary='Plats' />
                            </ListItem>
                        </Link>
                        <Link to="/vins" className={classes.link}>
                            <ListItem button>
                                <ListItemIcon>
                                    <LocalBarIcon />
                                </ListItemIcon>
                                <ListItemText primary='Vins' />
                            </ListItem>
                        </Link>
                        <a rel="noopener noreferrer" href="https://carta.casaamalia.com" target="_blank" className={classes.link}>
                            <ListItem button>
                                <ListItemIcon>
                                    <SubdirectoryArrowRightIcon />
                                </ListItemIcon>
                                <ListItemText primary='Accés Carta' />
                            </ListItem>
                        </a>
                    </div>
                ) : null}

                <ListItem
                    button
                    onClick={tancarSessio}
                >
                    <ListItemIcon>
                        <LockOpenIcon />
                    </ListItemIcon>
                    <ListItemText primary={logged ? ('Logout') : ('Login')} />
                </ListItem>

                <Divider />
            </List>
        </div>
    )
}

export default withRouter(Menu)
