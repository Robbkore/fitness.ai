import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Profile() {
    const { user, login, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const initCm = user?.height || 0;
    const initKg = user?.weight || 0;
    const initInchesTotal = initCm / 2.54;

    const [formData, setFormData] = useState({
        name: user?.name || "",
        age: user?.age || "",
        gender: user?.gender || "",
        country: user?.country || "US",
        activity_level: user?.activity_level || "moderate",
        goals: user?.goals || "",
    });

    const [metricHeight, setMetricHeight] = useState(initCm || "");
    const [metricWeight, setMetricWeight] = useState(initKg || "");

    const [usFeet, setUsFeet] = useState(initCm ? Math.floor(initInchesTotal / 12) : "");
    const [usInches, setUsInches] = useState(initCm ? Math.round(initInchesTotal % 12) : "");
    const [usLbs, setUsLbs] = useState(initKg ? Math.round(initKg * 2.20462) : "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isUS = formData.country === "US";

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        try {
            let finalHeight = parseFloat(metricHeight as string) || 0;
            let finalWeight = parseFloat(metricWeight as string) || 0;

            if (isUS) {
                const f = parseFloat(usFeet as string) || 0;
                const i = parseFloat(usInches as string) || 0;
                finalHeight = (f * 12 + i) * 2.54;
                finalWeight = (parseFloat(usLbs as string) || 0) / 2.20462;
            }

            const res = await axios.put("/api/users/me", {
                ...formData,
                age: parseInt(formData.age as string) || 0,
                height: Number(finalHeight.toFixed(2)),
                weight: Number(finalWeight.toFixed(2)),
            });
            // The backend should return the updated user
            if (token) {
                login(token, res.data.user);
            }
            setSuccess("Profile updated successfully!");
        } catch (err: any) {
            setError(err.response?.data || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-6 h-16 flex items-center">
                <Button variant="ghost" size="icon" asChild className="mr-4">
                    <Link to="/dashboard">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div className="font-bold text-xl tracking-tight text-white">Profile Settings</div>
            </header>

            <main className="p-4 md:p-6 max-w-3xl mx-auto space-y-8 mt-4">
                <section>
                    <h1 className="text-3xl font-bold">Your Profile</h1>
                    <p className="text-muted-foreground mt-1">Manage your physical attributes and goals so our AI can build you the perfect plan.</p>
                </section>

                {error && <div className="p-4 bg-destructive/10 text-destructive rounded-xl">{error}</div>}
                {success && <div className="p-4 bg-primary/10 text-primary rounded-xl">{success}</div>}

                <form onSubmit={handleSave} className="space-y-6 bg-card border border-border p-6 rounded-2xl shadow-sm">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                            <input id="name" name="name" value={formData.name} onChange={handleChange}
                                className="w-full rounded-xl bg-input py-3 px-4 border-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="age" className="text-sm font-medium">Age</label>
                            <input id="age" name="age" type="number" value={formData.age} onChange={handleChange} min="13" max="100" required
                                className="w-full rounded-xl bg-input py-3 px-4 border-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="gender" className="text-sm font-medium">Gender</label>
                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required
                                className="w-full rounded-xl bg-input py-3 px-4 border-none focus:ring-2 focus:ring-primary text-white"
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="activity_level" className="text-sm font-medium">Activity Level</label>
                            <select id="activity_level" name="activity_level" value={formData.activity_level} onChange={handleChange}
                                className="w-full rounded-xl bg-input py-3 px-4 border-none focus:ring-2 focus:ring-primary text-white"
                            >
                                <option value="sedentary">Sedentary</option>
                                <option value="light">Lightly Active</option>
                                <option value="moderate">Moderately Active</option>
                                <option value="active">Very Active</option>
                                <option value="extra">Extra Active</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="country" className="text-sm font-medium">Country</label>
                            <select id="country" name="country" value={formData.country} onChange={handleChange} required
                                className="w-full rounded-xl bg-input py-3 px-4 border-none focus:ring-2 focus:ring-primary text-white"
                            >
                                <option value="US">United States (ft/lbs)</option>
                                <option value="UK">United Kingdom (cm/kg)</option>
                                <option value="CA">Canada (cm/kg)</option>
                                <option value="AU">Australia (cm/kg)</option>
                                <option value="EU">Europe / Other (cm/kg)</option>
                            </select>
                        </div>

                        {isUS ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Height</label>
                                    <div className="flex gap-4">
                                        <input name="usFeet" type="number" placeholder="ft" value={usFeet} onChange={(e) => setUsFeet(e.target.value)} required
                                            className="w-1/2 rounded-xl bg-input py-3 px-4 border-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                                        />
                                        <input name="usInches" type="number" placeholder="in" value={usInches} onChange={(e) => setUsInches(e.target.value)} required
                                            className="w-1/2 rounded-xl bg-input py-3 px-4 border-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="usLbs" className="text-sm font-medium">Weight (lbs)</label>
                                    <input id="usLbs" name="usLbs" type="number" value={usLbs} onChange={(e) => setUsLbs(e.target.value)} required
                                        className="w-full rounded-xl bg-input py-3 px-4 border-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label htmlFor="height" className="text-sm font-medium">Height (cm)</label>
                                    <input id="height" name="height" type="number" value={metricHeight} onChange={(e) => setMetricHeight(e.target.value)} required
                                        className="w-full rounded-xl bg-input py-3 px-4 border-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="weight" className="text-sm font-medium">Weight (kg)</label>
                                    <input id="weight" name="weight" type="number" value={metricWeight} onChange={(e) => setMetricWeight(e.target.value)} required
                                        className="w-full rounded-xl bg-input py-3 px-4 border-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-2 pt-4">
                        <label htmlFor="goals" className="text-sm font-medium">Fitness Goals</label>
                        <textarea id="goals" name="goals" rows={4} value={formData.goals} onChange={handleChange}
                            placeholder="e.g. Lose 10lbs, build upper body strength, improve cardio endurance"
                            className="w-full rounded-xl bg-input py-3 px-4 border-none focus:ring-2 focus:ring-primary resize-none"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={loading} className="rounded-full px-8 py-6 text-base font-medium">
                            {loading ? "Saving..." : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
