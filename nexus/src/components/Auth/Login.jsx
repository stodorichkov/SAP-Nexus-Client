import {useEffect, useState} from "react";
import {Button, TextField, Typography} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import {auth} from "../../api/axios.jsx";

const LOGIN_URL = '/token'

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        setErrorMessage("")
    }, [username, password]);

    const signIn = async () => {
        const content = {
            username: username,
            password: password
        };

        try {
            const response = await auth.post(LOGIN_URL, content);
            localStorage.setItem('token', response.data);
            navigate('/');
        } catch (err) {
            setErrorMessage(err.response?.data);
        }
    }

    return (
        <>
            <form onSubmit={signIn()}>
            <Typography variant="body3" className={errorMessage ? "visible" : "hidden"}>{errorMessage}</Typography>
            <Typography varinat="h1">Sign in</Typography>
            <TextField
                type="text"
                label="Username"
                name="username"
                onChange={e => setUsername(e.target.value)}
                required
                value={username}
            />
            <TextField
                type="password"
                label="Password"
                name="password"
                onChange={e => setPassword(e.target.value)}
                required
                value={password}
            />
            <Button type="submit">Sign in</Button>
            <Typography variant="body3">
                Don't have an account?
            </Typography>
            <Link to="/register">Sign up</Link>
            </form>
        </>
    )
}

export default Login