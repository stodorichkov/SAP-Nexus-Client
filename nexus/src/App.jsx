import Register from "./components/Auth/Register.jsx";
import Login from "./components/Auth/Login.jsx";
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom';
import RequireAuth from "./components/RequireAuth.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import Users from "./components/Users.jsx";
import {jwtDecode} from "jwt-decode";
import {RoleConstants} from "./conastants/RoleConstats.js";

const App = () => {
    const renderRoute = () => {
        const token = localStorage.getItem('token');
        let routes = [];

        if (token) {
            const roles = jwtDecode(token).roles;

            if(roles.includes(RoleConstants.ADMIN)) {
                // Add admin route
            }

            // Add routes for auth users
        } else {
            routes.push(
                <Route path="/login" element={<Login/>}/>,
                <Route path="/register" element={<Register/>}/>
            );
        }

        return routes;
    }

    return (
        <BrowserRouter>
            {/*Add nav bar route*/}
            <Routes>
                {/*Add Home route*/}
                {renderRoute()}
                <Route path="*" element={<Navigate to="/"/>}/>

                {/*<Route path="/unauthorized" element={<Unauthorized/>}/>*/}

                {/*/!*TODO: add other public and protected routes*!/*/}
                {/*<Route element={<RequireAuth allowedRoles={["user"]}/>}>*/}
                {/*    <Route path="/users" element={<Users/>}/>*/}
                {/*</Route>*/}
                {/*<Route element={<RequireAuth allowedRoles={["admin"]}/>}>*/}
                {/*    <></>*/}
                {/*</Route>*/}

            </Routes>
        </BrowserRouter>
    )
}

export default App