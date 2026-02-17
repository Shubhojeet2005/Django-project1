import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Signup() {
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_DJANGO_BASE_URL;

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!baseUrl) {
            setError("Base URL is not configured.");
            return;
        }

        if (!form.username || !form.email || !form.password || !form.password2) {
            setError("Please fill in all fields.");
            return;
        }

        if (form.password !== form.password2) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    password2: form.password2,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const firstError =
                    (typeof data === "object" &&
                        data &&
                        Object.values(data)[0]) || "Signup failed.";
                const message = Array.isArray(firstError)
                    ? firstError[0]
                    : firstError;
                throw new Error(message);
            }

            setSuccess("Account created successfully. You can now log in.");
            setTimeout(() => {
                navigate("/login");
            }, 800);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const goToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Sign up</h2>
                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            autoComplete="username"
                        />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
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
                            placeholder="Create a password"
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="password2">Confirm password</label>
                        <input
                            id="password2"
                            name="password2"
                            type="password"
                            value={form.password2}
                            onChange={handleChange}
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Sign up"}
                    </button>
                </form>
                <p className="auth-switch-text">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="auth-link-button"
                        onClick={goToLogin}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Signup;

