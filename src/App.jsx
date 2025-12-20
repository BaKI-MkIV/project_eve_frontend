import PreviewScreen from './components/PreviewScreen/PreviewScreen.jsx';
import './App.css';
import './AppComponent.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from "./pages/main/MainPage.jsx";


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PreviewScreen />} />
                <Route path="/main" element={<MainPage />} />
            </Routes>
        </BrowserRouter>
    );
}