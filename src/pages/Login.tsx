import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
    const passwordRef = useRef<HTMLInputElement>(null);
    const ipRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const passwordStored = localStorage.getItem("password");

    const validatePassword = async (ip: string, password: string) => {
        try {
            const response = await fetch(`https://${ip}/auth?password=${encodeURIComponent(password)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log(`Status Text: ${response.statusText}`);
            console.log(`Status Code: ${response.status}`);

            const json = await response.json();

            console.log(JSON.stringify(json));

            if (json?.success) {
                localStorage.setItem("password", password);
                localStorage.setItem("ip", ip);
                navigate("/dashboard");
            } else {
                setError("Incorrect Password!");
            }
        } catch (err) {
            setError("Server offline or incorrect Server!");
        }
    };

    const handleLogin = () => {
        const ip = ipRef.current?.value;
        if (!ip || ip.length === 0) {
            setError("Please enter an IP");
            return;
        }

        if (passwordStored) {
            validatePassword(ip, passwordStored);
        } else {
            const pass = passwordRef.current?.value;
            if (!pass || pass.length === 0) {
                setError("Please enter a Password");
                return;
            }
            validatePassword(ip, pass);
        }
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        handleLogin();
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <input
                className={styles.textbox}
                type="text"
                ref={ipRef}
                name="ip"
                autoComplete="off"
                placeholder="IP"
                defaultValue={localStorage.getItem("ip") ?? ""}
            />
            {!passwordStored && (
                <input
                    className={styles.textbox}
                    type="password"
                    name="password"
                    autoComplete="off"
                    ref={passwordRef}
                    placeholder="Password"
                />
            )}
            <button className={styles.button} type="submit" onClick={handleLogin}>
                Login
            </button>
            {error && <p className={styles.error}>{error}</p>}
        </form>
    );
}
