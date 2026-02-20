import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Assuming a generic login endpoint exists or we use register for now
            // Actually, we haven't built POST /api/auth/login. We should build it,
            // but for this component we will point to it.
            const res = await axios.post("/api/auth/login", { email, password });
            login(res.data.token, res.data.user);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.response?.data || "Failed to login. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        // Stub for Google Auth flow
        // In a real app we'd use @react-oauth/google.
        // For now we mock the token and send it.
        try {
            setLoading(true);
            const res = await axios.post("/api/auth/google", {
                email: "demo@gmail.com",
                name: "Demo User",
                token: "mock-google-token"
            });
            login(res.data.token, res.data.user);
            navigate("/dashboard");
        } catch (err) {
            setError("Google Auth Failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Fitness.ai</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="relative block w-full rounded-2xl border-0 bg-input py-3 px-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full rounded-2xl border-0 bg-input py-3 px-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full rounded-full py-6 text-lg font-medium"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full rounded-full py-6 text-lg font-medium border-border hover:bg-input"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            Google
                        </Button>
                    </div>
                </div>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-medium text-primary hover:text-primary/80">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
