import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import FlightsPage from "./pages/FlightsPage";
import BookingsPage from "./pages/BookingsPage";

function App() {
    const location = useLocation();

    return (
        <div className="min-h-screen text-slate-900">
            <Navbar />

            <main className="mx-auto w-full max-w-6xl px-4 py-8">
                {/* keyed by path so each route change gets a soft fade */}
                <div key={location.pathname} className="animate-fade-in">
                    <Routes>
                        <Route path="/" element={<FlightsPage />} />
                        <Route path="/bookings" element={<BookingsPage />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default App;
