import {useCallback, useEffect, useState} from "react";
import {
    Button, Dialog,
    DialogContent,
    DialogTitle,
    Divider, FormControl,
    Grid,
    IconButton, InputAdornment, InputLabel, MenuItem, Select,
    TextField,
    Typography
} from "@mui/material";
import {Close} from "@mui/icons-material";
import {admin} from "../../../api/axios.jsx";
import {useNavigate} from "react-router-dom";
import {JwtConstants} from "../../../constants/JwtConstats.js";
import {MessageConstants} from "../../../constants/MessageConstants.js";

const ProductCampaignDialogue = (props) => {
    const PRODUCT_URL = '/product/';
    const CAMPAIGNS_URL = '/campaigns/list';
    const CAMPAIGN_ADD_URL = '/campaign/addition';
    const EDIT_DISCOUNT_URL = '/campaignDiscount';

    // eslint-disable-next-line react/prop-types
    const handleError = props.handleError;
    // eslint-disable-next-line react/prop-types
    const handleClose = props.handleClose;
    // eslint-disable-next-line react/prop-types
    const open = props.open;
    // eslint-disable-next-line react/prop-types
    const product = props.product;

    const [discount, setDiscount] = useState('');
    const [id, setId] = useState('');
    const [price, setPrice] = useState(0);
    const [minPrice, setMinPrice] = useState(0);
    const [campaign, setCampaign] = useState('');
    const [campaigns, setCampaigns] = useState([]);

    const [validDiscount, setValidDiscount] = useState('');

    const navigate = useNavigate();

    const handleChangeDiscount = (event) => {
        setDiscount(event.target.value);
    }
    const handleChangeCampaign = (event) => {
        setCampaign(event.target.value);
    }

    const getCampaigns = useCallback(async () => {
        try {
            const response = await admin.get(CAMPAIGNS_URL);
            setCampaigns(response.data);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            } else {
                handleError(err.response?.data);
            }
        }
    },[navigate, handleError]);



    useEffect(() => {
        if (product) {
            // eslint-disable-next-line react/prop-types
            setDiscount(product.campaignDiscount);
            // eslint-disable-next-line react/prop-types
            setId(product.id);
            // eslint-disable-next-line react/prop-types
            setPrice(product.price);
            // eslint-disable-next-line react/prop-types
            setMinPrice(product.minPrice);
            // eslint-disable-next-line react/prop-types
            product.campaign ? setCampaign(product.campaign) : setCampaign('')
        }

        getCampaigns().then(null);
    }, [product, getCampaigns]);

    useEffect(() => {
        parseInt(discount) >= 0 && parseInt(discount) <= 100
            ? setValidDiscount('')
            : setValidDiscount(MessageConstants.INVALID_DISCOUNT);
    }, [discount]);

    const generateUrl = () => {
        // eslint-disable-next-line react/prop-types
        return PRODUCT_URL + product.id + (product?.campaign !== null ? EDIT_DISCOUNT_URL : CAMPAIGN_ADD_URL);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(validDiscount) {
            return;
        }

        // eslint-disable-next-line react/prop-types
        const url = generateUrl();

        console.log(generateUrl())

        const content = {
            discount: discount,
            campaignName: campaign
        };

        try {
            await admin.patch(url, content);

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

    const renderCampaigns = () => {
        return campaigns.map((campaign) => (
            <MenuItem key={campaign} value={campaign}>{campaign}</MenuItem>
        ));
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
                            <Typography variant="h4" color="textPrimary" align="center">Edit product campaign</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{backgroundColor: "#000"}}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                label="Id"
                                value={id}
                            />
                        </Grid>
                        <Grid item xs={6}>
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
                                label="Price"
                                value={parseFloat(price).toFixed(2)}
                            />
                        </Grid>
                        <Grid item xs={6}>
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
                                label="Min Price"
                                value={parseFloat(minPrice).toFixed(2)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{backgroundColor: "#000"}}/>
                        </Grid>
                        {/* eslint-disable-next-line react/prop-types */}
                        {product?.campaign === null ? (
                            <Grid item xs={12}>
                                <FormControl
                                    fullWidth
                                    required
                                >
                                    <InputLabel id="select-label">Campaign</InputLabel>
                                    <Select
                                        sx={{maxHeight: 100}}
                                        value={campaign}
                                        MenuProps={{
                                            sx: { maxHeight: 200 }
                                        }}
                                        labelId="select-label"
                                        label="Campaign"
                                        onChange={handleChangeCampaign}
                                    >
                                        {renderCampaigns()}
                                    </Select>
                                </FormControl>
                            </Grid>
                        ) : null}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            %
                                        </InputAdornment>
                                    ),
                                }}
                                error={validDiscount.length !== 0}
                                helperText={validDiscount}
                                label="Discount"
                                value={discount}
                                onChange={handleChangeDiscount}
                            />
                        </Grid>
                        <Grid item>
                            <Button type='submit' variant="contained" size="large" color="primary">
                                Change
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ProductCampaignDialogue;