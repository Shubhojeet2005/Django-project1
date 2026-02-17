import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/auth";
import "./Auth.css";

function Login() {
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_DJANGO_BASE_URL;

    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!baseUrl) {
            setError("Base URL is not configured.");
            return;
        }

        if (!form.username || !form.password) {
            setError("Please fill in both username and password.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const detail =
                    data.detail ||
                    data.error ||
                    "Login failed. Please check your credentials.";
                throw new Error(detail);
            }

            const tokens = await res.json();
            saveToken(tokens);

            // Redirect to home page
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const goToSignup = () => {
        navigate("/signup");
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Login</h2>
                {error && <div className="auth-error">{error}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            autoComplete="username"
                        />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="auth-switch-text">
                    Don&apos;t have an account?{" "}
                    <button
                        type="button"
                        className="auth-link-button"
                        onClick={goToSignup}
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;