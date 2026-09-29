import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="cta">
      <div>
        <small>READY WHEN YOU ARE</small>
        <h2>Let's create something your business can be proud of.</h2>
      </div>
      <Link className="primary lightbtn" to="/quote">
        Get a quotation <ArrowRight size={18} />
      </Link>
    </section>
  );
}
