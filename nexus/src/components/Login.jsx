import {useContext, useEffect, useState} from "react";
import {Button, TextField, Typography} from "@mui/material";
import AuthContext from "../context/AuthProvider.jsx";
import api from "../api/axios.jsx";

const LOGIN_URL = '/login'

const Login = () => {

    const {setAuth} = useContext(AuthContext)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        setErrorMessage("")
    }, [username, password]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post(LOGIN_URL,
                JSON.stringify({username, password}),
                {
                    headers: {"Content-Type": 'application/json'},
                    withCredentials: true
                })
            console.log(JSON.stringify(response?.data))
            const roles = response?.data?.roles
            setAuth({username, password, roles})
            setUsername('')
            setPassword('')
            setSuccess(true)
        } catch(err) {
            if(!err?.response)
                setErrorMessage('No server response')
            else if (err.response?.status === 400)
                setErrorMessage('Missing username or password')
            else if (err.response?.status === 401)
                setErrorMessage('Unauthorized')
            else
                setErrorMessage('Login failed')
        }



    }

    return (
        <>
            <Typography variant="body3" className={errorMessage ? "visible" : "hidden"}>{errorMessage}</Typography>
            <Typography varinat="h1">Sign in</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    type="text"
                    label="Username"
                    onChange={e => setUsername(e.target.value)}
                    required
                    value={username}
                />
                <TextField
                    type="password"
                    label="Password"
                    onChange={e => setPassword(e.target.value)}
                    required
                    value={password}
                />
                <Button type="submit">Sign in</Button>
                <Typography variant="body3">
                    Don't have an account?
                </Typography>
                <span>
                {/*put router link here*/}
                    <a href="#">Sign up</a>
                </span>
            </form>
        </>
    )
}

export default Login