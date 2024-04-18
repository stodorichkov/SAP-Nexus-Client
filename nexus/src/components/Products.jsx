import Product from "./Product.jsx";
import {Box, Grid} from "@mui/material";
import {useEffect} from "react";
import {product} from "../api/axios.jsx";

const Products = () => {

    let p = [
    {category: "Rackets", name: "Tennis racket", brand: "Adidas", description: "An adidas tennis racket, perfect for tennis", price: 6, discount: 10},
    {category: "Arm bands", name: "Arm Band Pro", brand: "Nike", description: "A nike arm band", price: 1, discount: 50,},
    {category: "Arm bands", name: "Arm Band Pro", brand: "Nike", description: "A nike arm band", price: 1, discount: 50,},
    {category: "Arm bands", name: "Arm Band Pro", brand: "Nike", description: "A nike arm band", price: 1, discount: 50,},
    {category: "Arm bands", name: "Arm Band Pro", brand: "Nike", description: "A nike arm band", price: 1, discount: 50,},
    {category: "Arm bands", name: "Arm Band Pro", brand: "Nike", description: "A nike arm band", price: 1, discount: 50,},
    {category: "Balls", name: "Tennis ball", brand: "Puma", description: "A tennis ball made by puma. A tennis ball made by puma.A tennis ball made by puma.", price: 2, discount: 0},
    ]

    const getProducts = async () => {
        try {
            const response = await product.get('/products')
            p = response.data
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getProducts()
    }, []);


    const products = p.map(product => {
        return (<Grid item xs={5}><Product category={product.category} name={product.name} brand={product.brand} description={product.description}
                 price={product.price - (product.discount/100) * product.price}></Product>
                </Grid>)
    })

    return(
        <div className="grid">
            <Box sx={{flexGrow: 1}} className="grid">
                <Grid container spacing={2}>
                    {products}
                </Grid>
            </Box>
        </div>
    )
}

export default Products