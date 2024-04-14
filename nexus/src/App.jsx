import Register from "./components/Auth/Register.jsx";
import Login from "./components/Auth/Login.jsx";
import {Routes, Route} from 'react-router-dom';
import Layout from "./components/Layout.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import Users from "./components/Users.jsx";

function App() {

  return (
    <Routes>
        <Route path="/" element={<Layout/>}>
            <Route path="login" element={ <Login /> } />
            <Route path="register" element={ <Register /> } />
            <Route path="unauthorized" element={<Unauthorized />} />


            {/*TODO: add other public and protected routes*/}
            <Route element={<RequireAuth allowedRoles={["user"]}/>}>
                <Route path="/users" element={<Users/>} />
            </Route>
            <Route element={<RequireAuth allowedRoles={["admin"]}/>}>
                <></>
            </Route>

        </Route>
    </Routes>
  )
}

export default App
