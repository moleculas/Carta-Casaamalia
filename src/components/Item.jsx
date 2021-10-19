import React, { Fragment, useState } from 'react';
import Constantes from "../constantes";
import { makeStyles } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import { red, green } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from "@material-ui/core/IconButton";
import Chip from '@material-ui/core/Chip';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const parades = Constantes.PARADES;
const estilos = makeStyles((theme) => ({
    paddLef: {
        paddingLeft: '15px'
    },
    root1: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
        },
    },
    avatarRed: {
        backgroundColor: red[500],
    },
    avatarGreen: {
        backgroundColor: green[500],
    },
    //list
    root4: {
        cursor: 'default'
    },
    root5: {
        marginRight: '10px'
    },
    box70: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '70%',
        },
    },
    box30: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '30%',
        },
    },
    bgr1: {
        backgroundColor: theme.palette.background.default,
    },
    root2: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            alignItems: 'center',
        },
    },
    //boto
    btnError: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        "&:hover": {
            backgroundColor: theme.palette.error.dark
        },
        "&:disabled": {
            backgroundColor: theme.palette.error.light
        },
        marginLeft: '5px'
    }
}));


const Item = (props) => {

    const classes = estilos();
    const [expandedId, setExpandedId] = useState(-1);
    const handleExpandClick = index => {
        setExpandedId(expandedId === index ? -1 : index);
    }
    const borrarItem = (index) => {
        props.prBorrarItem(index)
    }
    const handleClickOpenDialogEdicio = (elItemAEditar, laKey) => {
        props.prHandleClickOpenDialogEdicio(elItemAEditar, laKey)
    }
    const retornaParadesNom = (elStringNumero) => {
        const myArr = elStringNumero.split(",");
        const myArr2 = [];
        myArr.forEach((item) => {
            const elStringParadaNom = parades[item];
            myArr2.push(elStringParadaNom);
        });
        return myArr2.toString();
    }

    return (
        <div>
            <Card>
                <Box className={classes.root1}>
                    <Box style={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent style={{ flex: '1 0 auto' }}>
                            <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Avatar className={props.prEstemAPlats ? (
                                    props.prItem[11].value === '0' ? (
                                        classes.avatarRed
                                    ) : (classes.avatarGreen)

                                ) : (
                                    props.prItem[10].value === '0' ? (
                                        classes.avatarRed
                                    ) : (classes.avatarGreen)
                                )}>
                                    {props.prIndex + 1}
                                </Avatar>
                                {props.prEstemAPlats ? (
                                    <Typography className={classes.paddLef} component="div" variant="h6">
                                        {props.prItem[1].value}
                                    </Typography>
                                ) : (
                                    <Typography className={classes.paddLef} component="div" variant="h6">
                                        {props.prItem[0].value}
                                    </Typography>
                                )}
                            </Box>
                            <Box mt={2}>
                                {props.prEstemAPlats ? (
                                    <Fragment>
                                        <Typography variant="body2" component="div">
                                            {props.prItem[5].value}
                                        </Typography>
                                        <Typography variant="body1" component="div">
                                            Preu: {props.prItem[9].value}
                                        </Typography>
                                        <Typography variant="body1" component="div">
                                            {/* Parada: {parades[props.prItem[10].value].label} */}
                                            Parada: {retornaParadesNom(props.prItem[10].value)}
                                        </Typography>
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <Typography variant="body1" component="div">
                                            Denominació: {props.prItem[1].value}
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            {props.prItem[3].value}
                                        </Typography>
                                        <Typography variant="body1" component="div">
                                            Preu: {props.prItem[7].value}
                                        </Typography>
                                        <Typography variant="body1" component="div">
                                            Puntuació Parker: {props.prItem[8].value === '0' ? ('No') : (props.prItem[8].value + ' punts')}
                                        </Typography>
                                        <Typography variant="body1" component="div">
                                            Puntuació Peñín: {props.prItem[9].value === '0' ? ('No') : (props.prItem[9].value + ' punts')}
                                        </Typography>
                                    </Fragment>
                                )}
                            </Box>
                        </CardContent>
                    </Box>
                    <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        {props.prEstemAPlats ? (
                            props.prItem[11].value === '1' ? (
                                <Chip style={{ marginTop: '10px' }} avatar={<Avatar><Visibility /></Avatar>} label="Visible" />
                            ) : (
                                <Chip style={{ marginTop: '10px' }} avatar={<Avatar><VisibilityOff /></Avatar>} label="No Visible" />
                            )

                        ) : (
                            props.prItem[10].value === '1' ? (
                                <Chip style={{ marginTop: '10px' }} avatar={<Avatar><Visibility /></Avatar>} label="Visible" />
                            ) : (
                                <Chip style={{ marginTop: '10px' }} avatar={<Avatar><VisibilityOff /></Avatar>} label="No Visible" />
                            )
                        )}
                        {props.prEstemAPlats ? (
                            <CardMedia
                                component="img"
                                style={{ maxWidth: 200, padding: 10 }}
                                image={`images/plats_imatges/` + props.prItem[8].value}
                                alt=""
                            />
                        ) : (
                            <CardMedia
                                component="img"
                                style={{ maxWidth: 200, padding: 10 }}
                                image={`images/vins_imatges/` + props.prItem[6].value}
                                alt=""
                            />
                        )}
                    </Box>
                </Box>
                <Box className={classes.root1}>
                    <CardActions
                        disableSpacing
                    >
                        <Tooltip title="Idiomes" placement="right" arrow>
                            <IconButton
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: expandedId,
                                })}
                                onClick={() => handleExpandClick(props.prIndex)}
                                aria-expanded={expandedId === props.prIndex}
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </Tooltip>
                    </CardActions>
                    <Box pl={2} pr={2} pb={2}>
                        <Button color="primary" variant="contained"
                            onClick={() => handleClickOpenDialogEdicio(props.prItem, props.prIndex)}
                        >
                            Editar
                        </Button>
                        <Button className={classes.btnError} variant="contained"
                            onClick={() => borrarItem(props.prIndex)}
                        >
                            Borrar
                        </Button>
                    </Box>
                </Box>
                <Collapse in={expandedId === props.prIndex} timeout="auto" unmountOnExit>
                    <CardContent>
                        {props.prEstemAPlats ? (
                            <Fragment>
                                <Box p={1} className={clsx(classes.root2, classes.bgr1)} style={{ marginTop: '-15px' }}>
                                    <Box className={clsx(classes.box30, classes.root2)}>
                                        <Chip avatar={<Avatar>Es</Avatar>} label="Nom" className={classes.root5} />
                                        <Typography variant="body2" component="div">
                                            {props.prItem[0].value}
                                        </Typography>
                                    </Box>
                                    <Box className={clsx(classes.box70, classes.root2)}>
                                        <Chip avatar={<Avatar>Es</Avatar>} label="Descripció" className={classes.root5} />
                                        <Typography variant="body2" component="div">
                                            {props.prItem[4].value}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box p={1} className={clsx(classes.root2, classes.bgr1)}>
                                    <Box className={clsx(classes.box30, classes.root2)}>
                                        <Chip avatar={<Avatar>En</Avatar>} label="Nom" className={classes.root5} />
                                        <Typography variant="body2" component="div">
                                            {props.prItem[2].value}
                                        </Typography>
                                    </Box>
                                    <Box className={clsx(classes.box70, classes.root2)}>
                                        <Chip avatar={<Avatar>En</Avatar>} label="Descripció" className={classes.root5} />
                                        <Typography variant="body2" component="div">
                                            {props.prItem[6].value}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box p={1} className={clsx(classes.root2, classes.bgr1)}>
                                    <Box className={clsx(classes.box30, classes.root2)}>
                                        <Chip avatar={<Avatar>Fr</Avatar>} label="Nom" className={classes.root5} />
                                        <Typography variant="body2" component="div">
                                            {props.prItem[3].value}
                                        </Typography>
                                    </Box>
                                    <Box className={clsx(classes.box70, classes.root2)}>
                                        <Chip avatar={<Avatar>Fr</Avatar>} label="Descripció" className={classes.root5} />
                                        <Typography variant="body2" component="div">
                                            {props.prItem[7].value}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <Box p={1} className={clsx(classes.root2, classes.bgr1)} style={{ marginTop: '-15px' }}>
                                    <Box className={clsx(classes.box70, classes.root2)}>
                                        <Chip avatar={<Avatar>Es</Avatar>} label="Descripció" className={classes.root5} />
                                        <Typography variant="body2" component="div">
                                            {props.prItem[2].value}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box p={1} className={clsx(classes.root2, classes.bgr1)}>
                                    <Box className={clsx(classes.box70, classes.root2)}>
                                        <Chip avatar={<Avatar>En</Avatar>} label="Descripció" className={classes.root5} />
                                        <Typography variant="body2" component="div">
                                            {props.prItem[4].value}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box p={1} className={clsx(classes.root2, classes.bgr1)}>
                                    <Box className={clsx(classes.box70, classes.root2)}>
                                        <Chip avatar={<Avatar>Fr</Avatar>} label="Descripció" className={classes.root5} />
                                        <Typography variant="body2" component="div">
                                            {props.prItem[5].value}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Fragment>
                        )}
                    </CardContent>
                </Collapse>
            </Card>
        </div>
    )
}

export default Item
