import {useEffect, useRef, useState} from "react";
import {Button, TextField, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {auth} from "../../api/axios.jsx";


const USER_REGEX = /^[a-zA-Z0-9-_]{3,25}$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,}$/
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
        const result = USER_REGEX.test(username)
        console.log(result)
        console.log(username)
        setValidUsername(result)
    }, [username]);

    useEffect(() => {
        const result = PASSWORD_REGEX.test(password)
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
        if (!USER_REGEX.test(username) || !PASSWORD_REGEX.test(password)) {
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