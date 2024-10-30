import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { login } from "../../services/authService";
import styles from "./Login.module.css";
export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            // Rediriger vers la page principale
            window.location.href = "/";
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (err) {
            setError("Login failed");
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: styles.form, children: [_jsxs("div", { children: [_jsx("label", { children: "Email:" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { children: "Password:" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value) })] }), error && _jsx("div", { className: styles.error, children: error }), _jsx("button", { type: "submit", children: "Login" })] }));
};
