import {useEffect, useState} from "react";
import {Alert, Button, Divider, Grid, IconButton, InputAdornment, Paper, TextField, Typography} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import {auth} from "../../api/axios.jsx";
import {JwtConstants} from "../../constants/JwtConstats.js";
import {Visibility, VisibilityOff} from "@mui/icons-material";

const LOGIN_URL = '/token'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleChangeUsername = (event) => {
        setUsername(event.target.value);
    }
    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    }

    useEffect(() => {
        setErrorMessage("")
    }, [username, password]);

    const signIn = async (e) => {
        e.preventDefault();

        const content = {
            username: username,
            password: password
        };

        try {
            const response = await auth.post(LOGIN_URL, content);
            const token = response.headers.getAuthorization().replace(JwtConstants.BEARER, '')

            localStorage.setItem(JwtConstants.KEY, token);

            navigate(0);
        } catch (err) {
            setErrorMessage(err.response?.data);
        }
    }

    const renderAlert = () => {
        if(errorMessage) {
            return (
                <Grid item xs={12}>
                    <Alert severity="error" variant="filled">{errorMessage}</Alert>
                </Grid>
            )
        }
    }

    return (
        <form onSubmit={signIn}>
            <Grid container justifyContent='center' sx={{marginTop: '4vh'}}>
                <Grid item xs={10} sm={7.5} md={6.5} lg={4.5} xl={3.5}>
                    <Paper elevation={12} sx={{padding: '3.5rem'}}>
                        <Grid container spacing={4} justifyContent='center'>
                            <Grid item xs={12}>
                                <Typography variant="h4" color="textPrimary" align="center">Sign In</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{backgroundColor: "#000"}}/>
                            </Grid>
                            {renderAlert()}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Username"
                                    value={username}
                                    onChange={handleChangeUsername}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Password"
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={handleChangePassword}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                                                    {showPass ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item>
                                <Button type='submit' variant="contained" size="large" color="primary">
                                    Sign In
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{backgroundColor: '#000'}}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" align="center">
                                    Don't have an account? <Link to="/register">Sign Up</Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </form>
    )
}

export default Login