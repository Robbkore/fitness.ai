import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, User, ArrowRight, Activity, CalendarDays } from "lucide-react";

export default function Dashboard() {
    const { user, logout } = useAuth();

    // A profile is considered incomplete if any of these basic stats are missing
    const isProfileIncomplete = !user?.name || !user?.age || !user?.height || !user?.weight;

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-6 h-16 flex items-center justify-between">
                <div className="font-bold text-xl tracking-tight text-white">Fitness.ai</div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/profile">
                            <User className="h-5 w-5 text-muted-foreground hover:text-white" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={logout} className="rounded-full text-xs">
                        Log out
                    </Button>
                </div>
            </header>

            <main className="p-4 md:p-6 max-w-5xl mx-auto space-y-8 mt-4">

                {/* Welcome Section */}
                <section>
                    <h1 className="text-3xl font-bold">Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Here's your overview for today.</p>
                </section>

                {/* Action Needed Section */}
                {isProfileIncomplete && (
                    <section>
                        <h2 className="text-lg font-medium mb-3 flex items-center text-white">
                            <AlertCircle className="w-5 h-5 mr-2 text-primary" />
                            Action Required
                        </h2>
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
                                <p className="text-muted-foreground">
                                    To get personalized AI workout and diet plans, we need a bit more information about your physical attributes and goals.
                                </p>
                            </div>
                            <Button asChild className="rounded-full shrink-0 px-6 py-6 font-medium text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                                <Link to="/profile">
                                    Complete Profile
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </section>
                )}

                {/* Main Dashboard Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Active Plan Summary */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold">Active Plan</h3>
                        </div>

                        {isProfileIncomplete ? (
                            <div className="text-center py-6">
                                <p className="text-muted-foreground mb-4">You need to complete your profile before generating an AI plan.</p>
                                <Button variant="secondary" asChild className="rounded-full">
                                    <Link to="/profile">Set up Profile</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-primary font-medium tracking-wide text-sm uppercase">Strength & Hypertrophy</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Focusing on progressive overload for main compound lifts. 4 days a week split.
                                </p>
                                <Button className="w-full justify-between rounded-xl h-12" asChild>
                                    <Link to="/plans">
                                        View Full Plan
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Today's Schedule */}
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <CalendarDays className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold">Today's Schedule</h3>
                        </div>

                        <div className="py-8 text-center border-2 border-dashed border-border rounded-xl">
                            <p className="text-muted-foreground">No workouts scheduled for today.</p>
                            <Button variant="link" className="text-primary mt-2">
                                Browse Workouts
                            </Button>
                        </div>
                    </div>

                </section>

            </main>
        </div>
    );
}
