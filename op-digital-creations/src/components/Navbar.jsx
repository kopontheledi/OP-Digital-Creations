import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const links = [
        { path: "/", label: "Home" },
        { path: "/services", label: "Services" },
        { path: "/work", label: "Our Work" },
        { path: "/about", label: "About" },
        { path: "/contact", label: "Contact" },
    ];

    return (
        <header className="nav">
            <Link className="brand" to="/">
                <img
                    src="/Images/op-digital-creations-logo.png"
                    alt="OP Digital Creations"
                    className="brand-logo"
                />
            </Link>

            <button
                className="menu"
                onClick={() => setOpen(!open)}
            >
                {open ? <X /> : <Menu />}
            </button>

            <nav className={open ? "open" : ""}>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={() => setOpen(false)}
                    >
                        {link.label}
                    </NavLink>
                ))}

                <Link
                    className="nav-cta"
                    to="/quote"
                    onClick={() => setOpen(false)}
                >
                    Get a Quote
                </Link>
            </nav>
        </header>
    );
}