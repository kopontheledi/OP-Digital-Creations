import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="footer-brand">
  <Link to="/" className="footer-logo-link">
    <img
      src="/Images/op-digital-creations-logo-bright.png"
      alt="OP Digital Creations"
      className="footer-logo"
    />
  </Link>

  <p>
    Websites, digital campaigns and analytics built to help
    businesses grow online.
  </p>
</div>

      <div>
        <b>Explore</b>

        <Link to="/services">
          Services
        </Link>

        <Link to="/work">
          Our Work
        </Link>

        <Link to="/quote">
          Get a Quote
        </Link>
      </div>

      <div>
        <b>Services</b>

        <Link to="/services">
          Web Development
        </Link>

        <Link to="/services">
          Social Media Campaigns
        </Link>

        <Link to="/services">
          Google Analytics
        </Link>
      </div>

      <div>
        <b>Contact</b>

        <span>
          South Africa
        </span>

        <Link to="/contact">
          Send us a message
        </Link>
      </div>
    </footer>
  );
}