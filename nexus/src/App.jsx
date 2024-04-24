import Register from "./components/Auth/Register.jsx";
import Login from "./components/Auth/Login.jsx";
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import {RoleConstants} from "./constants/RoleConstats.js";
import {JwtConstants} from "./constants/JwtConstats.js";
import NavBar from "./components/NavBar.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Admin from "./components/Admin/Admin.jsx";
import Product from "./components/Products/Product.jsx";
import Products from "./components/Products/Products.jsx";
import ProductDetailsDialog from "./components/Products/ProductDetailsDialog.jsx";

const App = () => {
    const renderRoutes = () => {
        const token = localStorage.getItem(JwtConstants.KEY);
        let routes = [];

        if (token) {
            const roles = jwtDecode(token).roles;

            if(roles.includes(RoleConstants.ADMIN)) {
                routes.push(
                    <Route key="admin" path="/admin" element={<Admin/>}/>
                );
            }

            routes.push(
                <Route key="profile" path="/profile" element={<Profile/>} />,
                <Route key="products" path="/products" element={<Product/>} />
            )
        } else {
            routes.push(
                <Route key="login" path="/login" element={<Login/>} />,
                <Route key="register" path="/register" element={<Register/>} />
            );
        }

        return routes;
    }

    return (
        <div style={{
            background: '#EFF4F9',
            minHeight: '100vh',
            overflow: 'hidden'
        }}>
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    {/*Add Home route*/}
                    <Route path="/campaign"/>
                    {renderRoutes()}
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )

}

export default App;