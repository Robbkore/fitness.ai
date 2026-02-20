import { ReactNode } from "react"
import { Routes, Route, Navigate, Link } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { Button } from "@/components/ui/button"

function DashboardPlaceholder() {
  const { logout, user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4 text-primary">Fitness.ai Dashboard</h1>
      <p className="mb-4 text-muted-foreground">Welcome, {user?.email || 'User'}</p>
      <Button onClick={logout} className="rounded-full">Log out</Button>
    </div>
  )
}

function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Fitness.ai</h1>
      <p className="mb-8 text-muted-foreground max-w-lg text-center">Your personal AI health assistant.</p>
      <Link to="/login">
        <Button className="rounded-full w-48 font-medium">Get Started</Button>
      </Link>
    </div>
  )
}

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPlaceholder />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
