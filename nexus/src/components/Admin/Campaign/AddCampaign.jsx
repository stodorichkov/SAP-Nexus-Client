import {useState} from "react";
import dayjs from "dayjs";
import {
    Button,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import {Close} from "@mui/icons-material";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {admin} from "../../../api/axios.jsx";
import {useNavigate} from "react-router-dom";
import {JwtConstants} from "../../../constants/JwtConstats.js";

const AddCampaign = (props) => {
    const ADD_URL = '/campaign';
    const dateFormat = 'YYYY-MM-DD';

    // eslint-disable-next-line react/prop-types
    const handleError = props.handleError;
    // eslint-disable-next-line react/prop-types
    const handleClose = props.handleClose;

    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());

    const navigate = useNavigate();

    const handleChangeUsername = (event) => {
        setName(event.target.value);
    }
    const handleChangeStartDate = (date) => {
        setStartDate(date);
        setEndDate(date);
    };
    const handleChangeEndDate = (date) => {
        setEndDate(date);
    };

    const addCampaign = async (event) => {
        event.preventDefault();

        const content = {
            name: name,
            startDate: startDate.format(dateFormat),
            endDate: endDate.format(dateFormat)
        };

        try {
            await admin.post(ADD_URL, content);

            handleClose();
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            }

            handleError(err.response?.data);
        }
    }

    return (
        <>
            <DialogTitle>
                <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <Close fontSize="large"/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={addCampaign}>
                    <Grid container spacing={4} justifyContent='center'>
                        <Grid item xs={12}>
                            <Typography variant="h4" color="textPrimary" align="center">Add campaign</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{backgroundColor: "#000"}}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Name"
                                value={name}
                                onChange={handleChangeUsername}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDatePicker
                                    label="Start date"
                                    format="DD/MM/YYYY"
                                    sx={{width: "100%"}}
                                    value={startDate}
                                    onChange={handleChangeStartDate}
                                    minDate={dayjs()}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDatePicker
                                    label="End date"
                                    format="DD/MM/YYYY"
                                    sx={{width: "100%"}}
                                    value={startDate}
                                    onChange={handleChangeEndDate}
                                    minDate={startDate}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item>
                            <Button type='submit' variant="contained" size="large" color="primary">
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </>
    );
}

export default AddCampaign;