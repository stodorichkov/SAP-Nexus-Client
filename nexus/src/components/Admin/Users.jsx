import {useCallback, useEffect, useState} from "react";
import {
    Chip,
    Container, IconButton,
    Paper, Stack,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, Tooltip,
} from "@mui/material";
import {AddModerator, RemoveModerator} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {admin} from "../../api/axios.jsx";
import {JwtConstants} from "../../constants/JwtConstats.js";
import {RoleConstants} from "../../constants/RoleConstats.js";


const Users = (props) => {
    const USERS_URL = '/users';
    const PROMOTE_URL = '/role/addition/';
    const DEMOTE_URL = '/role/removal/';

    const handleError = props.handleError;

    const [users, setUsers] = useState([]);
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

            handleError(err.response?.data);
        }
    }, [page, pageSize, handleError, navigate]);

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

            handleError(err.response?.data);
        }
    }

    const demote = async (user) => {
        const url = DEMOTE_URL + user.username;

        try {
            await admin.patch(url);

            const updatedUser = {
                ...user,
                roles: user.roles.filter(role => role.toString() !== RoleConstants.ADMIN)
            };

            setUsers(users.map(u => u.username === user.username ? updatedUser : u));
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            }

            handleError(err.response?.data);
        }
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
                <Tooltip title="Demote user">
                    <IconButton color="error" onClick={() => demote(user)}>
                        <RemoveModerator/>
                    </IconButton>
                </Tooltip>
            );
        }

        return (
            <Tooltip title="Promote">
                <IconButton color="success" onClick={() => promote(user)}>
                    <AddModerator/>
                </IconButton>
            </Tooltip>
        );
    }

    const renderUsers = () => {
        return(
            <>
                {users.map((user) => (
                    <TableRow
                        key={user.username}
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
                ))}
            </>

        );
    }

    return (
        <Container maxWidth="md">
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
    );
}

export default Users