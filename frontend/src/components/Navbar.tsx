import { Link, NavLink } from "react-router-dom";

const links = [
    { to: "/", label: "Flights" },
    { to: "/bookings", label: "My bookings" },
];

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 px-4 pt-4">
            <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 rounded-md border border-white/60 bg-white/55 px-3 py-2 backdrop-blur-xl backdrop-saturate-150">
                <NavLink
                    to="/"
                    className="text-[15px] font-semibold uppercase leading-none tracking-[0.16em] text-slate-900"
                >
                    Lexicon Airways
                </NavLink>

                <div className="hidden items-center gap-8 md:flex">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end
                            className={({ isActive }) =>
                                `text-[15px] font-medium tracking-tight transition-colors ${
                                    isActive
                                        ? "text-slate-900"
                                        : "text-slate-500 hover:text-slate-900"
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                <Link
                    to="/?available=true"
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold tracking-tight text-white transition-colors hover:bg-slate-800"
                >
                    Book a flight
                </Link>
            </nav>
        </header>
    );
}
