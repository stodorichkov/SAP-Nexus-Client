import {useCallback, useEffect, useState} from "react";
import {admin} from "../../../api/axios.jsx";
import {JwtConstants} from "../../../constants/JwtConstats.js";
import {useNavigate} from "react-router-dom";
import {
    Button,
    Container, Fab, IconButton,
    Paper,
    Stack,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, Tooltip,
} from "@mui/material";
import {Add, Campaign, Delete, Edit, OpenInNew} from "@mui/icons-material";
import ProductDialogue from "./ProductDilogue.jsx";
import ProductCampaignDialogue from "./ProductCampaignDialogue.jsx";
import {MessageConstants} from "../../../constants/MessageConstants.js";

const Products = (props) => {
    const PRODUCT_URL = '/product';

    // eslint-disable-next-line react/prop-types
    const handleError = props.handleError;

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [product, setProduct] = useState(null);
    const [dialogue, setDialogue] = useState(false);
    const [editCampaign, setEditCampaign] = useState(false);
    const [deleteFlag, setDeleteFlag] = useState(false);

    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }
    const handleChangePageSize = (event) => {
        setPageSize(+event.target.value);
        setPage(0);
    }
    const handleOpenDialogue = (product) => {
        setDialogue(true);
        setProduct(product);
    }
    const handleCloseDialogue = () => {
        setProduct(null);
        setDialogue(false);
    }
    const handleOpenEditCampaign = (product) => {
        setProduct(product);
        setEditCampaign(true);
    }
    const handleCloseEditCampaign = () => {
        setProduct(null);
        setEditCampaign(false);
    }
    const handleOpenImage = (image) => {
        image !== null ? window.open(image, '_blank') : handleError(MessageConstants.INVALID_IMAGE);
    }

    const getProducts= useCallback(async () => {
        const params = {
            page: page,
            size: pageSize,
        };

        try {
            const response = await admin.get(PRODUCT_URL, {
                params: params
            });

            setProducts(response.data.content);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            } else {
                handleError(err.response?.data);
            }
        }
    }, [page, pageSize, handleError, navigate]);

    useEffect(() => {
        getProducts().then(null);
    }, [getProducts, dialogue, editCampaign, deleteFlag]);

    const formatDescription = (description) => {
        if(description.length >= 100) {
            return description?.slice(0, 100) + '...';
        }
        if(description.length === 0) {
            return '-'
        }

        return description;
    }

    const removeProduct = async (product) => {
        try {
            await admin.delete(PRODUCT_URL + '/' + product.id);

            setDeleteFlag(!deleteFlag);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            } else {
                handleError(err.response?.data);
            }
        }
    }

    const renderButtons = (product) => {
        const buttons = [];

        if(product?.campaign === null) {
            buttons.push(
                <Tooltip title="Pproduct campaign" key="editCampaign">
                    <IconButton onClick={() => handleOpenEditCampaign(product)}>
                        <Campaign color="secondary"/>
                    </IconButton>
                </Tooltip>,
            );
        }

        buttons.push(
            <Tooltip title="Edit product" key="edit">
                <IconButton onClick={() => handleOpenDialogue(product)}>
                    <Edit/>
                </IconButton>
            </Tooltip>,
            <Tooltip title="Remove product" key="remove">
                <IconButton color="error" onClick={() => removeProduct(product)}>
                    <Delete/>
                </IconButton>
            </Tooltip>
        );

        return(
            <Stack
                direction="row"
                spacing={1}
            >
                {buttons}
            </Stack>
        );

    }

    const renderProducts = () => {
        return (
            <>
                {products.map((product) => (
                    <TableRow
                        key={product.id}
                    >
                        <TableCell sx={{fontWeight: "bold"}}>
                            <Tooltip title="See product image" key="image">
                                <Button
                                    sx={{textTransform: "none", color: "black", fontWeight: "bold"}}
                                    endIcon={<OpenInNew/>}
                                    onClick={() => handleOpenImage(product.imageLink)}
                                >
                                    {product.id}
                                </Button>
                            </Tooltip>
                        </TableCell>
                        <TableCell sx={{minWidth: 200}}>
                            {product.name}
                        </TableCell>
                        <TableCell sx={{minWidth: 200}}>
                            {product.brand}
                        </TableCell>
                        <TableCell sx={{minWidth: 200}}>
                            {product.category}
                        </TableCell>
                        <TableCell sx={{minWidth: 200}}>
                            {product.campaign ? product.campaign : '-'}
                        </TableCell>
                        <TableCell sx={{minWidth: 360, textAlign: 'justify'}}>
                            {formatDescription(product.description)}
                        </TableCell>
                        <TableCell sx={{minWidth: 50}}>
                            {product.availability}
                        </TableCell>
                        <TableCell sx={{minWidth: 150}}>
                            {product.price.toFixed(2) + " NC"}
                        </TableCell>
                        <TableCell sx={{minWidth: 150}}>
                            {product.minPrice.toFixed(2) + " NC"}
                        </TableCell>
                        <TableCell sx={{minWidth: 50}}>
                            {product.discount + " %"}
                        </TableCell>
                        <TableCell sx={{minWidth: 160}}>
                            {product.campaignDiscount + " %"}
                        </TableCell>
                        <TableCell
                            sx={{
                                minWidth: 170,
                                position: 'sticky',
                                right: 0,
                                backgroundColor: 'background.paper',
                                borderLeft: '1px solid rgba(224, 224, 224, 1)'
                            }}
                        >
                            {renderButtons(product)}
                        </TableCell>
                    </TableRow>
                ))}
            </>
        );
    }

    return (
        <Container maxWidth="lg">
            <Paper>
                <TableContainer sx={{height: '38rem'}}>
                    <Table stickyHeader>
                        <TableHead sx={{
                            '& th': {
                                color: 'white',
                                backgroundColor: '#444'
                            }
                        }}>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Brand</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Campaign</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Availability</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Min price</TableCell>
                                <TableCell>Discount</TableCell>
                                <TableCell>Campaign Discount</TableCell>
                                <TableCell
                                    sx={{
                                        position: 'sticky',
                                        right: 0,
                                        borderLeft: '1px solid rgba(224, 224, 224, 1)'
                                    }}
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderProducts()}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack sx={{borderTop: '1px solid rgba(224, 224, 224, 1)'}}>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalElements}
                        rowsPerPage={pageSize}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangePageSize}
                    />
                </Stack>
            </Paper>
            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                }}
                onClick={() => handleOpenDialogue(null)}
            >
                <Add/>
            </Fab>
            <ProductDialogue
                product={product}
                open={dialogue}
                handleClose={handleCloseDialogue}
                handleError={handleError}
            />
            <ProductCampaignDialogue
                product={product}
                open={editCampaign}
                handleClose={handleCloseEditCampaign}
                handleError={handleError}
            />
        </Container>
    );
}

export default Products;