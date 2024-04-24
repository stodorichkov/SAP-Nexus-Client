import {
    Container, Fab,
    Paper, Stack,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, Typography
} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import AddIcon from "@mui/icons-material/Add.js";
import {admin} from "../../api/axios.jsx";
import {JwtConstants} from "../../constants/JwtConstats.js";
import {useNavigate} from "react-router-dom";

const CampaignProducts = (props) => {
    const PRODUCTS_URL = '/campaign/';

    const campaign = props.campaign;
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

            console.log(response)

            setProducts(response.data.content);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            }

            handleError(err.response?.data);
        }
    }, [page, pageSize, handleError, navigate]);

    useEffect(() => {
        getProducts().then(null);
    }, [getProducts]);

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
                        <TableCell>
                            {product.name}
                        </TableCell>
                        <TableCell>
                            {product.brand}
                        </TableCell>
                        <TableCell>
                            {product.category}
                        </TableCell>
                        <TableCell>
                            {product.availability}
                        </TableCell>
                        <TableCell>
                            {product.price}
                        </TableCell>
                        <TableCell>
                            {product.campaignDiscount}
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
            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                }}
            >
                <AddIcon />
            </Fab>
        </Container>
    )
}

export default CampaignProducts;