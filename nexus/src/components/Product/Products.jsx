import Product from "./Product.jsx";
import {
    Container,
    Grid,
    Box,
    Pagination,
    Paper,
    Stack,
    FormControlLabel,
    Checkbox,
    Divider, InputLabel, Select, FormControl, MenuItem, Snackbar, Alert
} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {campaign, product} from "../../api/axios.jsx";
import {JwtConstants} from "../../constants/JwtConstats.js";
import {useNavigate} from "react-router-dom";

const Products = () => {
    const [campaignName, setCampaignName] = useState('All');
    const [promo, setPromo] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleChangeCampaignName = (event) => {
        setCampaignName(event.target.value);
        setPage(1);
    }
    const handleChangePromo = (event) => {
        setPromo(event.target.checked);
        setPage(1);
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }
    const handleSnack = (message, severity) => {
        setMessage(message);
        setSeverity(severity);
        setOpen(true);
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const getCampaigns = useCallback(async () => {
        try {
            const response = await campaign.get('');

            setCampaigns(response.data);
        } catch(err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            } else {
                console.log(err.response?.data)
            }
        }
    }, [navigate]);

    const getProducts = useCallback(async () => {
        const params = {
            page: page-1,
            size: 9,
            campaign: campaignName === 'All' ? null : campaignName,
            promo: promo
        };

        try {
            const response = await product.get('', {
                params: params
            });

            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch(err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            } else {
                console.log(err.response?.data)
            }
        }
    }, [page, promo, campaignName, navigate]);

    useEffect(() => {
        getCampaigns().then(null);
        getProducts().then(null);
    }, [getProducts, getCampaigns]);


    const renderProducts = () => {
        return (
            <>
                {products.map((product) => (
                    // eslint-disable-next-line react/jsx-key
                    <Grid key={product.id} item>
                        <Product product={product} handleSnack={handleSnack} handle/>
                    </Grid>
                ))}
            </>
        );
    }

    const renderCampaigns = () => {
        return campaigns.map((campaign) => (
            <MenuItem key={campaign} value={campaign}>{campaign}</MenuItem>
        ));
    }

    const renderSnack  = () => {
        return (
            <Snackbar
                open={open}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
                onClose={handleClose}
                sx={{marginTop: '8rem', maxWidth: '15%'}}
            >
                <Alert severity={severity} variant="filled" onClose={handleClose}>
                    {message}
                </Alert>
            </Snackbar>
        )
    }

    return(
        <Container maxWidth='lg' sx={{marginTop: '4vh'}}>
            {renderSnack()}
            <Paper sx={{padding: '2rem'}}>
                <Stack direction="column" justifyContent="center" spacing={2}>
                    <Stack direction="row" justifyContent="center" spacing={2}>
                        <FormControl
                            sx={{minWidth: 200}}
                        >
                            <InputLabel id="select-label">Campaign</InputLabel>
                            <Select
                                value={campaignName}
                                MenuProps={{
                                    sx: { maxHeight: 200 }
                                }}
                                labelId="select-label"
                                label="Campaign"
                                onChange={handleChangeCampaignName}
                            >
                                <MenuItem key="All" value="All">All</MenuItem>
                                {renderCampaigns()}
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={promo}
                                    onChange={handleChangePromo}
                                />
                            }
                            label="Promo"
                        />
                    </Stack>
                    <Divider sx={{backgroundColor: '#000'}}/>
                    <Box sx={{height: 700, overflow: 'auto', paddingBottom: '0.1rem'}}>
                        <Grid container spacing={2} justifyContent="center">
                            {renderProducts()}
                        </Grid>
                    </Box>
                    <Stack direction="row" justifyContent="center">
                        <Pagination count={totalPages} color="primary" onChange={handleChangePage}/>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    )
}

export default Products