import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
    { to: "/", label: "Flights" },
    { to: "/bookings", label: "My bookings" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 px-4 pt-4">
            <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-md border border-white/60 bg-white/55 px-3 py-2 backdrop-blur-xl backdrop-saturate-150">
                <NavLink
                    to="/"
                    className="truncate text-[15px] font-semibold uppercase leading-none tracking-[0.16em] text-slate-900"
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

                <div className="flex items-center gap-2">
                    <Link
                        to="/?available=true"
                        className="hidden rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold tracking-tight text-white transition-colors hover:bg-slate-800 sm:inline-flex"
                    >
                        Book a flight
                    </Link>

                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/60 bg-white/60 text-slate-700 transition-colors hover:bg-white md:hidden"
                    >
                        {isOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
                    </button>
                </div>
            </nav>

            {isOpen && (
                <div
                    id="mobile-menu"
                    className="absolute inset-x-4 top-full mt-2 animate-menu-in rounded-md border border-white/60 bg-linear-to-b from-white/75 to-white/50 p-2 shadow-lg backdrop-blur-2xl backdrop-saturate-150 md:hidden"
                >
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-slate-900/5 text-slate-900"
                                        : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900"
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}

                    <Link
                        to="/?available=true"
                        onClick={() => setIsOpen(false)}
                        className="mt-1 block rounded-md bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white sm:hidden"
                    >
                        Book a flight
                    </Link>
                </div>
            )}
        </header>
    );
}
