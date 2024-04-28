import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {admin} from "../../../api/axios.jsx";
import {JwtConstants} from "../../../constants/JwtConstats.js";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider, FormControl,
    Grid,
    IconButton, InputAdornment, InputLabel, MenuItem, Select,
    TextField,
    Typography
} from "@mui/material";
import {Close, Upload} from "@mui/icons-material";
import {RegexConstants} from "../../../constants/RegexConstants.js";
import {MessageConstants} from "../../../constants/MessageConstants.js";

const ProductDialogue = (props) => {
    const PRODUCT_URL = '/product';
    const CATEGORY_URL = '/categories';

    // eslint-disable-next-line react/prop-types
    const handleError = props.handleError;
    // eslint-disable-next-line react/prop-types
    const handleClose = props.handleClose;
    // eslint-disable-next-line react/prop-types
    const open = props.open
    // eslint-disable-next-line react/prop-types
    const product = props.product

    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [minPrice, setMinPrice] = useState(0);
    const [availability, setAvailability] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');
    const [categories, setCategories] = useState([]);

    const [validName, setValidName] = useState('');
    const [validBrand, setValidBrand] = useState('');
    const [validPrice, setValidPrice] = useState('');
    const [validMinPrice, setValidMinPrice] = useState('');
    const [validDiscount, setValidDiscount] = useState('');
    const [validAvailability, setValidAvailability] = useState('');

    const navigate = useNavigate();

    const handleChangeName = (event) => {
        setName(event.target.value);
    }
    const handleChangeBrand = (event) => {
        setBrand(event.target.value);
    }
    const handleChangeCategory = (event) => {
        setCategory(event.target.value);
    }
    const handleChangeDescription = (event) => {
        setDescription(event.target.value);
    }
    const handleChangePrice = (event) => {
        setPrice(event.target.value);
    }
    const handleChangeMinPrice = (event) => {
        setMinPrice(event.target.value);
    }
    const handleChangeDiscount = (event) => {
        setDiscount(event.target.value);
    }
    const handleChangeAvailability = (event) => {
        setAvailability(event.target.value);
    }
    const handleChangeImage = (event) => {
        setImage(event.target.files[0]);
    }

    const getCategories = useCallback(async () => {
        try {
            const response = await admin.get(CATEGORY_URL);

            setCategories(response.data);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            } else {
                handleError(err.response?.data);
            }
        }
    }, [navigate, handleError]);

    useEffect(() => {
        getCategories().then(null);
    }, [getCategories, product]);

    useEffect(() => {
        if (product) {
            // eslint-disable-next-line react/prop-types
            setName(product.name);
            // eslint-disable-next-line react/prop-types
            setBrand(product.brand);
            // eslint-disable-next-line react/prop-types
            setCategory(product.category);
            // eslint-disable-next-line react/prop-types
            setDescription(product.description);
            // eslint-disable-next-line react/prop-types
            setPrice(product.price);
            // eslint-disable-next-line react/prop-types
            setMinPrice(product.minPrice);
            // eslint-disable-next-line react/prop-types
            setAvailability(product.availability);
            // eslint-disable-next-line react/prop-types
            setDiscount(product.discount);
            setImage(null);
            setText('Edit');
        } else {
            setName('');
            setBrand('');
            setCategory('');
            setDescription('');
            setPrice(0);
            setMinPrice(0);
            setAvailability(0);
            setDiscount(0);
            setImage(null);
            setText('Add');
        }
    }, [product]);

    useEffect(() => {
        const result = RegexConstants.PRODUCT_NAME_REGEX.test(name);
        result || name.length === 0 ? setValidName('') : setValidName(MessageConstants.INVALID_PRODUCT_NAME);
    }, [name]);

    useEffect(() => {
        const result = RegexConstants.PRODUCT_BRAND_REGEX.test(brand);
        result || brand.length === 0 ? setValidBrand('') : setValidBrand(MessageConstants.INVALID_PRODUCT_BRAND);
    }, [brand]);

    useEffect(() => {
        if(parseFloat(minPrice) >= 0) {
            setValidMinPrice('');
            setPrice(minPrice);
        } else {
            setValidMinPrice(MessageConstants.INVALID_MIN_PRICE);
        }
    }, [minPrice]);

    useEffect(() => {
        if(parseFloat(price) >= minPrice) {
            setValidPrice('');
        } else {
            setValidPrice(MessageConstants.INVALID_PRICE);
        }
    }, [price, minPrice]);

    useEffect(() => {
        parseInt(discount) >= 0 && parseInt(discount) <= 100
            ? setValidDiscount('')
            : setValidDiscount(MessageConstants.INVALID_DISCOUNT);
    }, [discount]);

    useEffect(() => {
        parseInt(availability) >= 0
            ? setValidAvailability('')
            : setValidAvailability(MessageConstants.INVALID_AVAILABILITY);
    }, [availability]);


    const handleSubmit = async (event) => {
        event.preventDefault();

        if(
            validName
            || validBrand
            || validMinPrice
            || validPrice
            || validDiscount
            || validAvailability
            || image === null
        ) {
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('brand', brand);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('minPrice', minPrice);
        formData.append('availability', availability);
        formData.append('discount', discount);
        formData.append('image', image);

        try {
            if(product) {
                // eslint-disable-next-line react/prop-types
                await admin.patch(PRODUCT_URL + '/' + product.id, formData);
            } else {
                await admin.post(PRODUCT_URL, formData)
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

    const renderCategories = () => {
        return categories.map((category) => (
            <MenuItem key={category} value={category}>{category}</MenuItem>
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
                    <Grid container spacing={3} justifyContent='center'>
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
                                error={validName.length !== 0}
                                helperText={validName}
                                label="Name"
                                value={name}
                                onChange={handleChangeName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                error={validBrand.length !== 0}
                                helperText={validBrand}
                                label="Brand"
                                value={brand}
                                onChange={handleChangeBrand}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel id="select-label">Category</InputLabel>
                                <Select
                                    value={category}
                                    labelId="select-label"
                                    label="Category"
                                    onChange={handleChangeCategory}
                                >
                                    {renderCategories()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={description}
                                onChange={handleChangeDescription}
                                multiline
                                rows={3}
                                inputProps={{ maxLength: 250 }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            NC
                                        </InputAdornment>
                                    ),
                                }}
                                required
                                error={validMinPrice.length !== 0}
                                helperText={validMinPrice}
                                label="Min Price"
                                value={minPrice}
                                onChange={handleChangeMinPrice}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            NC
                                        </InputAdornment>
                                    ),
                                }}
                                required
                                disabled={validMinPrice.length !== 0}
                                error={validPrice.length !== 0}
                                helperText={validPrice}
                                label="Price"
                                value={price}
                                onChange={handleChangePrice}
                            />
                        </Grid>
                        {product ? (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                %
                                            </InputAdornment>
                                        ),
                                    }}
                                    required
                                    error={validDiscount.length !== 0}
                                    helperText={validDiscount}
                                    label="Discount"
                                    value={discount}
                                    onChange={handleChangeDiscount}
                                />
                            </Grid>
                        ) : null}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                error={validAvailability.length !== 0}
                                helperText={validAvailability}
                                label="Availability"
                                value={availability}
                                onChange={handleChangeAvailability}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                sx={{width: '100%'}}
                                component="label"
                                startIcon={<Upload/>}
                            >
                                {image ? image.name :  "Upload files"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangeImage}
                                    hidden
                                />
                            </Button>
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

export default ProductDialogue;