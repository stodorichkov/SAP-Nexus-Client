import {useCallback, useEffect, useState} from "react";
import {
    Button,
    Chip,
    Container,
    Paper, Stack,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {admin} from "../../api/axios.jsx";
import {JwtConstants} from "../../constants/JwtConstats.js";
import {RoleConstants} from "../../constants/RoleConstats.js";

const USERS_URL = '/users'

const Users = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);

    const navigate = useNavigate();

    const getUsers = useCallback (async () => {
        const params = {
          page:page
        };

        try {
            const response = await admin.get(USERS_URL,{
                params: params
            })
            console.log(response.data);
            setUsers(response.data.content);
        } catch (err) {
            if(err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            }
            console.log(err);
        }
    }, []);

    useEffect(() => {
        getUsers();
    }, [getUsers, page]);

    const promote = async (user) => {
        const updatedUser = { ...user, roles: [...user.roles, RoleConstants.ADMIN]};
        setUsers(users.map(u => u.username === user.username ? updatedUser : u));
    }

    const demote = async (user) => {
        const updatedUser = { ...user, roles: user.roles.filter(role => role !== RoleConstants.ADMIN) };
        setUsers(users.map(u => u.username === user.username ? updatedUser : u));
    }

    const renderRoles = (roles) => {
        return (
            <Stack direction="row" justifyContent="center" spacing={1}>
                {roles.map((role) => (
                    <Chip key={role} label={role} color={role === RoleConstants.ADMIN ? "error" : "info"}/>
                ))}
            </Stack>
        )
    }

    const renderButtons = (user) => {
        if(user.roles.includes(RoleConstants.ADMIN)) {
            return(
                <Button key='demote' variant="contained"  color="error" onClick={() => demote(user)}>
                    Demote
                </Button>
            );
        }

        return (
            <Button key='demote' variant="contained"  color="success" onClick={() => promote(user)}>
                Promote
            </Button>
        );
    }

    const renderUsers = () => {
        return users.map((user) => (
            <TableRow
                key={user.username}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell align="center" sx={{fontWeight: "bold"}}>
                    {user.username}
                </TableCell>
                <TableCell align="center">
                    {renderRoles(user.roles)}
                </TableCell>
                <TableCell align="center">
                    {renderButtons(user)}
                </TableCell>
            </TableRow>
        ))
    }

    return (
        <Container maxWidth="md">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead >
                        <TableRow>
                            <TableCell align="center">Username</TableCell>
                            <TableCell align="center">Roles</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderUsers()}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default Users