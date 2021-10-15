import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from "@material-ui/core";
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import IconButton from "@material-ui/core/IconButton";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { CartaContext } from '../context/CartaProvider';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { withRouter } from "react-router-dom";

const estilos = makeStyles((theme) => ({    
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

}));

//snackbar y alert
const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = (props) => {

    const classes = estilos();
    const { logged, setLogged } = useContext(CartaContext);
    useEffect(() => {
        if (logged) {
            props.history.push('/')
        }
    }, [logged,props.history]);

    //alert
    const [openSnack, setOpenSnack] = useState(false);
    const [alert, setAlert] = useState({});

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false);
    };

    //form
    const [valuesForm, setValuesForm] = useState({
        nom: '',
        password: '',
        showPassword: false,
    })
    const handleChangeForm = (prop) => (event) => {
        setValuesForm({ ...valuesForm, [prop]: event.target.value });
    }
    const handleClickShowPasswordForm = () => {
        setValuesForm({ ...valuesForm, showPassword: !valuesForm.showPassword });
    }
    const handleMouseDownPasswordForm = (event) => {
        event.preventDefault();
    }

    const processarDaDes = (e) => {
        e.preventDefault();
        if (!valuesForm.nom.trim() || !valuesForm.password.trim()) {
            setAlert({
                mensaje: "Completa el formulari correctament, falten dades.",
                tipo: 'error'
            })
            setOpenSnack(true)
            return
        };
        if ((valuesForm.nom === "admin" && valuesForm.password === "Cartaar2021@")
            || (valuesForm.nom === "sergi" && valuesForm.password === "Cartasr2021@")
            || (valuesForm.nom === "jordi" && valuesForm.password === "Cartajr2021@")
            || (valuesForm.nom === "aitor" && valuesForm.password === "Cartaar2021@")) {
            setLogged(true);
        } else {
            setAlert({
                mensaje: "Dades incorrectes. Torna a provar.",
                tipo: 'error'
            })
            setOpenSnack(true);
            setValuesForm({
                nom: '',
                password: '',
                showPassword: false,
            });
        }

    }

    return (
        <div>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={4}
                style={{ minHeight: '60vh' }}
            >
                <Grid item xs={12} md={6} lg={4}>
                    <Paper elevation={3}>
                        <Box
                            p={5}
                            mt={2}
                            textAlign="center"

                        >
                            <form onSubmit={processarDaDes}>
                                <FormControl
                                    variant="outlined"
                                    className={classes.form}
                                >
                                    <InputLabel>Usuari</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        className={classes.formInput}
                                        id="form-usuari"
                                        value={valuesForm.nom}
                                        onChange={handleChangeForm('nom')}
                                        labelWidth={50}

                                    />
                                </FormControl>
                                <FormControl
                                    variant="outlined"
                                    className={classes.form}
                                >
                                    <InputLabel>Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        className={classes.formInput}
                                        id="form-password"
                                        type={valuesForm.showPassword ? 'text' : 'password'}
                                        value={valuesForm.password}
                                        onChange={handleChangeForm('password')}
                                        labelWidth={70}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPasswordForm}
                                                    onMouseDown={handleMouseDownPasswordForm}
                                                >
                                                    {valuesForm.showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <Button
                                    fullWidth
                                    className={classes.formButton}
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    type="submit"
                                >
                                    Login
                                </Button>

                            </form>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
                <Alert severity={alert.tipo} onClose={handleCloseSnack}>
                    {alert.mensaje}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default withRouter(Login)
