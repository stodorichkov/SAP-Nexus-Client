import {Box, Button, Card, CardActions, CardContent, Typography} from "@mui/material";

const Product = ({category, name, brand, description, price, imageLink}) => {

    const buyProduct = () => {
        //TODO
    }
    return (
            <Card>
                <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                        {category}
                    </Typography>
                    <img src={imageLink} alt={name}/>
                    <Typography variant="h3">
                        {name}
                    </Typography>
                    <Typography variant="h5">
                        {brand}
                    </Typography>
                    <Typography variant="h6">
                        {price}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={buyProduct}>Buy</Button>
                </CardActions>
            </Card>
    )
}

export default Product