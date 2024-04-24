import {Alert, Button, Card, CardActions, CardContent, CardMedia, Snackbar, Typography} from "@mui/material";
import ProductDetailsDialog from "./ProductDetailsDialog.jsx";
import React, {useState} from "react";
import {sale} from "../../api/axios.jsx";
import {useNavigate} from "react-router-dom";

const Product = ({product}) => {

    const [openDialog, setOpenDialog] = useState(false)
    const [openSnackbar, setOpenSnackbar] = React.useState(false)
    const [messageSnackbar, setMessageSnackbar] = useState('')
    const [severitySnackbar, setSeveritySnackbar] = useState('success')

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenSnackbar = (message, severity) => {
        setMessageSnackbar(message)
        setSeveritySnackbar(severity)
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const buyProduct = async () => {
        try {
            //TODO: rerender parent component after buying a product, so the product list refereshes
            const response = await sale.post('/product/' + product.id)
            handleOpenSnackbar('Product purchased successfully', 'success')
        } catch(err) {
            handleOpenSnackbar(err.response?.data, 'error')
        }
    }

    const renderPrice = () => {
        if(product.discount === 0) {
            return (<Typography variant="h6"> {product.price} NC</Typography>)
        } else {

            return (<>
                  <Typography variant="h6" style={{textDecoration: 'line-through'}} color="text.secondary"> {product.price} NC </Typography>
                  <Typography variant="h6"> {product.price - (product.discount/100) * product.price} NC</Typography>
              </>
          )
        }
    }

    return (
        <>
            <Snackbar
                open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={severitySnackbar}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {messageSnackbar}
                </Alert>
            </Snackbar>
            <Card sx={{width: 345}}>
                <CardMedia
                    component="img"
                    alt={product.name}
                    height="140"
                    image={product.imageLink}
                />
                <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                        {product.category}
                    </Typography>
                    <Typography variant="h4">
                        {product.name}
                    </Typography>
                    <Typography variant="h6">
                        {product.brand}
                    </Typography>
                    {renderPrice()}
                </CardContent>
                <CardActions>
                    <Button size="small" variant="outlined" onClick={handleClickOpenDialog}>Details</Button>
                    <Button size="small" onClick={buyProduct}>Buy</Button>
                </CardActions>
                <ProductDetailsDialog open={openDialog} onClose={handleCloseDialog} name={product.name} description={product.description}/>
            </Card>
        </>
    )
}

export default Product