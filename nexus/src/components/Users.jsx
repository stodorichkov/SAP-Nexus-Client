import {useEffect, useState} from "react";
import {Container, List, ListItem, Typography} from "@mui/material";
import {auth} from "../api/axios.jsx";

//TODO: display first name and last name not only username
const Users = () => {

    const [users, setUsers] = useState()

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()

        const getUsers = async () => {
            try {
                const response = await auth.get('/users', {
                    signal: controller.signal
                })
                console.log(response.data)
                isMounted && setUsers(response.data)
            } catch (err) {
                console.log(err)
            }
        }

        getUsers()

        return () => {
            isMounted = false
            controller.abort()
        }
    }, []);

    return (
        <Container maxWidth="sm">
            <Typography variant="h1">Users list</Typography>
            {users?.length
                ? (
                    <List>
                        {users.map((user, i) => <ListItem key={i}>{user?.username}</ListItem>)}
                    </List>
                ) : <Typography variant="body2">No users to display</Typography>
            }
        </Container>
    )
}

export default Users