import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "./styles/global.css";
import { LanguageProvider } from "./i18n/LanguageContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <LanguageProvider>
            <App />
        </LanguageProvider>
    </React.StrictMode>
);
