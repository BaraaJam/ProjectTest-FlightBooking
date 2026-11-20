import { Link, Routes, Route } from 'react-router-dom';
import FlightsPage from './pages/FlightsPage';
import BookingsPage from './pages/BookingsPage';

function App() {
    return (
        <div>
            {/* Navigation Bar */}
            <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
                <Link to="/">Flights</Link>
                <Link to="/bookings">My bookings</Link>
            </nav>

            {/* Page Routes */}
            <main style={{ padding: '1rem' }}>
                <Routes>
                    <Route path="/" element={<FlightsPage />} />
                    <Route path="/bookings" element={<BookingsPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
