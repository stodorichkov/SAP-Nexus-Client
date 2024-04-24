import Product from "./Product.jsx";
import {Button, Grid, List, ListItem, Pagination, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import {product} from "../../api/axios.jsx";

const Products = () => {

    const [campaingsList, setCampaignsList] = useState()
    const [campaignOnShow, setCampaignOnShow] = useState()
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

    let c = [
        {name: 'Spring sale'},
        {name: 'Black friday'},
        {name: 'Easter sale'}

    ]

    const getCampaigns = async () => {
        try {
            //TODO: change url to get only active campaigns
            const response = await product.get('campaign')
            setCampaignsList(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const getProducts = async (campaignName) => {
        try {
            const response = await product.get('' + campaignName)
            setProductsList(response.data)
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getCampaigns().then(null)
        getProducts('').then(null)
    }, []);

    const handleCampaignChange = (campaignName) => {
        setCampaignOnShow(campaignName)
    }

    const campaignsList = c.map(campaign => {
        return (<ListItem style={{display: "inline"}}>
                    <Button variant="contained" onClick={() => getProducts('/campaign/' + campaign.name)}>
                        {campaign.name}
                    </Button>
            </ListItem>)
    })

    // TODO: change this to productsList (p is for testing only)
    const productsGrid = p.map(product => {
        return (<Grid item><Product product={product}></Product>
                </Grid>)
    })

    return(
        <>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <ListItem><Button onClick={() => getProducts('')}>All products</Button></ListItem>
                {campaignsList}
            </List>
            <Grid justifyContent="center" container spacing={3}>
                {productsGrid}
            </Grid>
            {/*TODO: add pagination functionality*/}
            <div style={{display: "flex", justifyContent: "center"}}>
                <Stack spacing={2}>
                    <Pagination count={10} variant="outlined" shape="rounded" />
                </Stack>
            </div>
        </>
    )
}

export default Products