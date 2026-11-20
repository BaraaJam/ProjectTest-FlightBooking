import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import FlightsPage from "./pages/FlightsPage";
import BookingsPage from "./pages/BookingsPage";

function App() {
    return (
        <div className="min-h-screen text-slate-900">
            <Navbar />

            <main className="mx-auto w-full max-w-6xl px-4 py-8">
                <Routes>
                    <Route path="/" element={<FlightsPage />} />
                    <Route path="/bookings" element={<BookingsPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
