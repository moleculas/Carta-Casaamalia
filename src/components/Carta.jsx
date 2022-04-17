import React, { useState, useEffect, useContext, useRef, Fragment } from 'react';
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
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Paper from '@material-ui/core/Paper';

const parades = Constantes.PARADES;
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
     //titols
    casellaTitol: {
        marginBottom: 30,
        padding: 13
    }
}));

//snackbar y alert
const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

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
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

function useForceUpdate() {
    let [value, setState] = useState(true);
    return () => setState(!value);
};

const Carta = (props) => {
    let forceUpdate = useForceUpdate();
    const classes = estilos();
    const {
        logged,
        usuari,
        dadesCarregadesCarta,
        setDadesCarregadesCarta,
        itemsCat1,
        setItemsCat1,
        itemsCat2,
        setItemsCat2,
        itemsCat3,
        setItemsCat3,
        itemsCat4,
        setItemsCat4,
        laDataXMLCarta,
        setLaDataXMLCarta,
        titolsXMLCarta,
        setTitolsXMLCarta,
        fetCanviCarta,
        setFetCanviCarta
    } = useContext(CartaContext);

    const [selectItemsCat1, setSelectItemsCat1] = useState([]);
    const [selectItemsCat2, setSelectItemsCat2] = useState([]);
    const [selectItemsCat3, setSelectItemsCat3] = useState([]);
    const [selectItemsCat4, setSelectItemsCat4] = useState([]);
    const [itemAEditar, setItemAEditar] = useState([]);
    const [itemDefAEditar, setItemDefAEditar] = useState([]);
    const [itemDefACrear, setItemDefACrear] = useState([]);
    const [valuesFormTitols, setValuesFormTitols] = useState([
        {
            ca: '',
            es: '',
            en: '',
            fr: ''
        },
        {
            ca: '',
            es: '',
            en: '',
            fr: ''
        },
        {
            ca: '',
            es: '',
            en: '',
            fr: ''
        },
        {
            ca: '',
            es: '',
            en: '',
            fr: ''
        }
    ]);
    const [keyAGestionar, setKeyAGestionar] = useState(null);
    const [modeDialog, setModeDialog] = useState(null);
    const [estemAPlats] = useState(true);
    const [estemAVins] = useState(false);
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
    };

    const handleChangeTab2 = (event, newValue) => {
        setValueTab2(newValue);
    };

    const esDesktop = useMediaQuery(theme => theme.breakpoints.up('lg'));

    const orientacioTabs = () => {
        if (esDesktop) {
            return "horizontal";
        } else {
            return "vertical";
        }
    };

    const [file, setFile] = useState(null);
    const [preFile, setPreFile] = useState(null);
    const refImg = useRef();
    const [botoDesactivat, setBotoDesactivat] = useState(true);
    const [visibilitatCarta, setVisibilitatCarta] = useState(true);
    //dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogTitols, setOpenDialogTitols] = useState(false);

    const handleOpendialogTitols = () => {
        setOpenDialogTitols(true);
    };

    const handleClickOpenDialogEdicio = (elItemAEditar, laKey) => {
        setFetCanviCarta(true);
        setModeDialog('edicio');
        setItemDefAEditar([]);
        setBotoDesactivat(true);
        setKeyAGestionar(laKey);
        setItemAEditar(elItemAEditar);
        setOpenDialog(true);
        const myArr = (elItemAEditar[10].value).split(",");
        const myArr2 = [];
        myArr.forEach((item) => {
            const elStringParadaNom = parades[item];
            myArr2.push(elStringParadaNom);
        });
        setParada(myArr2);
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

        let elPreFile = 'images/plats_imatges/' + elItemAEditar[8].value;
        setPreFile(elPreFile);
        if (elItemAEditar[11].value === '1') {
            setVisibilitatCarta(true)
        } else {
            setVisibilitatCarta(false)
        };
    };

    const handleClickOpenDialogCreacio = () => {
        setFetCanviCarta(true);
        setModeDialog('creacio');
        setItemDefACrear([]);
        setBotoDesactivat(true);
        setOpenDialog(true);
        setVisibilitatCarta(true);
        let array;
        let elValueAAfegir;
        switch (valueTab) {
            case 0:
                array = [...selectItemsCat1];
                elValueAAfegir = { 'value': `${itemsCat1.length + 1}`, 'label': `${itemsCat1.length + 1}` };
                array.push(elValueAAfegir);
                setSelectItemsCat1(array);
                setOrdre1(itemsCat1.length + 1);
                setKeyAGestionar(itemsCat1.length + 1);
                break;
            case 1:
                array = [...selectItemsCat2];
                elValueAAfegir = { 'value': `${itemsCat2.length + 1}`, 'label': `${itemsCat2.length + 1}` };
                array.push(elValueAAfegir);
                setSelectItemsCat2(array);
                setOrdre2(itemsCat2.length + 1);
                setKeyAGestionar(itemsCat2.length + 1);
                break;
            case 2:
                array = [...selectItemsCat3];
                elValueAAfegir = { 'value': `${itemsCat3.length + 1}`, 'label': `${itemsCat3.length + 1}` };
                array.push(elValueAAfegir);
                setSelectItemsCat3(array);
                setOrdre3(itemsCat3.length + 1);
                setKeyAGestionar(itemsCat3.length + 1);
                break;
            case 3:
                array = [...selectItemsCat4];
                elValueAAfegir = { 'value': `${itemsCat4.length + 1}`, 'label': `${itemsCat4.length + 1}` };
                array.push(elValueAAfegir);
                setSelectItemsCat4(array);
                setOrdre4(itemsCat4.length + 1);
                setKeyAGestionar(itemsCat4.length + 1);
                break;
            default:
        }
    };

    const setRegistre = (event) => {
        let array;
        switch (event.target.id) {
            case 'form-nom-ca':
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
            case 'form-nom-es':
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
            case 'form-nom-en':
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
            case 'form-nom-fr':
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
            case 'form-des-ca':
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
            case 'form-des-es':
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
            case 'form-des-en':
                if (modeDialog === 'edicio') {
                    array = [...itemDefAEditar];
                    array[6] = event.target.value;
                    setItemDefAEditar(array);
                } else {
                    array = [...itemDefACrear];
                    array[6] = event.target.value;
                    setItemDefACrear(array);
                }
                break;
            case 'form-des-fr':
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
            case 'form-pre':
                if (modeDialog === 'edicio') {
                    array = [...itemDefAEditar];
                    array[9] = event.target.value;
                    setItemDefAEditar(array);
                } else {
                    array = [...itemDefACrear];
                    array[9] = event.target.value;
                    setItemDefACrear(array);
                }
                break;
            default:
        }
    };

    const handleChangeFormTitols = (prop) => (event) => {
        let array = [...valuesFormTitols];
        array[valueTab] = { ...valuesFormTitols[valueTab], [prop]: event.target.value }
        setValuesFormTitols(array);
    };

    const handleClickVisibilitat = () => {
        setVisibilitatCarta(!visibilitatCarta);
        let array;
        if (modeDialog === 'edicio') {
            array = [...itemDefAEditar];
            if (!visibilitatCarta) {
                array[11] = '1';
            } else {
                array[11] = '0';
            }
            setItemDefAEditar(array);
        } else {
            array = [...itemDefACrear];
            if (!visibilitatCarta) {
                array[11] = '1';
            } else {
                array[11] = '0';
            }
            setItemDefACrear(array);
        }
    };

    const handleMouseDownVisibilitat = (event) => {
        event.preventDefault();
    };

    const handleCloseDialog = () => {
        if (modeDialog === "creacio") {
            let array;
            switch (valueTab) {
                case 0:
                    array = [...selectItemsCat1];
                    array.pop();
                    setSelectItemsCat1(array);
                    break;
                case 1:
                    array = [...selectItemsCat2];
                    array.pop();
                    setSelectItemsCat2(array);
                    break;
                case 2:
                    array = [...selectItemsCat3];
                    array.pop();
                    setSelectItemsCat3(array);
                    break;
                case 3:
                    array = [...selectItemsCat4];
                    array.pop();
                    setSelectItemsCat4(array);
                    break;
                default:
            }
        }
        setOpenDialog(false);
        setModeDialog(null);
        setItemAEditar([]);
        setParada([]);
        setPreFile(null);
        setFile(null);
        setVisibilitatCarta(true);
    };

    const handleCloseDialogTitols = () => {
        setOpenDialogTitols(false);
        setValuesFormTitols([
            {
                ca: '',
                es: '',
                en: '',
                fr: ''
            },
            {
                ca: '',
                es: '',
                en: '',
                fr: ''
            },
            {
                ca: '',
                es: '',
                en: '',
                fr: ''
            },
            {
                ca: '',
                es: '',
                en: '',
                fr: ''
            }
        ]);
    };

    const [parada, setParada] = useState([]);

    const handleChangeSelect = (event) => {
        const {
            target: { value },
        } = event;
        setParada(
            typeof value === 'string' ? value.split(',') : value,
        );
        //console.log(parades.indexOf(value[value.length-1]))
        let array;
        if (modeDialog === 'edicio') {
            array = [...itemDefAEditar];
            array[10] = retornaParadesNum(event.target.value.toString())
            setItemDefAEditar(array);
        } else {
            array = [...itemDefACrear];
            array[10] = retornaParadesNum(event.target.value.toString())
            setItemDefACrear(array);
        }
    };

    const retornaParadesNum = (elStringParada) => {
        elStringParada = elStringParada.replace('No', '0');
        elStringParada = elStringParada.replace('(183) Cansaladeria & Xarcuteria Ollé', '1');
        elStringParada = elStringParada.replace('(61-66) Fruites i Verdures Francisco - Mari', '2');
        elStringParada = elStringParada.replace('(59-60 - 60 bis) Carns Paloma', '3');
        elStringParada = elStringParada.replace('(162-165) Verdures i Fruits Molins', '4');
        elStringParada = elStringParada.replace('(69-76) Avinova - Mercè', '5');
        elStringParada = elStringParada.replace('(77-81) Xarcuteria Cansaladeria Filo', '6');
        elStringParada = elStringParada.replace('(144-155 & 158-160) Marisc i Peix M. Pintanel', '7');
        elStringParada = elStringParada.replace('(156-157) Cut Fish', '8');
        elStringParada = elStringParada.replace('(84-89) Sunta, Peixaters de Barcelona', '9');
        elStringParada = elStringParada.replace('(82-83) Pesca Salada Mañé', '10');
        elStringParada = elStringParada.replace('(90-91-92) Peix Fresc Pilar', '11');
        elStringParada = elStringParada.replace('(93-94) Peix de Platja Enric Bassó', '12');
        elStringParada = elStringParada.replace('(133-137) Fina - Coloma', '13');
        elStringParada = elStringParada.replace('(138-139) La Ideal', '14');
        elStringParada = elStringParada.replace('(98-101) Fruites i Verdures E. Siscart', '15');
        elStringParada = elStringParada.replace('(95-96) Anna i Veronica, aviram i caça selecta', '16');
        elStringParada = elStringParada.replace('(104) El Racó dels Embotits, Rosa & Iris', '17');
        elStringParada = elStringParada.replace('(122-125) Xarcuteria Torres-Vilà', '18');
        elStringParada = elStringParada.replace('(118-121) Llegums cuits, menjars preparats i fruits secs F. Lorente', '19');
        elStringParada = elStringParada.replace('(115) Fruites i Verdures Jose Mª - Carmen', '20');
        elStringParada = elStringParada.replace('(106-109) Carnisseria Debon', '21');
        elStringParada = elStringParada.replace('(110-111) Angeleta', '22');
        elStringParada = elStringParada.replace('(112-113) Carnes Selectas Conxi', '23');
        elStringParada = elStringParada.replace('(105) Olives i Conserves Mª Rosa Benet', '24');
        elStringParada = elStringParada.replace('(19-21) Xarcuteria Yeste', '25');
        elStringParada = elStringParada.replace('(29-32) Xarcuteria TOTBO DEBÓN', '26');
        elStringParada = elStringParada.replace('(39) Farina, Pasta Fresca Artesanal', '27');
        elStringParada = elStringParada.replace('(42-46) Fruites i Verdures Manolita', '28');
        elStringParada = elStringParada.replace('(52-55) Carnisseria Cinta', '29');
        elStringParada = elStringParada.replace('(3-5) Frutas y Verduras Vilaseca', '30');
        elStringParada = elStringParada.replace('(6-7) Bacallaneria Masclans', '31');
        elStringParada = elStringParada.replace('(8-11) Carnisseria Figueras', '32');
        elStringParada = elStringParada.replace('(12-13) Xarcuteria Teruel', '33');
        elStringParada = elStringParada.replace('(179-182) Llegums cuits, menjars preparats i fruits secs F. Lorente', '34');
        return elStringParada;
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
    };

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
                mensaje: "L'orientació de la imatge no és correcta, ha de ser horitzontal. No acceptat.",
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
        formData.append("quina", "plats");
        let apiUrl = rutaApi + "upload.php";
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
                array[8] = file.name;
                setItemDefAEditar(array);
            } else {
                array = [...itemDefACrear];
                array[8] = file.name;
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
                itemsCat1.forEach((item, index) => {
                    elValue = { 'value': `${index + 1}`, 'label': `${index + 1}` };
                    array.push(elValue);
                });
                setSelectItemsCat1(array);
                break;
            case '2':
                itemsCat2.forEach((item, index) => {
                    elValue = { 'value': `${index + 1}`, 'label': `${index + 1}` };
                    array.push(elValue);
                });
                setSelectItemsCat2(array);
                break;
            case '3':
                itemsCat3.forEach((item, index) => {
                    elValue = { 'value': `${index + 1}`, 'label': `${index + 1}` };
                    array.push(elValue);
                });
                setSelectItemsCat3(array);
                break;
            case '4':
                itemsCat4.forEach((item, index) => {
                    elValue = { 'value': `${index + 1}`, 'label': `${index + 1}` };
                    array.push(elValue);
                });
                setSelectItemsCat4(array);
                break;
            default:
        }
    };

    useEffect(() => {
        if (!logged) {
            props.history.push('/login')
        }
    }, [logged, props.history]);

    useEffect(() => {
        if (itemsCat1.length > 0) {
            generaItemsSelectCat('1');
        };
        if (itemsCat2.length > 0) {
            generaItemsSelectCat('2');
        };
        if (itemsCat3.length > 0) {
            generaItemsSelectCat('3');
        };
        if (itemsCat4.length > 0) {
            generaItemsSelectCat('4');
        };
    }, [itemsCat1, itemsCat2, itemsCat3, itemsCat4]);

    useEffect(() => {
        if (logged) {
            if (!dadesCarregadesCarta) {
                setOpenLoading(true);
                let prePath;
                if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
                    prePath = '../';
                } else {
                    prePath = '';
                }
                (async () => {
                    axios.get(prePath + 'xml/menu.xml', {
                        "Content-Type": "application/xml; charset=utf-8"
                    }).then(res => {
                        let p1 = [];
                        let p2 = [];
                        let p3 = [];
                        let p4 = [];
                        let titols = [];
                        var xml = new XMLParser().parseFromString(res.data);
                        let elsItems = xml.children;
                        setLaDataXMLCarta(elsItems[0].value);
                        for (let i in elsItems) {
                            if (elsItems[i].attributes.categoria === "titol") {
                                titols.push(elsItems[i].children);
                            };
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
                            };
                        };
                        setTitolsXMLCarta(titols);
                        setItemsCat1(p1);
                        setItemsCat2(p2);
                        setItemsCat3(p3);
                        setItemsCat4(p4);
                        setOpenLoading(false);
                        setDadesCarregadesCarta(true);
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
    }, [logged, dadesCarregadesCarta]);

    const laData = (elUsuari) => {
        let data = new Date().toLocaleString() + '';
        return data + ' per ' + elUsuari;
    };

    const reOrdenar = () => {
        let fromIndex;
        let element;
        let toIndex;
        switch (valueTab) {
            case 0:
                fromIndex = itemsCat1.indexOf(itemsCat1[keyAGestionar]);
                toIndex = (ordre1 - 1);
                element = itemsCat1[fromIndex];
                itemsCat1.splice(fromIndex, 1);
                itemsCat1.splice(toIndex, 0, element);
                break;
            case 1:
                fromIndex = itemsCat2.indexOf(itemsCat2[keyAGestionar]);
                toIndex = (ordre2 - 1);
                element = itemsCat2[fromIndex];
                itemsCat2.splice(fromIndex, 1);
                itemsCat2.splice(toIndex, 0, element);
                break;
            case 2:
                fromIndex = itemsCat3.indexOf(itemsCat3[keyAGestionar]);
                toIndex = (ordre3 - 1);
                element = itemsCat3[fromIndex];
                itemsCat3.splice(fromIndex, 1);
                itemsCat3.splice(toIndex, 0, element);
                break;
            case 3:
                fromIndex = itemsCat4.indexOf(itemsCat4[keyAGestionar]);
                toIndex = (ordre4 - 1);
                element = itemsCat4[fromIndex];
                itemsCat4.splice(fromIndex, 1);
                itemsCat4.splice(toIndex, 0, element);
                break;
            default:
        }
    };

    const borrarItem = (index) => {
        let fromIndex;
        switch (valueTab) {
            case 0:
                fromIndex = itemsCat1.indexOf(itemsCat1[index]);
                itemsCat1.splice(fromIndex, 1);
                generaItemsSelectCat('1');
                break;
            case 1:
                fromIndex = itemsCat2.indexOf(itemsCat2[index]);
                itemsCat2.splice(fromIndex, 1);
                generaItemsSelectCat('2');
                break;
            case 2:
                fromIndex = itemsCat3.indexOf(itemsCat3[index]);
                itemsCat3.splice(fromIndex, 1);
                generaItemsSelectCat('3');
                break;
            case 3:
                fromIndex = itemsCat4.indexOf(itemsCat4[index]);
                itemsCat4.splice(fromIndex, 1);
                generaItemsSelectCat('4');
                break;
            default:
        };
        setFetCanviCarta(true);
        forceUpdate();
    };

    const generarCarta = async () => {
        if (!fetCanviCarta) {
            setAlert({
                mensaje: "No has fet cap canvi. (A qui vols enganyar...)",
                tipo: 'warning'
            })
            setOpenSnack(true);
            return;
        };
        if (itemsCat1.length === 0 || itemsCat2.length === 0 || itemsCat3.length === 0 || itemsCat4.length === 0) {
            setAlert({
                mensaje: "Alguna de les categories està buida. Afegeix com a mínim un plat.",
                tipo: 'error'
            })
            setOpenSnack(true);
            return;
        };
        const iteracioItemsCat1 = [];
        const iteracioItemsCat2 = [];
        const iteracioItemsCat3 = [];
        const iteracioItemsCat4 = [];
        itemsCat1.forEach((item, index) => {
            iteracioItemsCat1[index] =
                '<item categoria="1"><nom_es>' + item[0].value
                + '</nom_es><nom_ca>' + item[1].value
                + '</nom_ca><nom_en>' + item[2].value
                + '</nom_en><nom_fr>' + item[3].value
                + '</nom_fr><descripcio_es>' + item[4].value
                + '</descripcio_es><descripcio_ca>' + item[5].value
                + '</descripcio_ca><descripcio_en>' + item[6].value
                + '</descripcio_en><descripcio_fr>' + item[7].value
                + '</descripcio_fr><imatge>' + item[8].value
                + '</imatge><preu>' + item[9].value
                + '</preu><parada>' + item[10].value
                + '</parada><visibilitat>' + item[11].value
                + '</visibilitat></item>';
        });
        itemsCat2.forEach((item, index) => {
            iteracioItemsCat2[index] =
                '<item categoria="2"><nom_es>' + item[0].value
                + '</nom_es><nom_ca>' + item[1].value
                + '</nom_ca><nom_en>' + item[2].value
                + '</nom_en><nom_fr>' + item[3].value
                + '</nom_fr><descripcio_es>' + item[4].value
                + '</descripcio_es><descripcio_ca>' + item[5].value
                + '</descripcio_ca><descripcio_en>' + item[6].value
                + '</descripcio_en><descripcio_fr>' + item[7].value
                + '</descripcio_fr><imatge>' + item[8].value
                + '</imatge><preu>' + item[9].value
                + '</preu><parada>' + item[10].value
                + '</parada><visibilitat>' + item[11].value
                + '</visibilitat></item>';
        });
        itemsCat3.forEach((item, index) => {
            iteracioItemsCat3[index] =
                '<item categoria="3"><nom_es>' + item[0].value
                + '</nom_es><nom_ca>' + item[1].value
                + '</nom_ca><nom_en>' + item[2].value
                + '</nom_en><nom_fr>' + item[3].value
                + '</nom_fr><descripcio_es>' + item[4].value
                + '</descripcio_es><descripcio_ca>' + item[5].value
                + '</descripcio_ca><descripcio_en>' + item[6].value
                + '</descripcio_en><descripcio_fr>' + item[7].value
                + '</descripcio_fr><imatge>' + item[8].value
                + '</imatge><preu>' + item[9].value
                + '</preu><parada>' + item[10].value
                + '</parada><visibilitat>' + item[11].value
                + '</visibilitat></item>';
        });
        itemsCat4.forEach((item, index) => {
            iteracioItemsCat4[index] =
                '<item categoria="4"><nom_es>' + item[0].value
                + '</nom_es><nom_ca>' + item[1].value
                + '</nom_ca><nom_en>' + item[2].value
                + '</nom_en><nom_fr>' + item[3].value
                + '</nom_fr><descripcio_es>' + item[4].value
                + '</descripcio_es><descripcio_ca>' + item[5].value
                + '</descripcio_ca><descripcio_en>' + item[6].value
                + '</descripcio_en><descripcio_fr>' + item[7].value
                + '</descripcio_fr><imatge>' + item[8].value
                + '</imatge><preu>' + item[9].value
                + '</preu><parada>' + item[10].value
                + '</parada><visibilitat>' + item[11].value
                + '</visibilitat></item>';
        });
        const stringIteracioItemsCat1 = iteracioItemsCat1.join("");
        const stringIteracioItemsCat2 = iteracioItemsCat2.join("");
        const stringIteracioItemsCat3 = iteracioItemsCat3.join("");
        const stringIteracioItemsCat4 = iteracioItemsCat4.join("");
        const stringIteracioTitols =
            '<item categoria="titol"><titol_ca>' + titolsXMLCarta[0][0].value
            + '</titol_ca><titol_es>' + titolsXMLCarta[0][1].value
            + '</titol_es><titol_en>' + titolsXMLCarta[0][2].value
            + '</titol_en><titol_fr>' + titolsXMLCarta[0][3].value
            + '</titol_fr></item><item categoria="titol"><titol_ca>' + titolsXMLCarta[1][0].value
            + '</titol_ca><titol_es>' + titolsXMLCarta[1][1].value
            + '</titol_es><titol_en>' + titolsXMLCarta[1][2].value
            + '</titol_en><titol_fr>' + titolsXMLCarta[1][3].value
            + '</titol_fr></item><item categoria="titol"><titol_ca>' + titolsXMLCarta[2][0].value
            + '</titol_ca><titol_es>' + titolsXMLCarta[2][1].value
            + '</titol_es><titol_en>' + titolsXMLCarta[2][2].value
            + '</titol_en><titol_fr>' + titolsXMLCarta[2][3].value
            + '</titol_fr></item><item categoria="titol"><titol_ca>' + titolsXMLCarta[3][0].value
            + '</titol_ca><titol_es>' + titolsXMLCarta[3][1].value
            + '</titol_es><titol_en>' + titolsXMLCarta[3][2].value
            + '</titol_en><titol_fr>' + titolsXMLCarta[3][3].value
            + '</titol_fr></item>';
        const stringIteracioTotal = stringIteracioTitols + stringIteracioItemsCat1 + stringIteracioItemsCat2 + stringIteracioItemsCat3 + stringIteracioItemsCat4;
        const xmlStr = '<?xml version="1.0" encoding="UTF-8"?><doc><data>' + laData(usuari) + '</data>' + stringIteracioTotal + '</doc>';
        const formData = new FormData();
        formData.append("fileXML", xmlStr);
        formData.append("quina", "plats");
        let apiUrl = rutaApi + "saveXML.php";
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
        setFetCanviCarta(false);
        setDadesCarregadesCarta(false);
    };

    const processarDadesTitol = (e) => {
        e.preventDefault();
        let array = [...titolsXMLCarta];
        if (valuesFormTitols[valueTab].ca) {
            array[valueTab][0].value = valuesFormTitols[valueTab].ca;
        };
        if (valuesFormTitols[valueTab].es) {
            array[valueTab][1].value = valuesFormTitols[valueTab].es;
        };
        if (valuesFormTitols[valueTab].en) {
            array[valueTab][2].value = valuesFormTitols[valueTab].en;
        };
        if (valuesFormTitols[valueTab].fr) {
            array[valueTab][3].value = valuesFormTitols[valueTab].fr;
        };
        setTitolsXMLCarta(array);
        handleCloseDialogTitols();
        setFetCanviCarta(true);
    };

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
        if (!itemDefAEditar[10]) {
            array[10] = itemAEditar[10].value;
        }
        if (!itemDefAEditar[11]) {
            array[11] = itemAEditar[11].value;
        };
        switch (valueTab) {
            case 0:
                itemsCat1[keyAGestionar][0].value = array[0];
                itemsCat1[keyAGestionar][1].value = array[1];
                itemsCat1[keyAGestionar][2].value = array[2];
                itemsCat1[keyAGestionar][3].value = array[3];
                itemsCat1[keyAGestionar][4].value = array[4];
                itemsCat1[keyAGestionar][5].value = array[5];
                itemsCat1[keyAGestionar][6].value = array[6];
                itemsCat1[keyAGestionar][7].value = array[7];
                itemsCat1[keyAGestionar][8].value = array[8];
                itemsCat1[keyAGestionar][9].value = array[9];
                itemsCat1[keyAGestionar][10].value = array[10];
                itemsCat1[keyAGestionar][11].value = array[11];
                if (ordre1 !== (keyAGestionar + 1)) {
                    reOrdenar();
                }
                break;
            case 1:
                itemsCat2[keyAGestionar][0].value = array[0];
                itemsCat2[keyAGestionar][1].value = array[1];
                itemsCat2[keyAGestionar][2].value = array[2];
                itemsCat2[keyAGestionar][3].value = array[3];
                itemsCat2[keyAGestionar][4].value = array[4];
                itemsCat2[keyAGestionar][5].value = array[5];
                itemsCat2[keyAGestionar][6].value = array[6];
                itemsCat2[keyAGestionar][7].value = array[7];
                itemsCat2[keyAGestionar][8].value = array[8];
                itemsCat2[keyAGestionar][9].value = array[9];
                itemsCat2[keyAGestionar][10].value = array[10];
                itemsCat2[keyAGestionar][11].value = array[11];
                if (ordre2 !== (keyAGestionar + 1)) {
                    reOrdenar();
                }
                break;
            case 2:
                itemsCat3[keyAGestionar][0].value = array[0];
                itemsCat3[keyAGestionar][1].value = array[1];
                itemsCat3[keyAGestionar][2].value = array[2];
                itemsCat3[keyAGestionar][3].value = array[3];
                itemsCat3[keyAGestionar][4].value = array[4];
                itemsCat3[keyAGestionar][5].value = array[5];
                itemsCat3[keyAGestionar][6].value = array[6];
                itemsCat3[keyAGestionar][7].value = array[7];
                itemsCat3[keyAGestionar][8].value = array[8];
                itemsCat3[keyAGestionar][9].value = array[9];
                itemsCat3[keyAGestionar][10].value = array[10];
                itemsCat3[keyAGestionar][11].value = array[11];
                if (ordre3 !== (keyAGestionar + 1)) {
                    reOrdenar();
                }
                break;
            case 3:
                itemsCat4[keyAGestionar][0].value = array[0];
                itemsCat4[keyAGestionar][1].value = array[1];
                itemsCat4[keyAGestionar][2].value = array[2];
                itemsCat4[keyAGestionar][3].value = array[3];
                itemsCat4[keyAGestionar][4].value = array[4];
                itemsCat4[keyAGestionar][5].value = array[5];
                itemsCat4[keyAGestionar][6].value = array[6];
                itemsCat4[keyAGestionar][7].value = array[7];
                itemsCat4[keyAGestionar][8].value = array[8];
                itemsCat4[keyAGestionar][9].value = array[9];
                itemsCat4[keyAGestionar][10].value = array[10];
                itemsCat4[keyAGestionar][11].value = array[11];
                if (ordre4 !== (keyAGestionar + 1)) {
                    reOrdenar();
                }
                break;
            default:
        }
    };

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
            !itemDefACrear[9] ||
            !itemDefACrear[10]
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
                'name': `nom_es`,
                'value': `${itemDefACrear[0]}`

            });
        elValue.push(
            {
                'name': `nom_ca`,
                'value': `${itemDefACrear[1]}`

            });
        elValue.push(
            {
                'name': `nom_en`,
                'value': `${itemDefACrear[2]}`

            });
        elValue.push(
            {
                'name': `nom_fr`,
                'value': `${itemDefACrear[3]}`

            });
        elValue.push(
            {
                'name': `descripcio_es`,
                'value': `${itemDefACrear[4]}`

            });
        elValue.push(
            {
                'name': `descripcio_ca`,
                'value': `${itemDefACrear[5]}`

            });
        elValue.push(
            {
                'name': `descripcio_en`,
                'value': `${itemDefACrear[6]}`

            });
        elValue.push(
            {
                'name': `descripcio_fr`,
                'value': `${itemDefACrear[7]}`

            });
        elValue.push(
            {
                'name': `imatge`,
                'value': `${itemDefACrear[8]}`

            });
        elValue.push(
            {
                'name': `preu`,
                'value': `${itemDefACrear[9]}`

            });
        elValue.push(
            {
                'name': `parada`,
                'value': `${itemDefACrear[10]}`

            });
        if (!itemDefACrear[11]) {
            elValue.push(
                {
                    'name': `visibilitat`,
                    'value': `1`

                });
        } else {
            elValue.push(
                {
                    'name': `visibilitat`,
                    'value': `${itemDefACrear[11]}`

                });
        };
        let array1;
        switch (valueTab) {
            case 0:
                array1 = [...itemsCat1];
                if (ordre1 !== keyAGestionar) {
                    array1.splice((ordre1 - 1), 0, elValue);
                } else {
                    array1.push(elValue);
                }
                setItemsCat1(array1);
                break;
            case 1:
                array1 = [...itemsCat2];
                if (ordre2 !== keyAGestionar) {
                    array1.splice((ordre2 - 1), 0, elValue);
                } else {
                    array1.push(elValue);
                }
                setItemsCat2(array1);
                break;
            case 2:
                array1 = [...itemsCat3];
                if (ordre3 !== keyAGestionar) {
                    array1.splice((ordre3 - 1), 0, elValue);
                } else {
                    array1.push(elValue);
                }
                setItemsCat3(array1);
                break;
            case 3:
                array1 = [...itemsCat4];
                if (ordre4 !== keyAGestionar) {
                    array1.splice((ordre4 - 1), 0, elValue);
                } else {
                    array1.push(elValue);
                }
                setItemsCat4(array1);
                break;
            default:
        }
        handleCloseDialog();
    };

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
    };

    return (
        <div>
            <Backdrop className={classes.loading} open={openLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {!dadesCarregadesCarta ? null : (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box
                            p={2}
                            mt={2}
                            className={classes.root1}
                        >
                            <Typography variant="h5">Carta Plats Casa Amàlia</Typography>
                            <Chip label={`Actualitzat per última vegada el: ` + laDataXMLCarta} />
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
                                        <Tab label={titolsXMLCarta[0][0].value} {...a11yProps(0)} />
                                        <Tab label={titolsXMLCarta[1][0].value} {...a11yProps(1)} />
                                        <Tab label={titolsXMLCarta[2][0].value} {...a11yProps(2)} />
                                        <Tab label={titolsXMLCarta[3][0].value} {...a11yProps(3)} />
                                    </Tabs>
                                </AppBar>
                                <TabPanel value={valueTab} index={0}>
                                    <Paper elevation={1} className={classes.casellaTitol}>
                                        <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <Chip
                                                    color="secondary"
                                                    label={
                                                        <Fragment>
                                                            <Typography
                                                                variant="body2"
                                                                component="span"
                                                                style={{ marginLeft: 20, marginRight: 10 }}
                                                            >
                                                                Títol imatge carta:
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                component="span"
                                                                style={{ marginRight: 20 }}
                                                            >
                                                                {titolsXMLCarta[0][0].value}
                                                            </Typography>
                                                        </Fragment>
                                                    } />
                                            </Box>
                                            <Box>
                                                <Button color="primary" variant="contained"
                                                    onClick={() => handleOpendialogTitols()}
                                                >
                                                    Editar
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                    {
                                        itemsCat1.length === 0 ? (
                                            <Typography variant="body1">No hi ha ítems.</Typography>
                                        ) : (
                                            itemsCat1.map((item, index) => (
                                                <Box mb={2} key={index}>
                                                    <Item prItem={item} prIndex={index} prBorrarItem={borrarItem} prHandleClickOpenDialogEdicio={handleClickOpenDialogEdicio} prEstemAPlats={estemAPlats} prEstemAVins={estemAVins} />
                                                </Box>
                                            ))
                                        )
                                    }
                                </TabPanel>
                                <TabPanel value={valueTab} index={1}>
                                    <Paper elevation={1} className={classes.casellaTitol}>
                                        <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <Chip
                                                    color="secondary"
                                                    label={
                                                        <Fragment>
                                                            <Typography
                                                                variant="body2"
                                                                component="span"
                                                                style={{ marginLeft: 20, marginRight: 10 }}
                                                            >
                                                                Títol imatge carta:
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                component="span"
                                                                style={{ marginRight: 20 }}
                                                            >
                                                                {titolsXMLCarta[1][0].value}
                                                            </Typography>
                                                        </Fragment>
                                                    } />
                                            </Box>
                                            <Box>
                                                <Button color="primary" variant="contained"
                                                    onClick={() => handleOpendialogTitols()}
                                                >
                                                    Editar
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                    {
                                        itemsCat2.length === 0 ? (
                                            <Typography variant="body1">No hi ha ítems.</Typography>
                                        ) : (
                                            itemsCat2.map((item, index) => (
                                                <Box mb={2} key={index}>
                                                    <Item prItem={item} prIndex={index} prBorrarItem={borrarItem} prHandleClickOpenDialogEdicio={handleClickOpenDialogEdicio} prEstemAPlats={estemAPlats} prEstemAVins={estemAVins} />
                                                </Box>
                                            ))
                                        )
                                    }
                                </TabPanel>
                                <TabPanel value={valueTab} index={2}>
                                    <Paper elevation={1} className={classes.casellaTitol}>
                                        <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <Chip
                                                    color="secondary"
                                                    label={
                                                        <Fragment>
                                                            <Typography
                                                                variant="body2"
                                                                component="span"
                                                                style={{ marginLeft: 20, marginRight: 10 }}
                                                            >
                                                                Títol imatge carta:
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                component="span"
                                                                style={{ marginRight: 20 }}
                                                            >
                                                                {titolsXMLCarta[2][0].value}
                                                            </Typography>
                                                        </Fragment>
                                                    } />
                                            </Box>
                                            <Box>
                                                <Button color="primary" variant="contained"
                                                    onClick={() => handleOpendialogTitols()}
                                                >
                                                    Editar
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                    {
                                        itemsCat3.length === 0 ? (
                                            <Typography variant="body1">No hi ha ítems.</Typography>
                                        ) : (
                                            itemsCat3.map((item, index) => (
                                                <Box mb={2} key={index}>
                                                    <Item prItem={item} prIndex={index} prBorrarItem={borrarItem} prHandleClickOpenDialogEdicio={handleClickOpenDialogEdicio} prEstemAPlats={estemAPlats} prEstemAVins={estemAVins} />
                                                </Box>
                                            ))
                                        )
                                    }

                                </TabPanel>
                                <TabPanel value={valueTab} index={3}>
                                    <Paper elevation={1} className={classes.casellaTitol}>
                                        <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <Chip
                                                    color="secondary"
                                                    label={
                                                        <Fragment>
                                                            <Typography
                                                                variant="body2"
                                                                component="span"
                                                                style={{ marginLeft: 20, marginRight: 10 }}
                                                            >
                                                                Títol imatge carta:
                                                            </Typography>
                                                            <Typography
                                                                variant="body1"
                                                                component="span"
                                                                style={{ marginRight: 20 }}
                                                            >
                                                                {titolsXMLCarta[3][0].value}
                                                            </Typography>
                                                        </Fragment>
                                                    } />
                                            </Box>
                                            <Box>
                                                <Button color="primary" variant="contained"
                                                    onClick={() => handleOpendialogTitols()}
                                                >
                                                    Editar
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                    {
                                        itemsCat4.length === 0 ? (
                                            <Typography variant="body1">No hi ha ítems.</Typography>
                                        ) : (
                                            itemsCat4.map((item, index) => (
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
                                            Generar carta plats
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
            {openDialogTitols ? (
                <Box style={{ marginBottom: '20px' }}>
                    <Dialog
                        open={openDialogTitols}
                        onClose={handleCloseDialogTitols}
                        fullWidth
                        maxWidth="sm"
                    >
                        <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <DialogTitle id="alert-dialog-title2">
                                Editar títol imatge carta
                            </DialogTitle>
                        </Box>
                        <DialogContent>
                            <form onSubmit={processarDadesTitol}>
                                <Box px={3} style={{ marginTop: 10 }}>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Títol [Ca]</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-titols_1"
                                            defaultValue={titolsXMLCarta[valueTab][0].value}
                                            onInput={handleChangeFormTitols('ca')}
                                        />
                                    </FormControl>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Títol [Es]</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-titols_2"
                                            defaultValue={titolsXMLCarta[valueTab][1].value}
                                            onInput={handleChangeFormTitols('es')}
                                        />
                                    </FormControl>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Títol [En]</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-titols_3"
                                            defaultValue={titolsXMLCarta[valueTab][2].value}
                                            onInput={handleChangeFormTitols('en')}
                                        />
                                    </FormControl>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Títol [Fr]</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-titols_4"
                                            defaultValue={titolsXMLCarta[valueTab][3].value}
                                            onInput={handleChangeFormTitols('fr')}
                                        />
                                    </FormControl>
                                </Box>
                                <Button
                                    fullWidth
                                    className={classes.formButton}
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    type="submit"
                                    style={{ marginBottom: 15, marginTop: 15 }}
                                >
                                    Registrar
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </Box>
            ) : null}
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
                        <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <DialogTitle id="alert-dialog-title">
                                {
                                    modeDialog === 'creacio' ? (`Crear registre`) : (`Editar registre: ` + (keyAGestionar + 1))
                                }
                            </DialogTitle>
                            <Box>
                                <Chip variant="outlined" size="small" label={visibilitatCarta ? ('Visible a la carta') : ('No Visible a la carta')} />
                                <IconButton
                                    aria-label="toggle password visibility"
                                    style={{ marginRight: '15px', marginLeft: '10px' }}
                                    onClick={handleClickVisibilitat}
                                    onMouseDown={handleMouseDownVisibilitat}
                                >
                                    {visibilitatCarta ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </Box>
                        </Box>
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
                                        <InputLabel>Nom [Ca]</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-nom-ca"
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
                                                modeDialog === 'creacio' ? (!itemDefACrear[5] ? null : (itemDefACrear[5])) : (!itemDefAEditar[5] ? (itemAEditar[5].value) : (itemDefAEditar[5]))
                                            }
                                            onInput={setRegistre}
                                        />
                                    </FormControl>
                                </TabPanel>
                                <TabPanel value={valueTab2} index={1}>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Nom [Es]</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-nom-es"
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
                                        <InputLabel>Descripció [Es]</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-des-es"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[4] ? null : (itemDefACrear[4])) : (!itemDefAEditar[4] ? (itemAEditar[4].value) : (itemDefAEditar[4]))
                                            }
                                            onInput={setRegistre}
                                        />
                                    </FormControl>
                                </TabPanel>
                                <TabPanel value={valueTab2} index={2}>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Nom [En]</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-nom-en"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[2] ? null : (itemDefACrear[2])) : (!itemDefAEditar[2] ? (itemAEditar[2].value) : (itemDefAEditar[2]))
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
                                                modeDialog === 'creacio' ? (!itemDefACrear[6] ? null : (itemDefACrear[6])) : (!itemDefAEditar[6] ? (itemAEditar[6].value) : (itemDefAEditar[6]))
                                            }
                                            onInput={setRegistre}
                                        />
                                    </FormControl>
                                </TabPanel>
                                <TabPanel value={valueTab2} index={3}>
                                    <FormControl
                                        className={classes.form}
                                    >
                                        <InputLabel>Nom [Fr]</InputLabel>
                                        <Input
                                            fullWidth
                                            className={classes.formInput}
                                            id="form-nom-fr"
                                            defaultValue=
                                            {
                                                modeDialog === 'creacio' ? (!itemDefACrear[3] ? null : (itemDefACrear[3])) : (!itemDefAEditar[3] ? (itemAEditar[3].value) : (itemDefAEditar[3]))
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
                                                modeDialog === 'creacio' ? (!itemDefACrear[7] ? null : (itemDefACrear[7])) : (!itemDefAEditar[7] ? (itemAEditar[7].value) : (itemDefAEditar[7]))
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
                                                modeDialog === 'creacio' ? null : (itemAEditar[9].value)
                                            }
                                            onInput={setRegistre}
                                        />
                                        <FormHelperText>S'ha de posar el preu inclòs el símbol d'€</FormHelperText>
                                    </FormControl>
                                    <FormControl fullWidth className={clsx(classes.margin)}>
                                        <InputLabel id="demo-simple-select-label">Parada</InputLabel>
                                        <Select
                                            id="form-par"
                                            multiple
                                            //displayEmpty
                                            value={parada}
                                            onChange={handleChangeSelect}
                                            renderValue={(selected) => selected.join(', ')}
                                        >
                                            {parades.map((laParada, index) => (
                                                <MenuItem
                                                    key={index}
                                                    value={laParada}
                                                >
                                                    {laParada}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
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
                                                            selectItemsCat1.map((option) => (
                                                                <MenuItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))
                                                        ) : valueTab === 1 ? (
                                                            selectItemsCat2.map((option) => (
                                                                <MenuItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))
                                                        ) : valueTab === 2 ? (
                                                            selectItemsCat3.map((option) => (
                                                                <MenuItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))
                                                        ) : (selectItemsCat4.map((option) => (
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
        </div >
    )
}

export default withRouter(Carta)