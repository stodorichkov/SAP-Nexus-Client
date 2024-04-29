import {Card, CardActions, CardContent, CardMedia, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import ProductDetailsDialog from "./ProductDetailsDialog.jsx";
import {useState} from "react";
import {sale} from "../../api/axios.jsx";
import {useNavigate} from "react-router-dom";
import {JwtConstants} from "../../constants/JwtConstats.js";
import {Info, ShoppingCart} from "@mui/icons-material";

const Product = (props) => {
    // eslint-disable-next-line react/prop-types
    const product = props.product;
    // eslint-disable-next-line react/prop-types
    const handleSnack = props.handleSnack;

    const [openDialog, setOpenDialog] = useState(false);

    const navigate = useNavigate();

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const buyProduct = async () => {
        try {
            if(localStorage.getItem(JwtConstants.KEY) === null) {
                navigate('/login');
            } else {
                // eslint-disable-next-line react/prop-types
                await sale.post('/product/' + product.id);

                handleSnack('Product purchased successfully', 'success');
            }
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            } else {
                handleSnack(err.response?.data, 'error');
            }
        }
    }

    const renderPrice = () => {
        const prices = [];
        // eslint-disable-next-line react/prop-types
        if(product.discount > 0) {
            prices.push(
                <Typography key="discount" variant="subtitle1" color="text.secondary">
                    <span>Discount: </span>
                    {/* eslint-disable-next-line react/prop-types */}
                    <span style={{textDecoration: 'line-through'}}>{product.price} NC</span>
                    {/* eslint-disable-next-line react/prop-types */}
                    <span> {"-" + product.discount + "%"}</span>
                </Typography>
            );
        }

        prices.push(
            // eslint-disable-next-line react/prop-types
            <Typography key="price" variant="subtitle1">Price: {product.price - (product.discount / 100) * product.price} NC</Typography>
        )

        return prices;
    }

    return (
        <Card sx={{width: 270}} variant="outlined" >
            <CardMedia
                component="img"
                // eslint-disable-next-line react/prop-types
                alt={product.name}
                height="270"
                // eslint-disable-next-line react/prop-types
                src={product.imageLink}
            />
            <CardContent sx={{minHeight: 175}}>
                <Typography variant="h6">
                    {/* eslint-disable-next-line react/prop-types */}
                    {product.name}
                </Typography>
                <Typography variant="subtitle1">
                    {/* eslint-disable-next-line react/prop-types */}
                    Brand: {product.brand}
                </Typography>
                <Typography variant="subtitle1">
                    {/* eslint-disable-next-line react/prop-types */}
                    Category: {product.category}
                </Typography>
                {renderPrice()}
            </CardContent>
            <CardActions>
                <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{width: '100%'}}>
                    <Tooltip title="Details" key="info">
                        <IconButton onClick={handleClickOpenDialog} color="primary">
                            <Info/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Buy" key="buy">
                        <IconButton onClick={buyProduct} color="success">
                            <ShoppingCart/>
                        </IconButton>
                    </Tooltip>
                </Stack>
            </CardActions>
            {/* eslint-disable-next-line react/prop-types */}
            <ProductDetailsDialog
                open={openDialog}
                onClose={handleCloseDialog}
                // eslint-disable-next-line react/prop-types
                name={product.name}
                // eslint-disable-next-line react/prop-types
                description={product.description}
            />
        </Card>
    )
}

export default Product