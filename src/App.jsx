import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {Notifications} from '@mantine/notifications';
import {MantineProvider} from '@mantine/core';
import {AdminLayout} from './layouts/AdminLayout';
import {AuthGuard} from './components/AuthGuard';
import {myTheme} from './theme';
import {Dashboard} from "./pages/Dashboard.jsx";
import {Users} from "./pages/Users.jsx";
import {Roles} from "./pages/Roles.jsx";
import {Permissions} from "./pages/Permissions.jsx";
import {LoginPage} from "./pages/LoginPage.jsx";
import {Reviews} from "./pages/Reviews.jsx";
import {Orders} from "./pages/Orders.jsx";
import {Cart} from "./pages/Cart.jsx";
import {Products} from "./pages/Products.jsx";
import {Categories} from "./pages/Categories.jsx";
import {AuthProvider, useAuth} from './contexts/AuthProvider.jsx';
import {Customers} from "./pages/Customers.jsx";

function App() {
    return (
        <MantineProvider theme={myTheme}>
            <Notifications/>
            <AuthProvider>
                <AppRouter/>
            </AuthProvider>
        </MantineProvider>
    );
}

function AppRouter() {
    const {isAuthenticated} = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/"/> : <LoginPage/>}
                />

                <Route element={<AuthGuard isAllowed={isAuthenticated}/>}>
                    <Route element={<AdminLayout/>}>
                        <Route path="/" element={<Dashboard/>}/>
                        <Route path="/users" element={<Users/>}/>
                        <Route path="/roles" element={<Roles/>}/>
                        <Route path="/permissions" element={<Permissions/>}/>
                        <Route path="/settings" element={<div>Settings</div>}/>
                        <Route path="/categories" element={<Categories/>}/>
                        <Route path="/products" element={<Products/>}/>
                        <Route path="/reviews" element={<Reviews/>}/>
                        <Route path="/cart" element={<Cart/>}/>
                        <Route path="/orders" element={<Orders/>}/>
                        <Route path="/customers" element={<Customers/>}/>
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;