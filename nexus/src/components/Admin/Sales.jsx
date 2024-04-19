import {
    Alert,
    Button,
    Container,
    Grid,
    InputAdornment,
    Paper, Snackbar,
    Stack,
    TextField,
} from "@mui/material";
import { MobileDatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {useState} from "react";
import dayjs from 'dayjs';
import {admin} from "../../api/axios.jsx";
import {JwtConstants} from "../../constants/JwtConstats.js";
import {useNavigate} from "react-router-dom";

const Sales = () => {
    const TURNOVER_URL = '/turnover';

    const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [turnover, setTurnover] = useState(0);

    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleStartDateChange = (date) => {
        setStartDate(date.format("YYYY-MM-DD"));
        setEndDate(date.format("YYYY-MM-DD"));
    };
    const handleEndDateChange = (date) => {
        setEndDate(date.format("YYYY-MM-DD"));
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const calculateTurnover = async () => {
        const params = {
            startDate: startDate,
            endDate: endDate
        }

        console.log(params)

        try {
            const response = await admin.get(TURNOVER_URL, {
                params: params
            });

            setTurnover(response.data);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            }

            setTurnover(0);
            setErrorMessage(err.response?.data);
            setOpen(true);
        }
    }

    const renderAlert  = () => {
        return (
            <Snackbar
                open={open}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
                onClose={handleClose}
                sx={{marginTop: '8rem', maxWidth: '20%'}}
            >
                <Alert severity="error" variant="filled" onClose={handleClose}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        )
    }

    return (
        <Container maxWidth="md">
            {renderAlert()}
            <Paper>
                <Stack spacing={4} justifyContent="center" alignItems="center">
                        <Grid container spacing={4} justifyContent='center' alignItems="flex-start">
                            <Grid item>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                        label="Start date"
                                        format="DD/MM/YYYY"
                                        value={dayjs(startDate)}
                                        onChange={handleStartDateChange}
                                        maxDate={dayjs()}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                        label="End date"
                                        format="DD/MM/YYYY"
                                        value={dayjs(endDate)}
                                        onChange={handleEndDateChange}
                                        minDate={dayjs(startDate)}
                                        maxDate={dayjs()}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" size="large" color="primary" onClick={calculateTurnover}>
                                    Calculate
                                </Button>
                            </Grid>
                        </Grid>
                    <Grid container justifyContent='center'>
                        <Grid item xs={5}>
                            <TextField
                                fullWidth
                                label="Turnover"
                                value={parseFloat(turnover).toFixed(2)}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            NC
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
        </Container>
    )
}

export default Sales;