import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './styles/global.css'
import {StrictMode} from "react";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
)
