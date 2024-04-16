import {useEffect, useRef, useState} from "react";
import {Button, Grid, Paper, TextField, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {auth} from "../../api/axios.jsx";
import {RegexConstants} from "../../conastants/RegexConstants.js";

const REGISTER_URL = "/register"

const Register = () => {

    const errorRef = useRef()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)

    const [firstName, setFirstName] = useState('')

    const [lastName, setLastName] = useState('')

    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)

    const [confirmPassword, setConfirmPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    const [errorMessage, setErrorMessage] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const result = RegexConstants.USER_REGEX.test(username)
        console.log(result)
        console.log(username)
        setValidUsername(result)
    }, [username]);

    useEffect(() => {
        const result = RegexConstants.PASSWORD_REGEX.test(password)
        console.log(result)
        console.log(password)
        setValidPassword(result)
        const match = password === confirmPassword
        setValidMatch(match)
    }, [password, confirmPassword]);

    useEffect(() => {
        setErrorMessage('')
    }, [username, firstName, lastName, password, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!RegexConstants.USER_REGEX.test(username) || !RegexConstants.PASSWORD_REGEX.test(password)) {
            setErrorMessage("Invalid entry")
            return
        }
        try {
            const response = await auth.post(REGISTER_URL,
                JSON.stringify({firstName, lastName, username, password, matchPassword: confirmPassword}),
                {
                    headers: {"Content-Type": 'application/json'},
                    withCredentials: true
                })
            console.log(response.data)
            setSuccess(true)
        } catch (err) {
            if (!err?.response) {
                setErrorMessage("No server response")
            } else {
                setErrorMessage('Registration failed')
            }
        }
        console.log(JSON.stringify({firstName, lastName, username, password, matchPassword: confirmPassword}))
    }
    return (
        <>
            <Grid container justifyContent='center' sx={{marginTop: '4vh'}}>
                <Grid xs={10} sm={7.5} md={6.5} lg={4.5} xl={3.7}>
                    <Paper elevation={12} sx={{padding: '3em',overflow: 'auto', maxHeight: {xl:'94vh', lg: '85vh'}}}>
                        <Grid container spacing={3.5} justifyContent="center">
                            <Grid xs={12}>
                                <Typography variant="h3" color="textPrimary" align="center" >Sign Up</Typography>
                            </Grid>
                            <Grid xs={12}>
                                <Divider sx={{backgroundColor: theme.palette.menu.main}}/>
                            </Grid>
                            {alert ? (
                                <Grid xs={12}>
                                    <Alert severity="error" variant="filled">{alert}</Alert>
                                </Grid>
                            ) : null}
                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value = {username}
                                    onChange ={handleChangeUsername}
                                />
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    fullWidth
                                    label="First name"
                                    value = {firstName}
                                    onChange ={handleChangeFirstName}
                                />
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    fullWidth
                                    label="Last name"
                                    value = {lastName}
                                    onChange ={handleChangeLastName}
                                />
                            </Grid>
                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value = {email}
                                    onChange ={handleChangeEmail}
                                />
                            </Grid>
                            <Grid xs={9}>
                                <TextField
                                    fullWidth
                                    label="Phone number"
                                    value = {phone}
                                    onChange ={handleChangePhone}
                                />
                            </Grid>
                            <Grid xs={3}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    InputProps={{
                                        inputProps: {
                                            max: 65, min: 18
                                        }
                                    }}
                                    label="Age"
                                    value = {age}
                                    onChange ={handleChangeAge}
                                />
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={handleChangePassword}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                                                    {showPass ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid xs={6}>
                                <TextField
                                    fullWidth
                                    label="Confirm password"
                                    type={showConfPass ? 'text' : 'password'}
                                    value = {confirmPassword}
                                    onChange ={handleChangeConfirmPassword}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowConfPass(!showConfPass)} edge="end">
                                                    {showConfPass ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid>
                                <Button variant="contained" size="large" color="button_secondary" onClick={addUser}>
                                    Sign Up
                                </Button>
                            </Grid>
                            <Grid xs={12}>
                                <Divider sx={{backgroundColor: theme.palette.menu.main}}/>
                            </Grid>
                            <Grid xs={12}>
                                <Typography variant="body2" align="center">
                                    Already have an account? <Link onClick={() => navigate('/signin')}>Sign In</Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Typography varinat="body3" className={errorMessage ? "visible" : "hidden"}>{errorMessage}</Typography>
            <Typography variant="h1">Register</Typography>
            <form onSubmit={handleSubmit()}>
                <TextField
                    type="text"
                    autoComplete="off"
                    onChange={e => setUsername(e.target.value)}
                    value={username}
                    required
                    label="Username"
                />

                <Typography variant="body2" className={username && !validUsername ? "visible" : "hidden"}>
                    Username must be between 3 and 25 characters long and contain only letters, numbers, hyphens or
                    underscores!
                </Typography>

                <br/>

                <TextField
                    type="text"
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    label="First name"
                    autoComplete="off"
                    value={firstName}
                />

                <TextField
                    type="text"
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    label="Last name"
                    autoComplete="off"
                    value={lastName}
                />

                <br/>

                <TextField
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    label="Password"
                />
                <Typography variant="body2" className={password && !validPassword ? "visible" : "hidden"}>
                    Password must be between 8 and 24 characters.
                    Must include uppercase and lowercase letters, a number and a special character (!@#$%).
                </Typography>

                <br/>

                <TextField
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <Typography variant="body2" className={!validMatch ? "visible" : "hidden"}>
                    Passwords must match.
                </Typography>

                <Button variant="contained" type="submit" disabled={!validUsername || !validPassword || !validMatch}>
                    Sign up
                </Button>
            </form>

            <Typography variant="body3">
                Already registered?
            </Typography>
            <Link to="/login">Sign in</Link>
        </>
    )
}

export default Register