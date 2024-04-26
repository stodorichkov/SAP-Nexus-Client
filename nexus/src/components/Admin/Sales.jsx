import {
    Button,
    Container,
    Grid,
    InputAdornment,
    Paper,
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

const Sales = (props) => {
    const TURNOVER_URL = '/turnover';
    const dateFormat = 'YYYY-MM-DD';

    // eslint-disable-next-line react/prop-types
    const handleError = props.handleError;

    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [turnover, setTurnover] = useState(0);

    const navigate = useNavigate();

    const handleChangeStartDate = (date) => {
        setStartDate(date);
        setEndDate(date);
    };
    const handleChangeEndDate = (date) => {
        setEndDate(date);
    };

    const calculateTurnover = async () => {
        const params = {
            startDate: startDate.format(dateFormat),
            endDate: endDate.format(dateFormat)
        }

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
            handleError(err.response?.data);
        }
    }

    return (
        <Container maxWidth="md">
            <Paper>
                <Stack spacing={4} justifyContent="center" alignItems="center">
                        <Grid container spacing={4} justifyContent='center' alignItems="flex-start">
                            <Grid item>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                        label="Start date"
                                        format="DD/MM/YYYY"
                                        value={startDate}
                                        onChange={handleChangeStartDate}
                                        maxDate={dayjs()}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                        label="End date"
                                        format="DD/MM/YYYY"
                                        value={startDate}
                                        onChange={handleChangeEndDate}
                                        minDate={startDate}
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
                                value={turnover.toFixed(2)}
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