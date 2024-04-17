import {profile} from "../../api/axios.jsx";
import {JwtConstants} from "../../conastants/JwtConstats.js";
import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Alert,
    Button,
    Divider,
    Grid,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {MessageConstants} from "../../conastants/MessageConstants.js";

const TRANSFER_URL = "/money"


const Profile = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [balance, setBalance] = useState(0);
    const [transfer, setTransfer] = useState(0);

    const [transferMode, setTransferMode] = useState(false);
    const [validTransfer, setValidTransfer] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();


    const handleChangeTransfer = (event) => {
        setTransfer(event.target.value);
    }
    const handleChangeTransferMode = () => {
        setTransferMode(!transferMode);
    }


    const getProfile = useCallback(async () => {
        try {
            const response = await profile.get('');
            setUsername(response.data.username);
            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
            setBalance(response.data.balance);
        } catch (err) {
            if(err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            }
            console.log(err)
        }
    }, []);

    useEffect(() => {
        getProfile();
    }, [getProfile]);

    useEffect(() => {
        !isNaN(transfer) && parseFloat(transfer) >= 0
            ? setValidTransfer('')
            : setValidTransfer(MessageConstants.INVALID_TRANSFER);
    }, [transfer]);

    useEffect(() => {
        setTransfer(0);
    }, [transferMode]);

    const transferMoney = async () => {
        if(validTransfer) {
            return;
        }

        const content = {
            money: transfer
        }
        try {
             await profile.patch(TRANSFER_URL, content);
             setBalance(parseFloat(balance) + parseFloat(transfer));
             handleChangeTransferMode();
        } catch (err) {
            if(err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            }

            setErrorMessage(err.response?.data);
        }
    }

    const renderTransfer = () => {
        if(transferMode) {
            return (
                    <>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            NC
                                        </InputAdornment>
                                    ),
                                }}
                                error={validTransfer.length !== 0}
                                helperText={validTransfer}
                                label="Transfer"
                                value={transfer}
                                onChange={handleChangeTransfer}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" justifyContent="center" spacing={3}>
                                <Button variant="contained" size="large" color="success" onClick={transferMoney}>
                                    Transfer
                                </Button>
                                <Button variant="contained" size="large" color="error" onClick={handleChangeTransferMode}>
                                    Cancel
                                </Button>
                            </Stack>
                        </Grid>
                    </>
            )
        }

        return (
            <Grid item>
                <Button variant="contained" size="large" color="primary" onClick={handleChangeTransferMode}>
                    Transfer
                </Button>
            </Grid>
        )
    }

    return (
        <Grid container justifyContent='center' sx={{marginTop: '4vh'}}>
            <Grid item xs={10} sm={7.5} md={6.5} lg={4.5} xl={3.5}>
                <Paper elevation={12} sx={{padding: '3em', overflow: 'auto', maxHeight: {xl: '94vh', lg: '85vh'}}}>
                    <Grid container spacing={2.5} justifyContent="center">
                        <Grid item xs={12}>
                            <Typography variant="h4" color="textPrimary" align="center">Profile</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{backgroundColor: '#000'}}/>
                        </Grid>
                        {errorMessage ? (
                            <Grid item xs={12}>
                                <Alert severity="error" variant="filled">{errorMessage}</Alert>
                            </Grid>
                        ) : null}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                label="Username"
                                value={username}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                label="First name"
                                value={firstName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                label="Last name"
                                value={lastName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            NC
                                        </InputAdornment>
                                    ),
                                }}
                                label="Balance"
                                value={parseFloat(balance).toFixed(2)}
                            />
                        </Grid>
                        {renderTransfer()}
                        {/*<Grid item xs={12}>*/}
                        {/*    <TextField*/}
                        {/*        fullWidth*/}
                        {/*        required*/}
                        {/*        error={validPassword.length !== 0}*/}
                        {/*        helperText={validPassword}*/}
                        {/*        label="Password"*/}
                        {/*        type={showPass ? 'text' : 'password'}*/}
                        {/*        value={password}*/}
                        {/*        onChange={handleChangePassword}*/}
                        {/*        InputProps={{*/}
                        {/*            endAdornment: (*/}
                        {/*                <InputAdornment position="end">*/}
                        {/*                    <IconButton onClick={() => setShowPass(!showPass)} edge="end">*/}
                        {/*                        {showPass ? <VisibilityOff/> : <Visibility/>}*/}
                        {/*                    </IconButton>*/}
                        {/*                </InputAdornment>*/}
                        {/*            ),*/}
                        {/*        }}*/}
                        {/*        variant="outlined"*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                        {/*<Grid item xs={12}>*/}
                        {/*    <TextField*/}
                        {/*        fullWidth*/}
                        {/*        required*/}
                        {/*        error={validMatch.length !== 0}*/}
                        {/*        helperText={validMatch}*/}
                        {/*        label="Confirm password"*/}
                        {/*        type={showConfPass ? 'text' : 'password'}*/}
                        {/*        value={confirmPassword}*/}
                        {/*        onChange={handleChangeConfirmPassword}*/}
                        {/*        InputProps={{*/}
                        {/*            endAdornment: (*/}
                        {/*                <InputAdornment position="end">*/}
                        {/*                    <IconButton onClick={() => setShowConfPass(!showConfPass)} edge="end">*/}
                        {/*                        {showConfPass ? <VisibilityOff/> : <Visibility/>}*/}
                        {/*                    </IconButton>*/}
                        {/*                </InputAdornment>*/}
                        {/*            ),*/}
                        {/*        }}*/}
                        {/*        variant="outlined"*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                        {/*<Grid item>*/}
                        {/*    <Button type="submit" variant="contained" size="large" color="secondary">*/}
                        {/*        Sign Up*/}
                        {/*    </Button>*/}
                        {/*</Grid>*/}
                        {/*<Grid item xs={12}>*/}
                        {/*    <Divider sx={{backgroundColor: '#000'}}/>*/}
                        {/*</Grid>*/}
                        {/*<Grid item xs={12}>*/}
                        {/*    <Typography variant="body2" align="center">*/}
                        {/*        Already have an account? <Link to="/login">Sign In</Link>*/}
                        {/*    </Typography>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Profile;