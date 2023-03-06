import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="/board" element={<App />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;