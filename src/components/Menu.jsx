import React, { useContext, useEffect, useState, useRef } from 'react';
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
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

const estilos = makeStyles(theme => ({
    link: {
        textDecoration: 'none',
        color: 'inherit'
    },
    alarma: {
        color: 'red'
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
    };
    const Ref = useRef(null);
    const [timer, setTimer] = useState('01:00');
    const [tiempoAlarma, setTiempoAlarma] = useState(false);

    //useEffect

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            total, minutes, seconds
        };
    };

    const startTimer = (e) => {
        let { total, minutes, seconds }
            = getTimeRemaining(e);
        if (total >= 0) {
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            );
            if ((total / 1000) === 15) {
                setTiempoAlarma(true);
            };
        };
    };

    const clearTimer = (e) => {
        setTimer('01:00');
        if (Ref.current) clearInterval(Ref.current);
        if (e) {
            const id = setInterval(() => {
                startTimer(e);
            }, 1000);
            Ref.current = id;
        };
    };

    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 60);
        return deadline;
    };  

    useEffect(() => {
        if (timer) {
            timer === '00:00' && (tancarSessio());
        };
    }, [timer]);

    useEffect(() => {
        if (logged) {
            const interval = setInterval(() => {
                checkForInactivity();
            }, 5000);
            return () => clearInterval(interval);
        };
    }, [logged]);

    useEffect(() => {
        if (logged) {
            updateExpireTime();
            window.addEventListener("click", updateExpireTime);
            window.addEventListener("keypress", updateExpireTime);
            window.addEventListener("scroll", updateExpireTime);
            window.addEventListener("mousemove", updateExpireTime);
            return () => {
                window.removeEventListener("click", updateExpireTime);
                window.removeEventListener("keypress", updateExpireTime);
                window.removeEventListener("scroll", updateExpireTime);
                window.removeEventListener("mousemove", updateExpireTime);
            };
        };
    }, [logged]);

    //funciones

    const checkForInactivity = () => {
        const expireTime = localStorage.getItem("expireTime");
        if (expireTime < Date.now()) {
            const expireTime = null;
            localStorage.setItem("expireTime", expireTime);
            comencaCompteEnrere();
        };
    };

    const comencaCompteEnrere = () => {
        setTiempoAlarma(false);
        clearTimer(getDeadTime());
    };

    const updateExpireTime = () => {
        const expireTime = Date.now() + 120000;
        localStorage.setItem("expireTime", expireTime);
        setTiempoAlarma(false);
        clearTimer(null);
    };

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
                        {/* <a rel="noopener noreferrer" href="https://carta.casaamalia.cat" target="_blank" className={classes.link}> */}
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
                    <ListItemText primary={logged ? (
                        <>
                            <Typography component={'span'}>{`Logout `}</Typography>
                            <Typography className={clsx(tiempoAlarma && (classes.alarma))} component={'span'}>{`(${timer})`}</Typography>
                        </>
                    ) : ('Login')} />
                </ListItem>               
                <Divider />
            </List>
        </div>
    )
}

export default withRouter(Menu)
