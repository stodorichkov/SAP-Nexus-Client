import {
    Container, IconButton,
    Paper, Stack,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, Tooltip, Typography
} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {admin} from "../../../api/axios.jsx";
import {JwtConstants} from "../../../constants/JwtConstats.js";
import {useNavigate} from "react-router-dom";
import {Delete, Edit} from "@mui/icons-material";

const CampaignProducts = (props) => {
    const PRODUCTS_URL = '/campaign/';

    // eslint-disable-next-line react/prop-types
    const campaign = props.campaign;
    // eslint-disable-next-line react/prop-types
    const handleError = props.handleError;

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);

    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }
    const handleChangePageSize = (event) => {
        setPageSize(+event.target.value);
        setPage(0);
    }

    const getProducts= useCallback(async () => {
        const url = PRODUCTS_URL + campaign;
        const params = {
            page: page,
            size: pageSize,
        };

        try {
            const response = await admin.get(url, {
                params: params
            });

            setProducts(response.data.content);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            }

            handleError(err.response?.data);
        }
    }, [page, pageSize, handleError, navigate, campaign]);

    useEffect(() => {
        getProducts().then(null);
    }, [getProducts]);

    const renderButtons = (product) => {
        const buttons = [];

        buttons.push(
            <Tooltip title="Edit product discount" key="edit">
                <IconButton>
                    <Edit/>
                </IconButton>
            </Tooltip>,
            <Tooltip title="Remove product" key="remove">
                <IconButton color="error" >
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
                        <TableCell sx={{fontWeight: "bold", width: '5%'}}>
                            {product.id}
                        </TableCell>
                        <TableCell sx={{width: '20%'}}>
                            {product.name}
                        </TableCell>
                        <TableCell sx={{width: '20%'}}>
                            {product.brand}
                        </TableCell>
                        <TableCell sx={{width: '20%'}}>
                            {product.category}
                        </TableCell>
                        <TableCell sx={{width: '5%'}}>
                            {product.availability}
                        </TableCell>
                        <TableCell sx={{width: '10%'}}>
                            {product.price.toFixed(2)}
                        </TableCell>
                        <TableCell sx={{width: '5%'}}>
                            {product.campaignDiscount}
                        </TableCell>
                        <TableCell>
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
                <Stack
                    direction="column"
                    justifyContent="space-around"
                    alignItems="center"
                    spacing={2}
                    sx={{paddingTop: '1rem'}}
                >
                    <Typography variant="h4">{campaign}</Typography>
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
                                    <TableCell>Availability</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Discount</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {renderProducts()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Stack sx={{borderTop: '1px solid rgba(224, 224, 224, 1)', width: "100%"}}>
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
                </Stack>
            </Paper>
        </Container>
    );
}

export default CampaignProducts;