import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function ThankYou() {
  return (
    <main className="thank-you-page">
      <div className="thank-you-card">
        <div className="thank-you-icon">
          <CheckCircle2 size={42} />
        </div>

        <small>ENQUIRY RECEIVED</small>

        <h1>Thank you for getting in touch.</h1>

        <p>
          Your enquiry has been successfully submitted to
          OP Digital Creations.
        </p>

        <p className="thank-you-muted">
          We'll review your project requirements and get back to you
          using the contact details you provided.
        </p>

        <div className="thank-you-actions">
          <Link to="/" className="primary">
            <Home size={18} />
            Back to home
          </Link>

          <Link to="/work" className="secondary">
            View our work
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}