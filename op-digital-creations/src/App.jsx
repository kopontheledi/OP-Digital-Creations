import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Work from "./pages/Work";
import About from "./pages/About";
import ThankYou from "./pages/ThankYou";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote";
import Admin from "./pages/Admin";

function WebsiteLayout() {
    return (
        <>
        <ScrollToTop />
            <Navbar />

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/work" element={<Work />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/quote" element={<Quote />} />
                    <Route path="/thank-you" element={<ThankYou />} />
                </Routes>
            </main>

            <Footer />
        </>
    );
}

export default function App() {
    return (
        <Routes>
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/*" element={<WebsiteLayout />} />
        </Routes>
    );
}