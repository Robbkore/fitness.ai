import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.post("/api/auth/register", { email, password, name });
            login(res.data.token, res.data.user);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.response?.data || "Registration failed. Please try a different email.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
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
                    <p className="mt-2 text-sm text-muted-foreground">Create a new account</p>
                </div>

                {error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="relative block w-full rounded-2xl border-0 bg-input py-3 px-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
                                placeholder="Full Name (Optional)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
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
                            {loading ? "Creating..." : "Create Account"}
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-card px-2 text-muted-foreground">Or register with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full rounded-full py-6 text-lg font-medium border-border hover:bg-input"
                            onClick={handleGoogleRegister}
                            disabled={loading}
                        >
                            Google
                        </Button>
                    </div>
                </div>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
