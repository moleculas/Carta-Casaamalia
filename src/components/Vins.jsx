import React, { useState, useEffect, useContext, useRef } from 'react';
import Constantes from "../constantes";
import { makeStyles } from "@material-ui/core";
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { CartaContext } from '../context/CartaProvider';
import { withRouter } from "react-router-dom";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import XMLParser from 'react-xml-parser';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import clsx from 'clsx';
import IconButton from "@material-ui/core/IconButton";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import DeleteIcon from '@material-ui/icons/Delete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Item from './Item';

const puntuacio = Constantes.PUNTUACIO;
const rutaApi = Constantes.RUTA_API;
const estilos = makeStyles((theme) => ({
    //loading
    loading: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    root1: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
        },
    },
    root11: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            alignItems: 'flex-end',
        },
    },
    img_dialog: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '300px',
        },
    },
    box80: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '80%',
        },
    },
    box20: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '20%',
        },
    },
    pl_dialog: {
        paddingLeft: '0px',
        [theme.breakpoints.up('sm')]: {
            paddingLeft: '15px',
        },
    },
    //tabs
    root2: {
        flexGrow: 1
    },
    //list
    root4: {
        cursor: 'default'
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
    },
    //form
    form: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
    formInput: {
        marginBottom: '10px',
    },
    margin: {
        marginRight: '10px',
    }
}));

//snackbar y alert
const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
//tabs
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography component={'span'}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function useForceUpdate() {
    let [value, setState] = useState(true);
    return () => setState(!value);
}


const Vins = (props) => {

    let forceUpdate = useForceUpdate();

    const classes = estilos();
    const {
        logged,
        dadesCarregadesVins,
        setDadesCarregadesVins,
        itemsCat5,
        setItemsCat5,
        itemsCat6,
        setItemsCat6,
        itemsCat7,
        setItemsCat7,
        itemsCat8,
        setItemsCat8,
        laDataXMLVins,
        setLaDataXMLVins,
        fetCanviVins,
        setFetCanviVins
    } = useContext(CartaContext);

    const [selectItemsCat5, setSelectItemsCat5] = useState([]);
    const [selectItemsCat6, setSelectItemsCat6] = useState([]);
    const [selectItemsCat7, setSelectItemsCat7] = useState([]);
    const [selectItemsCat8, setSelectItemsCat8] = useState([]);
    const [itemAEditar, setItemAEditar] = useState([]);
    const [itemDefAEditar, setItemDefAEditar] = useState([]);
    const [itemDefACrear, setItemDefACrear] = useState([]);
    const [keyAGestionar, setKeyAGestionar] = useState(null);
    const [modeDialog, setModeDialog] = useState(null);
    const [estemAPlats] = useState(false);
    const [estemAVins] = useState(true);
    //loading
    const [openLoading, setOpenLoading] = useState(false);
    //alert
    const [openSnack, setOpenSnack] = useState(false);
    const [alert, setAlert] = useState({});

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false);
    };
    //tabs
    const [valueTab, setValueTab] = useState(0);
    const [valueTab2, setValueTab2] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
    }
    const handleChangeTab2 = (event, newValue) => {
        setValueTab2(newValue);
    }
    const esDesktop = useMediaQuery(theme => theme.breakpoints.up('lg'));
    const orientacioTabs = () => {
        if (esDesktop) {
            return "horizontal";
        } else {
            return "vertical";
        }
    }

    const [file, setFile] = useState(null);
    const [preFile, setPreFile] = useState(null);
    const refImg = useRef();
    const [botoDesactivat, setBotoDesactivat] = useState(true);
    //dialog
    const [openDialog, setOpenDialog] = useState(false);

    const handleClickOpenDialogEdicio = (elItemAEditar, laKey) => {
        setFetCanviVins(true);
        setModeDialog('edicio');
        setItemDefAEditar([]);
        setBotoDesactivat(true);
        setKeyAGestionar(laKey);
        setItemAEditar(elItemAEditar);
        setOpenDialog(true);
        setParker(elItemAEditar[8].value);
        setPenin(elItemAEditar[9].value);
        switch (valueTab) {
            case 0:
                setOrdre1(laKey + 1);
                break;
            case 1:
                setOrdre2(laKey + 1);
                break;
            case 2:
                setOrdre3(laKey + 1);
                break;
            case 3:
                setOrdre4(laKey + 1);
                break;
            default:
        }

        let elPreFile = 'images/vins_imatges/' + elItemAEditar[6].value;
        setPreFile(elPreFile);
    }
    const handleClickOpenDialogCreacio = () => {
        setFetCanviVins(true);
        setModeDialog('creacio');
        setItemDefACrear([]);
        setBotoDesactivat(true);
        setOpenDialog(true);
        let array;
        let elValueAAfegir;
        switch (valueTab) {
            case 0:
                array = [...selectItemsCat5];
                elValueAAfegir = { 'value': `${itemsCat5.length + 1}`, 'label': `${itemsCat5.length + 1}` };
                array.push(elValueAAfegir);
                setSelectItemsCat5(array);
                setOrdre1(itemsCat5.length + 1);
                setKeyAGestionar(itemsCat5.length + 1);
                break;
            case 1:
                array = [...selectItemsCat6];
                elValueAAfegir = { 'value': `${itemsCat6.length + 1}`, 'label': `${itemsCat6.length + 1}` };
                array.push(elValueAAfegir);
                setSelectItemsCat6(array);
                setOrdre2(itemsCat6.length + 1);
                setKeyAGestionar(itemsCat6.length + 1);
                break;
            case 2:
                array = [...selectItemsCat7];
                elValueAAfegir = { 'value': `${itemsCat7.length + 1}`, 'label': `${itemsCat7.length + 1}` };
                array.push(elValueAAfegir);
                setSelectItemsCat7(array);
                setOrdre3(itemsCat7.length + 1);
                setKeyAGestionar(itemsCat7.length + 1);
                break;
            case 3:
                array = [...selectItemsCat8];
                elValueAAfegir = { 'value': `${itemsCat8.length + 1}`, 'label': `${itemsCat8.length + 1}` };
                array.push(elValueAAfegir);
                setSelectItemsCat8(array);
                setOrdre4(itemsCat8.length + 1);
                setKeyAGestionar(itemsCat8.length + 1);
                break;
            default:
        }
    }
    const setRegistre = (event) => {
        let array;
        switch (event.target.id) {
            case 'form-nom':
                if (modeDialog === 'edicio') {
                    array = [...itemDefAEditar];
                    array[0] = event.target.value;
                    setItemDefAEditar(array);
                } else {
                    array = [...itemDefACrear];
                    array[0] = event.target.value;
                    setItemDefACrear(array);
                }
                break;
            case 'form-den':
                if (modeDialog === 'edicio') {
                    array = [...itemDefAEditar];
                    array[1] = event.target.value;
                    setItemDefAEditar(array);
                } else {
                    array = [...itemDefACrear];
                    array[1] = event.target.value;
                    setItemDefACrear(array);
                }
                break;
            case 'form-des-ca':
                if (modeDialog === 'edicio') {
                    array = [...itemDefAEditar];
                    array[3] = event.target.value;
                    setItemDefAEditar(array);
                } else {
                    array = [...itemDefACrear];
                    array[3] = event.target.value;
                    setItemDefACrear(array);
                }
                break;
            case 'form-des-es':
                if (modeDialog === 'edicio') {
                    array = [...itemDefAEditar];
                    array[2] = event.target.value;
                    setItemDefAEditar(array);
                } else {
                    array = [...itemDefACrear];
                    array[2] = event.target.value;
                    setItemDefACrear(array);
                }
                break;
            case 'form-des-en':
                if (modeDialog === 'edicio') {
                    array = [...itemDefAEditar];
                    array[4] = event.target.value;
                    setItemDefAEditar(array);
                } else {
                    array = [...itemDefACrear];
                    array[4] = event.target.value;
                    setItemDefACrear(array);
                }
                break;
            case 'form-des-fr':
                if (modeDialog === 'edicio') {
                    array = [...itemDefAEditar];
                    array[5] = event.target.value;
                    setItemDefAEditar(array);
                } else {
                    array = [...itemDefACrear];
                    array[5] = event.target.value;
                    setItemDefACrear(array);
                }
                break;
            case 'form-pre':
                if (modeDialog === 'edicio') {
                    array = [...itemDefAEditar];
                    array[7] = event.target.value;
                    setItemDefAEditar(array);
                } else {
                    array = [...itemDefACrear];
                    array[7] = event.target.value;
                    setItemDefACrear(array);
                }
                break;
            default:
        }
    }

    const handleCloseDialog = () => {
        if (modeDialog === "creacio") {
            let array;
            switch (valueTab) {
                case 0:
                    array = [...selectItemsCat5];
                    array.pop();
                    setSelectItemsCat5(array);
                    break;
                case 1:
                    array = [...selectItemsCat6];
                    array.pop();
                    setSelectItemsCat6(array);
                    break;
                case 2:
                    array = [...selectItemsCat7];
                    array.pop();
                    setSelectItemsCat7(array);
                    break;
                case 3:
                    array = [...selectItemsCat8];
                    array.pop();
                    setSelectItemsCat8(array);
                    break;
                default:
            }
        }
        setOpenDialog(false);
        setModeDialog(null);
        setItemAEditar([]);
        setParker('');
        setPenin('');
        setPreFile(null);
        setFile(null);
    }

    const [parker, setParker] = useState('');
    const [penin, setPenin] = useState('');
    const handleChangeSelectPr = (event) => {
        setParker(event.target.value);
        let array;
        if (modeDialog === 'edicio') {
            array = [...itemDefAEditar];
            array[8] = event.target.value;
            setItemDefAEditar(array);
        } else {
            array = [...itemDefACrear];
            array[8] = event.target.value;
            setItemDefACrear(array);
        }
    };
    const handleChangeSelectPe = (event) => {
        setPenin(event.target.value);
        let array;
        if (modeDialog === 'edicio') {
            array = [...itemDefAEditar];
            array[9] = event.target.value;
            setItemDefAEditar(array);
        } else {
            array = [...itemDefACrear];
            array[9] = event.target.value;
            setItemDefACrear(array);
        }
    };
    const [ordre1, setOrdre1] = useState('');
    const [ordre2, setOrdre2] = useState('');
    const [ordre3, setOrdre3] = useState('');
    const [ordre4, setOrdre4] = useState('');
    const handleChangeSelect1 = (event) => {
        switch (valueTab) {
            case 0:
                setOrdre1(event.target.value);
                break;
            case 1:
                setOrdre2(event.target.value);
                break;
            case 2:
                setOrdre3(event.target.value);
                break;
            case 3:
                setOrdre4(event.target.value);
                break;
            default:
        }
    };
    const handleChangeImage = (e) => {
        setFile(e.target.files[0]);
        setPreFile(URL.createObjectURL(e.target.files[0]));
        setBotoDesactivat(false);
    };
    const resetImage = () => {
        setFile(null);
        setPreFile(null);
        setBotoDesactivat(true);
        document.getElementById("uploadCaptureInputFile").value = "";
    }
    const handleSubmitImage = async (e) => {
        e.preventDefault();
        const ampImg = refImg.current.naturalWidth;
        const altImg = refImg.current.naturalHeight;
        const pesBrut = file.size;
        if (pesBrut >= 10485760) {
            setAlert({
                mensaje: "L'arxiu pesa més de 10MB. No acceptat.",
                tipo: 'error'
            })
            setOpenSnack(true);
            return
        }
        if (altImg > ampImg) {
            setAlert({
                mensaje: "La orientació de la imatge no és correcta, ha de ser horitzontal. No acceptat.",
                tipo: 'error'
            })
            setOpenSnack(true);
            return
        }
        if (ampImg > 2000) {
            setAlert({
                mensaje: "La imatge és massa gran. Redueix les dimensions per optimitzar la càrrega. No acceptat.",
                tipo: 'error'
            })
            setOpenSnack(true);
            return
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("quina", "vins");

        let apiUrl = rutaApi+"upload.php";
        await axios.post(apiUrl, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }).then(response => {
            console.log(response);
            setAlert({
                mensaje: "L'arxiu s'ha pujat correctament.",
                tipo: 'success'
            })
            setOpenSnack(true);
            let array;
            if (modeDialog === 'edicio') {
                array = [...itemDefAEditar];
                array[6] = file.name;
                setItemDefAEditar(array);
            } else {
                array = [...itemDefACrear];
                array[6] = file.name;
                setItemDefACrear(array);
            }
            setBotoDesactivat(true);

        }).catch(err => {
            console.log(err);
            setAlert({
                mensaje: "Error al pujar l'arxiu.",
                tipo: 'error'
            })
            setOpenSnack(true);
        });
    };

    const generaItemsSelectCat = (valor) => {
        let array = [];
        let elValue;
        switch (valor) {
            case '1':
                itemsCat5.forEach((item, index) => {
                    elValue = { 'value': `${index + 1}`, 'label': `${index + 1}` };
                    array.push(elValue);
                });
                setSelectItemsCat5(array);
                break;
            case '2':
                itemsCat6.forEach((item, index) => {
                    elValue = { 'value': `${index + 1}`, 'label': `${index + 1}` };
                    array.push(elValue);
                });
                setSelectItemsCat6(array);
                break;
            case '3':
                itemsCat7.forEach((item, index) => {
                    elValue = { 'value': `${index + 1}`, 'label': `${index + 1}` };
                    array.push(elValue);
                });
                setSelectItemsCat7(array);
                break;
            case '4':
                itemsCat8.forEach((item, index) => {
                    elValue = { 'value': `${index + 1}`, 'label': `${index + 1}` };
                    array.push(elValue);
                });
                setSelectItemsCat8(array);
                break;
            default:
        }
    }

    useEffect(() => {
        if (!logged) {
            props.history.push('/login')
        }
    }, [logged, props.history]);

    useEffect(() => {
        if (itemsCat5.length > 0) {
            generaItemsSelectCat('1');
        };
        if (itemsCat6.length > 0) {
            generaItemsSelectCat('2');
        };
        if (itemsCat7.length > 0) {
            generaItemsSelectCat('3');
        };
        if (itemsCat8.length > 0) {
            generaItemsSelectCat('4');
        };
    }, [itemsCat5, itemsCat6, itemsCat7, itemsCat8]);

    useEffect(() => {
        if (logged) {
            if (!dadesCarregadesVins) {
                setOpenLoading(true);
                let prePath;
                if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
                    prePath='../';           
                }else{
                    prePath='';       
                }   
                (async () => {
                    axios.get(prePath+'xml/vins.xml', {
                        "Content-Type": "application/xml; charset=utf-8"
                    }).then(res => {
                        let p1 = [];
                        let p2 = [];
                        let p3 = [];
                        let p4 = [];
                        var xml = new XMLParser().parseFromString(res.data);
                        let elsItems = xml.children;
                        setLaDataXMLVins(elsItems[0].value);
                        for (let i in elsItems) {
                            if (elsItems[i].attributes.categoria === "1") {
                                p1.push(elsItems[i].children);
                            };
                            if (elsItems[i].attributes.categoria === "2") {
                                p2.push(elsItems[i].children);
                            };
                            if (elsItems[i].attributes.categoria === "3") {
                                p3.push(elsItems[i].children);
                            };
                            if (elsItems[i].attributes.categoria === "4") {
                                p4.push(elsItems[i].children);
                            }
                        }
                        setItemsCat5(p1);
                        setItemsCat6(p2);
                        setItemsCat7(p3);
                        setItemsCat8(p4);
                        setOpenLoading(false);
                        setDadesCarregadesVins(true);
                    }).catch((e) => {
                        setOpenLoading(false);
                        console.log(e);
                        setAlert({
                            mensaje: "Error al carregar les dades.",
                            tipo: 'error'
                        })
                        setOpenSnack(true)
                    });
                })();
            }
        }
    }, [logged, dadesCarregadesVins]);

    const laData = () => {
        let data = new Date().toLocaleString() + '';
        return data;
    }
    const reOrdenar = () => {

        let fromIndex;
        let element;
        let toIndex;
        switch (valueTab) {
            case 0:
                fromIndex = itemsCat5.indexOf(itemsCat5[keyAGestionar]);
                toIndex = (ordre1 - 1);
                element = itemsCat5[fromIndex];
                itemsCat5.splice(fromIndex, 1);
                itemsCat5.splice(toIndex, 0, element);
                break;
            case 1:
                fromIndex = itemsCat6.indexOf(itemsCat6[keyAGestionar]);
                toIndex = (ordre2 - 1);
                element = itemsCat6[fromIndex];
                itemsCat6.splice(fromIndex, 1);
                itemsCat6.splice(toIndex, 0, element);
                break;
            case 2:
                fromIndex = itemsCat7.indexOf(itemsCat7[keyAGestionar]);
                toIndex = (ordre3 - 1);
                element = itemsCat7[fromIndex];
                itemsCat7.splice(fromIndex, 1);
                itemsCat7.splice(toIndex, 0, element);
                break;
            case 3:
                fromIndex = itemsCat8.indexOf(itemsCat8[keyAGestionar]);
                toIndex = (ordre4 - 1);
                element = itemsCat8[fromIndex];
                itemsCat8.splice(fromIndex, 1);
                itemsCat8.splice(toIndex, 0, element);
                break;
            default:
        }
    }

    const borrarItem = (index) => {
        let fromIndex;
        switch (valueTab) {
            case 0:
                fromIndex = itemsCat5.indexOf(itemsCat5[index]);
                itemsCat5.splice(fromIndex, 1);
                generaItemsSelectCat('1');
                break;
            case 1:
                fromIndex = itemsCat6.indexOf(itemsCat6[index]);
                itemsCat6.splice(fromIndex, 1);
                generaItemsSelectCat('2');
                break;
            case 2:
                fromIndex = itemsCat7.indexOf(itemsCat7[index]);
                itemsCat7.splice(fromIndex, 1);
                generaItemsSelectCat('3');
                break;
            case 3:
                fromIndex = itemsCat8.indexOf(itemsCat8[index]);
                itemsCat8.splice(fromIndex, 1);
                generaItemsSelectCat('4');
                break;
            default:
        };
        setFetCanviVins(true);
        forceUpdate();
    }

    const generarCarta = async () => {
        if (!fetCanviVins) {
            setAlert({
                mensaje: "No has fet cap canvi. (A qui vols enganyar...)",
                tipo: 'warning'
            })
            setOpenSnack(true);
            return;
        };
        if (itemsCat5.length === 0 || itemsCat6.length === 0 || itemsCat7.length === 0 || itemsCat8.length === 0) {
            setAlert({
                mensaje: "Alguna de les categories està buida. Afegeix com a mínim un ítem.",
                tipo: 'error'
            })
            setOpenSnack(true);
            return;
        };

        const iteracioItemsCat5 = [];
        const iteracioItemsCat6 = [];
        const iteracioItemsCat7 = [];
        const iteracioItemsCat8 = [];
        itemsCat5.forEach((item, index) => {
            iteracioItemsCat5[index] =
                '<item categoria="1"><nom>' + item[0].value
                + '</nom><denominacio>' + item[1].value
                + '</denominacio><descripcio_es>' + item[2].value
                + '</descripcio_es><descripcio_ca>' + item[3].value
                + '</descripcio_ca><descripcio_en>' + item[4].value
                + '</descripcio_en><descripcio_fr>' + item[5].value
                + '</descripcio_fr><imatge>' + item[6].value
                + '</imatge><preu>' + item[7].value
                + '</preu><puntuacio_pr>' + item[8].value
                + '</puntuacio_pr><puntuacio_pe>' + item[9].value
                + '</puntuacio_pe></item>';
        });
        itemsCat6.forEach((item, index) => {
            iteracioItemsCat6[index] =
                '<item categoria="2"><nom>' + item[0].value
                + '</nom><denominacio>' + item[1].value
                + '</denominacio><descripcio_es>' + item[2].value
                + '</descripcio_es><descripcio_ca>' + item[3].value
                + '</descripcio_ca><descripcio_en>' + item[4].value
                + '</descripcio_en><descripcio_fr>' + item[5].value
                + '</descripcio_fr><imatge>' + item[6].value
                + '</imatge><preu>' + item[7].value
                + '</preu><puntuacio_pr>' + item[8].value
                + '</puntuacio_pr><puntuacio_pe>' + item[9].value
                + '</puntuacio_pe></item>';
        });
        itemsCat7.forEach((item, index) => {
            iteracioItemsCat7[index] =
                '<item categoria="3"><nom>' + item[0].value
                + '</nom><denominacio>' + item[1].value
                + '</denominacio><descripcio_es>' + item[2].value
                + '</descripcio_es><descripcio_ca>' + item[3].value
                + '</descripcio_ca><descripcio_en>' + item[4].value
                + '</descripcio_en><descripcio_fr>' + item[5].value
                + '</descripcio_fr><imatge>' + item[6].value
                + '</imatge><preu>' + item[7].value
                + '</preu><puntuacio_pr>' + item[8].value
                + '</puntuacio_pr><puntuacio_pe>' + item[9].value
                + '</puntuacio_pe></item>';
        });
        itemsCat8.forEach((item, index) => {
            iteracioItemsCat8[index] =
                '<item categoria="4"><nom>' + item[0].value
                + '</nom><denominacio>' + item[1].value
                + '</denominacio><descripcio_es>' + item[2].value
                + '</descripcio_es><descripcio_ca>' + item[3].value
                + '</descripcio_ca><descripcio_en>' + item[4].value
                + '</descripcio_en><descripcio_fr>' + item[5].value
                + '</descripcio_fr><imatge>' + item[6].value
                + '</imatge><preu>' + item[7].value
                + '</preu><puntuacio_pr>' + item[8].value
                + '</puntuacio_pr><puntuacio_pe>' + item[9].value
                + '</puntuacio_pe></item>';
        });
        const stringIteracioItemsCat5 = iteracioItemsCat5.join("");
        const stringIteracioItemsCat6 = iteracioItemsCat6.join("");
        const stringIteracioItemsCat7 = iteracioItemsCat7.join("");
        const stringIteracioItemsCat8 = iteracioItemsCat8.join("");
        const stringIteracioTotal = stringIteracioItemsCat5 + stringIteracioItemsCat6 + stringIteracioItemsCat7 + stringIteracioItemsCat8;

        const xmlStr = '<?xml version="1.0" encoding="UTF-8"?><doc><data>' + laData() + '</data>' + stringIteracioTotal + '</doc>';
       
        const formData = new FormData();
        formData.append("fileXML", xmlStr);
        formData.append("quina", "vins");

        let apiUrl = rutaApi+"saveXML.php";
        await axios.post(apiUrl, formData, {
            headers: {
                //"Content-Type": "multipart/form-data",
                "Content-Type": "application/xml; charset=utf-8"
            }
        }).then(response => {
            console.log(response);
            setAlert({
                mensaje: "L'arxiu s'ha generat correctament.",
                tipo: 'success'
            })
            setOpenSnack(true);
        }).catch(err => {
            console.log(err);
            setAlert({
                mensaje: "Error al generar l'arxiu.",
                tipo: 'error'
            })
            setOpenSnack(true);
        });
        setFetCanviVins(false);
        setDadesCarregadesVins(false);
    }

    const processarDadesEdicio = (e) => {
        e.preventDefault();
        handleCloseDialog();
        let array;
        array = [...itemDefAEditar];
        if (!itemDefAEditar[0]) {
            array[0] = itemAEditar[0].value;
        }
        if (!itemDefAEditar[1]) {
            array[1] = itemAEditar[1].value;
        }
        if (!itemDefAEditar[2]) {
            array[2] = itemAEditar[2].value;
        }
        if (!itemDefAEditar[3]) {
            array[3] = itemAEditar[3].value;
        }
        if (!itemDefAEditar[4]) {
            array[4] = itemAEditar[4].value;
        }
        if (!itemDefAEditar[5]) {
            array[5] = itemAEditar[5].value;
        }
        if (!itemDefAEditar[6]) {
            array[6] = itemAEditar[6].value;
        }
        if (!itemDefAEditar[7]) {
            array[7] = itemAEditar[7].value;
        }
        if (!itemDefAEditar[8]) {
            array[8] = itemAEditar[8].value;
        }
        if (!itemDefAEditar[9]) {
            array[9] = itemAEditar[9].value;
        }

        switch (valueTab) {
            case 0:
                itemsCat5[keyAGestionar][0].value = array[0];
                itemsCat5[keyAGestionar][1].value = array[1];
                itemsCat5[keyAGestionar][2].value = array[2];
                itemsCat5[keyAGestionar][3].value = array[3];
                itemsCat5[keyAGestionar][4].value = array[4];
                itemsCat5[keyAGestionar][5].value = array[5];
                itemsCat5[keyAGestionar][6].value = array[6];
                itemsCat5[keyAGestionar][7].value = array[7];
                itemsCat5[keyAGestionar][8].value = array[8];
                itemsCat5[keyAGestionar][9].value = array[9];
                if (ordre1 !== (keyAGestionar + 1)) {
                    reOrdenar();
                }
                break;
            case 1:
                itemsCat6[keyAGestionar][0].value = array[0];
                itemsCat6[keyAGestionar][1].value = array[1];
                itemsCat6[keyAGestionar][2].value = array[2];
                itemsCat6[keyAGestionar][3].value = array[3];
                itemsCat6[keyAGestionar][4].value = array[4];
                itemsCat6[keyAGestionar][5].value = array[5];
                itemsCat6[keyAGestionar][6].value = array[6];
                itemsCat6[keyAGestionar][7].value = array[7];
                itemsCat6[keyAGestionar][8].value = array[8];
                itemsCat6[keyAGestionar][9].value = array[9];
                if (ordre2 !== (keyAGestionar + 1)) {
                    reOrdenar();
                }
                break;
            case 2:
                itemsCat7[keyAGestionar][0].value = array[0];
                itemsCat7[keyAGestionar][1].value = array[1];
                itemsCat7[keyAGestionar][2].value = array[2];
                itemsCat7[keyAGestionar][3].value = array[3];
                itemsCat7[keyAGestionar][4].value = array[4];
                itemsCat7[keyAGestionar][5].value = array[5];
                itemsCat7[keyAGestionar][6].value = array[6];
                itemsCat7[keyAGestionar][7].value = array[7];
                itemsCat7[keyAGestionar][8].value = array[8];
                itemsCat7[keyAGestionar][9].value = array[9];
                if (ordre3 !== (keyAGestionar + 1)) {
                    reOrdenar();
                }
                break;
            case 3:
                itemsCat8[keyAGestionar][0].value = array[0];
                itemsCat8[keyAGestionar][1].value = array[1];
                itemsCat8[keyAGestionar][2].value = array[2];
                itemsCat8[keyAGestionar][3].value = array[3];
                itemsCat8[keyAGestionar][4].value = array[4];
                itemsCat8[keyAGestionar][5].value = array[5];
                itemsCat8[keyAGestionar][6].value = array[6];
                itemsCat8[keyAGestionar][7].value = array[7];
                itemsCat8[keyAGestionar][8].value = array[8];
                itemsCat8[keyAGestionar][9].value = array[9];
                if (ordre4 !== (keyAGestionar + 1)) {
                    reOrdenar();
                }
                break;
            default:
        }
    }

    const processarDadesCreacio = (e) => {
        e.preventDefault();
        if (!itemDefACrear[0] ||
            !itemDefACrear[1] ||
            !itemDefACrear[2] ||
            !itemDefACrear[3] ||
            !itemDefACrear[4] ||
            !itemDefACrear[5] ||
            !itemDefACrear[6] ||
            !itemDefACrear[7] ||
            !itemDefACrear[8] ||
            !itemDefACrear[9]
        ) {
            setAlert({
                mensaje: "Falta alguna dada per omplir. Revisa el formulari.",
                tipo: 'error'
            })
            setOpenSnack(true);
            return;
        }

        let elValue = [];
        elValue.push(
            {
                'name': `nom`,
                'value': `${itemDefACrear[0]}`

            });
        elValue.push(
            {
                'name': `denominacio`,
                'value': `${itemDefACrear[1]}`

            });
        elValue.push(
            {
                'name': `descripcio_es`,
                'value': `${itemDefACrear[2]}`

            });
        elValue.push(
            {
                'name': `descripcio_ca`,
                'value': `${itemDefACrear[3]}`

            });
        elValue.push(
            {
                'name': `descripcio_en`,
                'value': `${itemDefACrear[4]}`

            });
        elValue.push(
            {
                'name': `descripcio_fr`,
                'value': `${itemDefACrear[5]}`

            });
        elValue.push(
            {
                'name': `imatge`,
                'value': `${itemDefACrear[6]}`

            });
        elValue.push(
            {
                'name': `preu`,
                'value': `${itemDefACrear[7]}`

            });
        elValue.push(
            {
                'name': `puntuacio_pr`,
                'value': `${itemDefACrear[8]}`

            });
        elValue.push(
            {
                'name': `puntuacio_pe`,
                'value': `${itemDefACrear[9]}`

            });
        let array1;
        switch (valueTab) {
            case 0:
                array1 = [...itemsCat5];
                if (ordre1 !== keyAGestionar) {
                    array1.splice((ordre1 - 1), 0, elValue);
                } else {
                    array1.push(elValue);
                }
                setItemsCat5(array1);
                break;
            case 1:
                array1 = [...itemsCat6];
                if (ordre2 !== keyAGestionar) {
                    array1.splice((ordre2 - 1), 0, elValue);
                } else {
                    array1.push(elValue);
                }
                setItemsCat6(array1);
                break;
            case 2:
                array1 = [...itemsCat7];
                if (ordre3 !== keyAGestionar) {
                    array1.splice((ordre3 - 1), 0, elValue);
                } else {
                    array1.push(elValue);
                }
                setItemsCat7(array1);
                break;
            case 3:
                array1 = [...itemsCat8];
                if (ordre4 !== keyAGestionar) {
                    array1.splice((ordre4 - 1), 0, elValue);
                } else {
                    array1.push(elValue);
                }
                setItemsCat8(array1);
                break;
            default:
        }
        handleCloseDialog();
    }

    const determinaOrdre = () => {
        switch (valueTab) {
            case 0:
                return ordre1;
            case 1:
                return ordre2;
            case 2:
                return ordre3;
            case 3:
                return ordre4;
            default:
        }
    }

    return (
        <div>
            <Backdrop className={classes.loading} open={openLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {!dadesCarregadesVins ? null : (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box
                            p={2}
                            mt={2}
                            className={classes.root1}
                        >
                            <Typography variant="h5">Carta Vins Casa Amàlia</Typography>
                            <Chip label={`Última actualització: ` + laDataXMLVins} />
                        </Box>
                        <Box
                            pl={2}
                            pr={2}
                        >
                            <Divider />
                        </Box>

                    </Grid>
                    <Grid item xs={12}>
                        <Box p={2}>
                            <div className={classes.root2}>
                                <AppBar position="static">
                                    <Tabs value={valueTab} onChange={handleChangeTab} orientation={orientacioTabs()}>
                                        <Tab label="Blancs" {...a11yProps(0)} />
                                        <Tab label="Rosats" {...a11yProps(1)} />
                                        <Tab label="Negres" {...a11yProps(2)} />
                                        <Tab label="Escumosos" {...a11yProps(3)} />
                                    </Tabs>
                                </AppBar>
                                <TabPanel value={valueTab} index={0}>
                                    {
                                        itemsCat5.length === 0 ? (
                                            <Typography variant="body1">No hi ha ítems.</Typography>
                                        ) : (
                                            itemsCat5.map((item, index) => (
                                                <Box mb={2} key={index}>
                                                    <Item prItem={item} prIndex={index} prBorrarItem={borrarItem} prHandleClickOpenDialogEdicio={handleClickOpenDialogEdicio} prEstemAPlats={estemAPlats} prEstemAVins={estemAVins} />
                                                </Box>
                                            ))
                                        )
                                    }
                                </TabPanel>
                                <TabPanel value={valueTab} index={1}>
                                    {
                                        itemsCat6.length === 0 ? (
                                            <Typography variant="body1">No hi ha ítems.</Typography>
                                        ) : (
                                            itemsCat6.map((item, index) => (
                                                <Box mb={2} key={index}>
                                                    <Item prItem={item} prIndex={index} prBorrarItem={borrarItem} prHandleClickOpenDialogEdicio={handleClickOpenDialogEdicio} prEstemAPlats={estemAPlats} prEstemAVins={estemAVins} />
                                                </Box>
                                            ))
                                        )
                                    }
                                </TabPanel>
                                <TabPanel value={valueTab} index={2}>
                                    {
                                        itemsCat7.length === 0 ? (
                                            <Typography variant="body1">No hi ha ítems.</Typography>
                                        ) : (
                                            itemsCat7.map((item, index) => (
                                                <Box mb={2} key={index}>
                                                    <Item prItem={item} prIndex={index} prBorrarItem={borrarItem} prHandleClickOpenDialogEdicio={handleClickOpenDialogEdicio} prEstemAPlats={estemAPlats} prEstemAVins={estemAVins} />
                                                </Box>
                                            ))
                                        )
                                    }

                                </TabPanel>
                                <TabPanel value={valueTab} index={3}>
                                    {
                                        itemsCat8.length === 0 ? (
                                            <Typography variant="body1">No hi ha ítems.</Typography>
                                        ) : (
                                            itemsCat8.map((item, index) => (
                                                <Box mb={2} key={index}>
                                                    <Item prItem={item} prIndex={index} prBorrarItem={borrarItem} prHandleClickOpenDialogEdicio={handleClickOpenDialogEdicio} prEstemAPlats={estemAPlats} prEstemAVins={estemAVins} />
                                                </Box>
                                            ))
                                        )
                                    }
                                </TabPanel>
                                <Grid xs={12} lg={6} item style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Box style={{ width: '50%' }} pl={3}>
                                        <Button color="primary" variant="contained" fullWidth onClick={() => handleClickOpenDialogCreacio()}>
                                            Crear registre
                                        </Button>
                                    </Box>
                                    <Box style={{ width: '50%' }} pl={1}>
                                        <Button color="secondary" fullWidth variant="contained" onClick={generarCarta}>
                                            Generar carta vins
                                        </Button>
                                    </Box>
                                </Grid>
                            </div>
                        </Box >
                    </Grid >
                </Grid >
            )}
            <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
                <Alert severity={alert.tipo} onClose={handleCloseSnack}>
                    {alert.mensaje}
                </Alert>
            </Snackbar>
            {(itemAEditar.length !== 0 || modeDialog === 'creacio') ? (

                <Box style={{ marginBottom: '20px' }}>
                    <Dialog
                        open={openDialog}
                        onClose={handleCloseDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        fullWidth
                        maxWidth="lg"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {
                                modeDialog === 'creacio' ? (`Crear registre`) : (`Editar registre: ` + (keyAGestionar + 1))
                            }
                        </DialogTitle>
                        <DialogContent>
                            <form onSubmit=
                                {
                                    modeDialog === 'creacio' ? (processarDadesCreacio) : (processarDadesEdicio)
                                }
                            >
                                <AppBar position="static">
                                    <Tabs value={valueTab2} onChange={handleChangeTab2} orientation={orientacioTabs()}>
                                        <Tab label="Ca" {...a11yProps(0)} />
                                        <Tab label="Es" {...a11yProps(1)} />
                                        <Tab label="En" {...a11yProps(2)} />
                                        <Tab label="Fr" {...a11yProps(3)} />
                                    </Tabs>
                                </AppBar>
                                <TabPanel value={valueTab2} index={0}>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Nom</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-nom"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[0] ? null : (itemDefACrear[0])) : (!itemDefAEditar[0] ? (itemAEditar[0].value) : (itemDefAEditar[0]))
                                            }
                                            onInput={setRegistre}
                                        />
                                    </FormControl>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Denominació</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-den"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[1] ? null : (itemDefACrear[1])) : (!itemDefAEditar[1] ? (itemAEditar[1].value) : (itemDefAEditar[1]))
                                            }
                                            onInput={setRegistre}
                                        />
                                    </FormControl>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Descripció [Ca]</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-des-ca"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[3] ? null : (itemDefACrear[3])) : (!itemDefAEditar[3] ? (itemAEditar[3].value) : (itemDefAEditar[3]))
                                            }
                                            onInput={setRegistre}
                                        />
                                    </FormControl>
                                </TabPanel>
                                <TabPanel value={valueTab2} index={1}>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Nom</InputLabel>
                                        <Input
                                            fullWidth
                                            disabled
                                            className={classes.formInput}
                                            id="form-nom"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[0] ? null : (itemDefACrear[0])) : (!itemDefAEditar[0] ? (itemAEditar[0].value) : (itemDefAEditar[0]))
                                            }
                                            onInput={setRegistre}
                                        />
                                    </FormControl>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Denominació</InputLabel>
                                        <Input
                                            fullWidth
                                            disabled
                                            className={classes.formInput}
                                            id="form-den"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[1] ? null : (itemDefACrear[1])) : (!itemDefAEditar[1] ? (itemAEditar[1].value) : (itemDefAEditar[1]))
                                            }
                                            onInput={setRegistre}
                                        />
                                    </FormControl>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Descripció [Es]</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-des-es"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[2] ? null : (itemDefACrear[2])) : (!itemDefAEditar[2] ? (itemAEditar[2].value) : (itemDefAEditar[2]))
                                            }
                                            onInput={setRegistre}
                                        />
                                    </FormControl>
                                </TabPanel>
                                <TabPanel value={valueTab2} index={2}>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Nom</InputLabel>
                                        <Input
                                            fullWidth
                                            disabled
                                            className={classes.formInput}
                                            id="form-nom"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[0] ? null : (itemDefACrear[0])) : (!itemDefAEditar[0] ? (itemAEditar[0].value) : (itemDefAEditar[0]))
                                            }
                                            onInput={setRegistre}
                                        />
                                    </FormControl>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Denominació</InputLabel>
                                        <Input
                                            fullWidth
                                            disabled
                                            className={classes.formInput}
                                            id="form-den"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[1] ? null : (itemDefACrear[1])) : (!itemDefAEditar[1] ? (itemAEditar[1].value) : (itemDefAEditar[1]))
                                            }
                                            onInput={setRegistre}
                                        />
                                    </FormControl>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Descripció [En]</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-des-en"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[4] ? null : (itemDefACrear[4])) : (!itemDefAEditar[4] ? (itemAEditar[4].value) : (itemDefAEditar[4]))
                                            }
                                            onInput={setRegistre}
                                        />
                                    </FormControl>
                                </TabPanel>
                                <TabPanel value={valueTab2} index={3}>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Nom</InputLabel>
                                        <Input
                                            fullWidth
                                            disabled
                                            className={classes.formInput}
                                            id="form-nom"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[0] ? null : (itemDefACrear[0])) : (!itemDefAEditar[0] ? (itemAEditar[0].value) : (itemDefAEditar[0]))
                                            }
                                            onInput={setRegistre}
                                        />
                                    </FormControl>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Denominació</InputLabel>
                                        <Input
                                            fullWidth
                                            disabled
                                            className={classes.formInput}
                                            id="form-den"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[1] ? null : (itemDefACrear[1])) : (!itemDefAEditar[1] ? (itemAEditar[1].value) : (itemDefAEditar[1]))
                                            }
                                            onInput={setRegistre}
                                        />
                                    </FormControl>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Descripció [Fr]</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-des-fr"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[5] ? null : (itemDefACrear[5])) : (!itemDefAEditar[5] ? (itemAEditar[5].value) : (itemDefAEditar[5]))
                                            }
                                            onInput={setRegistre} />
                                    </FormControl>
                                </TabPanel>
                                <Box px={3} style={{ marginTop: '-20px' }}>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Preu</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-pre"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? null : (itemAEditar[7].value)
                                            }
                                            onInput={setRegistre}
                                        />
                                        <FormHelperText>S'ha de posar el preu inclòs el símbol d'€</FormHelperText>
                                    </FormControl>
                                    <Box className={classes.root1}>
                                        <FormControl fullWidth className={clsx(classes.margin)}>
                                            <InputLabel id="demo-simple-select-label">Puntuació Parker</InputLabel>
                                            <Select
                                                id="form-par"
                                                label="Select"
                                                value={parker}
                                                onChange={handleChangeSelectPr}
                                                helpertext="Selecciona puntuació"
                                            >
                                                {puntuacio.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth className={clsx(classes.margin)}>
                                            <InputLabel id="demo-simple-select-label">Puntuació Peñín</InputLabel>
                                            <Select
                                                id="form-par"
                                                label="Select"
                                                value={penin}
                                                onChange={handleChangeSelectPe}
                                                helpertext="Selecciona puntuació"
                                            >
                                                {puntuacio.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>
                                <Box px={3} pt={3} className={classes.root11} style={{ marginBottom: '20px' }}>
                                    {
                                        preFile !== null ? (
                                            <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                                <img ref={refImg} className={classes.img_dialog} alt="" src={preFile} />
                                                <IconButton
                                                    className={classes.btnError}
                                                    style={{ marginLeft: '-55px', marginTop: '5px' }}
                                                    onClick={resetImage}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>) : null
                                    }
                                    <Box className={clsx(classes.root11, classes.pl_dialog)} style={{ width: '100%', justifyContent: 'flex-start' }}>
                                        <Box className={classes.box80} >
                                            <Input accept="image/*" id="uploadCaptureInputFile" multiple type="file" onChange={handleChangeImage} />
                                            <Button variant="contained" component="span" style={{ margin: '15px' }} onClick={handleSubmitImage}
                                                disabled={botoDesactivat}
                                            >
                                                Pujar
                                            </Button>
                                        </Box>
                                        <Box className={classes.box20}>
                                            <FormControl variant="outlined" fullWidth className={clsx(classes.margin)} >
                                                <InputLabel
                                                    id="demo-simple-select-label"
                                                >Ordre a la categoria</InputLabel>
                                                <Select
                                                    id="form-ordre"
                                                    label="Ordre a la categoria"
                                                    value={determinaOrdre()}
                                                    onChange={handleChangeSelect1}
                                                    helpertext="Selecciona ordre"
                                                >{
                                                        valueTab === 0 ? (
                                                            selectItemsCat5.map((option) => (
                                                                <MenuItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))
                                                        ) : valueTab === 1 ? (
                                                            selectItemsCat6.map((option) => (
                                                                <MenuItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))
                                                        ) : valueTab === 2 ? (
                                                            selectItemsCat7.map((option) => (
                                                                <MenuItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))
                                                        ) : (selectItemsCat8.map((option) => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        )))
                                                    }

                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                </Box>
                                <Button
                                    fullWidth
                                    className={classes.formButton}
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    type="submit"
                                    style={{ marginBottom: '15px' }}
                                >
                                    Registrar
                                </Button>

                            </form>
                        </DialogContent>
                    </Dialog>
                </Box>
            ) : null}
        </div>
    )
}

export default withRouter(Vins)
