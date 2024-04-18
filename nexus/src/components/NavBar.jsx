import {AppBar, Toolbar, Button, Stack, Typography, Box, Avatar}  from '@mui/material';
import {useNavigate} from "react-router-dom";
import {JwtConstants} from "../constants/JwtConstats.js";
import {jwtDecode} from "jwt-decode";
import {RoleConstants} from "../constants/RoleConstats.js";

const NavBar = () => {
    const navigate = useNavigate();

    const renderButtons = () => {
        const token = localStorage.getItem(JwtConstants.KEY);
        const buttons = [];

        const signOut = () => {
            localStorage.removeItem(JwtConstants.KEY);

            navigate(0);
        }

        if(token) {
            const roles = jwtDecode(token).roles;

            if(roles.includes(RoleConstants.ADMIN)) {
                buttons.push(
                    <Button key="admin" sx={{textTransform: "none"}} onClick={() => navigate('/admin')}>
                        <Typography variant="h6" color="white">
                            Admin
                        </Typography>
                    </Button>
                );
            }

            buttons.push(
                <Button key="profile" sx={{textTransform: "none"}} onClick={() => navigate('/profile')}>
                    <Typography variant="h6" color="white">
                        Profile
                    </Typography>
                </Button>,
                <Button key="signOut" variant="contained"  color="secondary" size="large" onClick={signOut}>
                    Sign Out
                </Button>
            );
        } else {
            buttons.push(
                <Button key="signIn" variant="contained"  color="primary" size="large" onClick={() => navigate('/login')}>
                    Sign In
                </Button>,
                <Button key="signUp" variant="contained"  color="secondary" size="large" onClick={() => navigate('/register')}>
                    Sign Up
                </Button>
            );
        }

        return buttons;
    }

    return (
        <AppBar position="static" color="primary" sx={{padding: '0.3rem', background: '#333333'}}>
            <Toolbar>
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Stack direction="row" spacing={1}>
                        <Button sx={{textTransform: "none"}} color="inherit" onClick={() => navigate('/')}>
                            <Avatar alt="N" src="/logo.png" sx={{ width: 55, height: 55 }}/>
                            <Typography variant="h4" >
                                exus
                            </Typography>
                        </Button>
                        <Button sx={{textTransform: "none"}} color="inherit" onClick={() => navigate('/campaign')}>
                            <Typography variant="h6" color="white">
                                Campaigns
                            </Typography>
                        </Button>
                    </Stack>
                    <Stack direction="row" spacing={3}>
                        {renderButtons()}
                    </Stack>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;