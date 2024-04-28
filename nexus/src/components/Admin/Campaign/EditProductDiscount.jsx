import {useEffect, useState} from "react";
import {
    Button, Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton, InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import {Close} from "@mui/icons-material";
import {admin} from "../../../api/axios.jsx";
import {useNavigate} from "react-router-dom";
import {JwtConstants} from "../../../constants/JwtConstats.js";
import {MessageConstants} from "../../../constants/MessageConstants.js";

const EditProductDiscount = (props) => {
    const EDIT_DISCOUNT_URL = '/product/';

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

    const [validDiscount, setValidDiscount] = useState('');

    const navigate = useNavigate();

    const handleChangeDiscount = (event) => {
        setDiscount(event.target.value);
    }

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
        }
    }, [product]);

    useEffect(() => {
        parseInt(discount) >= 0 && parseInt(discount) <= 100
            ? setValidDiscount('')
            : setValidDiscount(MessageConstants.INVALID_DISCOUNT);
    }, [discount]);

    const editDiscount = async (event) => {
        event.preventDefault();

        if(validDiscount) {
            return;
        }

        // eslint-disable-next-line react/prop-types
        const url = EDIT_DISCOUNT_URL + product.id + '/campaignDiscount';

        const content = {
            discount: discount,
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
                <form onSubmit={editDiscount}>
                    <Grid container spacing={4} justifyContent='center'>
                        <Grid item xs={12}>
                            <Typography variant="h4" color="textPrimary" align="center">Edit product discount</Typography>
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

export default EditProductDiscount;