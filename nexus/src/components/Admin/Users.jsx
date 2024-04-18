import {useCallback, useEffect, useState} from "react";
import {
    Alert,
    Button,
    Chip,
    Container,
    Paper, Snackbar, Stack,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {admin} from "../../api/axios.jsx";
import {JwtConstants} from "../../constants/JwtConstats.js";
import {RoleConstants} from "../../constants/RoleConstats.js";

const Users = () => {
    const USERS_URL = '/users';
    const PROMOTE_URL = '/role/addition/';
    const DEMOTE_URL = '/role/removal/';

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);

    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }
    const handleChangePageSize = (event) => {
        setPageSize(+event.target.value);
        setPage(0);
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const getUsers = useCallback(async () => {
        const params = {
            page: page,
            size: pageSize
        };

        try {
            const response = await admin.get(USERS_URL, {
                params: params
            });

            setUsers(response.data.content);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            }

            setErrorMessage(err.response?.data);
            setOpen(true);
        }
    }, [page, pageSize, navigate]);

    useEffect(() => {
        getUsers().then(null);
    }, [getUsers]);

    const promote = async (user) => {
        const url = PROMOTE_URL + user.username;

        try {
            await admin.patch(url);

            const updatedUser = {
                ...user,
                roles: [...user.roles, RoleConstants.ADMIN]
            };

            setUsers(users.map(u => u.username === user.username ? updatedUser : u));
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            }

            setErrorMessage(err.response?.data);
            setOpen(true);
        }
    }

    const demote = async (user) => {
        const url = DEMOTE_URL + user.username;

        try {
            await admin.patch(url);

            const updatedUser = {
                ...user,
                roles: user.roles.filter(role => role !== RoleConstants.ADMIN)
            };

            setUsers(users.map(u => u.username === user.username ? updatedUser : u));
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            }

            setErrorMessage(err.response?.data);
            setOpen(true);
        }
    }

    const renderAlert  = () => {
        return (
            <Snackbar
                open={open}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
                onClose={handleClose}
                sx={{marginTop: '5rem', maxWidth: '15%'}}
            >
                <Alert severity="error" variant="filled" onClose={handleClose}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        )
    }

    const renderRoles = (roles) => {
        return (
            <Stack direction="row" spacing={1}>
                {roles.map((role) => (
                    <Chip key={role} label={role} color={role === RoleConstants.ADMIN ? "error" : "info"}/>
                ))}
            </Stack>
        )
    }

    const renderButtons = (user) => {
        if (user.roles.includes(RoleConstants.ADMIN)) {
            return (
                <Button key='demote' variant="contained" color="error" onClick={() => demote(user)}>
                    Demote
                </Button>
            );
        }

        return (
            <Button key='demote' variant="contained" color="success" onClick={() => promote(user)}>
                Promote
            </Button>
        );
    }

    const renderUsers = () => {
        return users.map((user) => (
            <TableRow
                key={user.username}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
                <TableCell sx={{fontWeight: "bold", width: '40%'}}>
                    {user.username}
                </TableCell>
                <TableCell sx={{width: '40%'}}>
                    {renderRoles(user.roles)}
                </TableCell>
                <TableCell sx={{width: '20%'}}>
                    {renderButtons(user)}
                </TableCell>
            </TableRow>
        ));
    }

    return (
        <Container maxWidth="md">
            {renderAlert()}
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
                                <TableCell>Username</TableCell>
                                <TableCell>Roles</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderUsers()}
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
        </Container>
    )
}

export default Users