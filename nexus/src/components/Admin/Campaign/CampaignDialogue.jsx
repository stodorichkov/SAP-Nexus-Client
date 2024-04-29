import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {admin} from "../../../api/axios.jsx";
import {JwtConstants} from "../../../constants/JwtConstats.js";
import {
    Button,
    Dialog,
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

const CampaignDialogue = (props) => {
    const CAMPAIGN_URL = '/campaign';
    const dateFormat = 'YYYY-MM-DD';

    // eslint-disable-next-line react/prop-types
    const handleError = props.handleError;
    // eslint-disable-next-line react/prop-types
    const handleClose = props.handleClose;
    // eslint-disable-next-line react/prop-types
    const open = props.open
    // eslint-disable-next-line react/prop-types
    const campaign = props.campaign

    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [text, setText] = useState('');

    const navigate = useNavigate();

    const handleChangeName = (event) => {
        setName(event.target.value);
    }
    const handleChangeStartDate = (date) => {
        setStartDate(date);
        setEndDate(date);
    };
    const handleChangeEndDate = (date) => {
        setEndDate(date);
    };

    useEffect(() => {
        if (campaign) {
            // eslint-disable-next-line react/prop-types
            setName(campaign.name);
            // eslint-disable-next-line react/prop-types
            setStartDate(formatDate(campaign.startDate));
            // eslint-disable-next-line react/prop-types
            setEndDate(formatDate(campaign.endDate));
            setText('Edit');
        } else {
            setName('');
            setStartDate(formatDate(dayjs()));
            setEndDate(formatDate(dayjs()));
            setText('Add');
        }
    }, [campaign]);

    const formatDate = (date) => {
        return dayjs(date).isValid() ? dayjs(date) : dayjs();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const content = {
            name: name,
            startDate: startDate.format(dateFormat),
            endDate: endDate.format(dateFormat)
        };

        try {
            if(campaign) {
                // eslint-disable-next-line react/prop-types
                await admin.patch(CAMPAIGN_URL + '/' + campaign.id, content);
            } else {
                await admin.post(CAMPAIGN_URL, content)
            }

            handleClose();
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            } else {
                handleError(err.response?.data);
            }
        }
    }

    return (
        <Dialog
            open={open}
            maxWidth="xs"
            fullWidth={true}
        >
            <DialogTitle>
                <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <Close fontSize="large"/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4} justifyContent='center'>
                        <Grid item xs={12}>
                            <Typography variant="h4" color="textPrimary" align="center">
                                {text} campaign
                            </Typography>
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
                                onChange={handleChangeName}
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
                                {text}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CampaignDialogue;