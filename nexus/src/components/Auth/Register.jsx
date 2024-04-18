import {useEffect, useState} from "react";
import {Alert, Button, Divider, Grid, IconButton, InputAdornment, Paper, TextField, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {auth} from "../../api/axios.jsx";
import {RegexConstants} from "../../constants/RegexConstants.js";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {MessageConstants} from "../../constants/MessageConstants.js";

const Register = () => {
    const REGISTER_URL = "/registration"

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfPass, setShowConfPass] = useState(false);

    const [validUsername, setValidUsername] = useState('');
    const [validFirstName, setValidFirstName] = useState('');
    const [validLastName, setValidLastName] = useState('');
    const [validPassword, setValidPassword] = useState('');
    const [validMatch, setValidMatch] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const navigate = useNavigate();

    const handleChangeUsername = (event) => {
        setUsername(event.target.value);
    }
    const handleChangeFirstName = (event) => {
        setFirstName(event.target.value);
    }
    const handleChangeLastName = (event) => {
        setLastName(event.target.value);
    }
    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    }
    const handleChangeConfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
    }

    useEffect(() => {
        const result = RegexConstants.USERNAME_REGEX.test(username);
        result || username.length === 0 ? setValidUsername('') : setValidUsername(MessageConstants.INVALID_USERNAME);
    }, [username]);

    useEffect(() => {
        const result = RegexConstants.NAME_REGEX.test(firstName);
        result || firstName.length === 0 ? setValidFirstName('') : setValidFirstName(MessageConstants.INVALID_NAME);
    }, [firstName]);

    useEffect(() => {
        const result = RegexConstants.NAME_REGEX.test(lastName);
        result || lastName.length === 0 ? setValidLastName('') : setValidLastName(MessageConstants.INVALID_NAME);
    }, [lastName]);

    useEffect(() => {
        const result = RegexConstants.PASSWORD_REGEX.test(password)
        result || password.length === 0 ? setValidPassword('') : setValidPassword(MessageConstants.INVALID_PASSWORD);

        const match = password === confirmPassword
        match || confirmPassword.length === 0 ? setValidMatch('') : setValidMatch(MessageConstants.PASSWORD_MISMATCH);
    }, [password, confirmPassword]);

    useEffect(() => {
        setErrorMessage('');
    }, [username, firstName, lastName, password, confirmPassword]);

    const signUp = async (e) => {
        e.preventDefault()

        if(validUsername || validFirstName || validLastName || validPassword || validMatch) {
            return;
        }

        const content = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            password: password,
            confirmPassword: confirmPassword
        };

        try {
            await auth.post(REGISTER_URL, content);
            navigate('/login');
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
        <form onSubmit={signUp}>
            <Grid container justifyContent='center' sx={{marginTop: '4vh'}}>
                <Grid item xs={10} sm={7.5} md={6.5} lg={4.5} xl={3.5}>
                    <Paper elevation={12} sx={{padding: '3em', overflow: 'auto', maxHeight: {xl: '94vh', lg: '85vh'}}}>
                        <Grid container spacing={2.5} justifyContent="center">
                            <Grid item xs={12}>
                                <Typography variant="h4" color="textPrimary" align="center">Sign Up</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{backgroundColor: '#000'}}/>
                            </Grid>
                            {renderAlert()}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    error={validUsername.length !== 0}
                                    helperText={validUsername}
                                    label="Username"
                                    value={username}
                                    onChange={handleChangeUsername}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    error={validFirstName.length !== 0}
                                    helperText={validFirstName}
                                    label="First name"
                                    value={firstName}
                                    onChange={handleChangeFirstName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    error={validLastName.length !== 0}
                                    helperText={validLastName}
                                    label="Last name"
                                    value={lastName}
                                    onChange={handleChangeLastName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    error={validPassword.length !== 0}
                                    helperText={validPassword}
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
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    error={validMatch.length !== 0}
                                    helperText={validMatch}
                                    label="Confirm password"
                                    type={showConfPass ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={handleChangeConfirmPassword}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowConfPass(!showConfPass)} edge="end">
                                                    {showConfPass ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item>
                                <Button type="submit" variant="contained" size="large" color="secondary">
                                    Sign Up
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{backgroundColor: '#000'}}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" align="center">
                                    Already have an account? <Link to="/login">Sign In</Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </form>
    )
}

export default Register