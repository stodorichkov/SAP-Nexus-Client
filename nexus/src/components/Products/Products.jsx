import Product from "./Product.jsx";
import {Grid, Pagination, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import {product} from "../../api/axios.jsx";

const Products = () => {

    const [productsList, setProductsList] = useState()

    let p = [
    {category: "Rackets", name: "Tennis racket", brand: "Adidas", description: "An adidas tennis racket, perfect for tennis", price: 6, discount: 10},
    {category: "Arm bands", name: "Arm Band Pro", brand: "Nike", description: "A nike arm band", price: 1, discount: 40,},
    {category: "Arm bands", name: "Arm Band Pro", brand: "Nike", description: "A nike arm band", price: 1, discount: 50,},
    {category: "Arm bands", name: "Arm Band Pro", brand: "Nike", description: "A nike arm band", price: 1, discount: 50,},
    {category: "Arm bands", name: "Arm Band Pro", brand: "Nike", description: "A nike arm band", price: 1, discount: 50,},
    {category: "Arm bands", name: "Arm Band Pro", brand: "Nike", description: "A nike arm band", price: 1, discount: 20,},
    {category: "Balls", name: "Tennis ball", brand: "Puma", description: "A tennis ball made by puma. A tennis ball made by puma.A tennis ball made by puma.", price: 2, discount: 0},
    ]

    const getProducts = async () => {
        try {
            const response = await product.get('')
            setProductsList(response.data)
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getProducts()
    }, []);


    // TODO: change this to productsList (p is for testing only)
    const productsGrid = p.map(product => {
        return (<Grid item><Product product={product}></Product>
                </Grid>)
    })

    return(
        <>
            <Grid justifyContent="center" container spacing={3}>
                {productsGrid}
            </Grid>
            <div style={{display: "flex", justifyContent: "center"}}>
                <Stack spacing={2}>
                    <Pagination count={10} variant="outlined" shape="rounded" />
                </Stack>
            </div>
        </>
    )
}

export default Products