import {
  BarChart3,
  Code2,
  Lightbulb,
  Megaphone,
  Settings,
  ShoppingCart,
} from "lucide-react";

import { Link } from "react-router-dom";

import CTA from "../components/CTA";
import PageHero from "../components/PageHero";
import SectionTitle from "../components/SectionTitle";

import {
  pricing,
  services,
} from "../data/siteData";

const icons = [
  Code2,
  ShoppingCart,
  Megaphone,
  BarChart3,
  Settings,
  Lightbulb,
];

export default function Services() {
  return (
    <>
      {/* PAGE HERO */}
      <PageHero
        tag="OUR SERVICES"
        title="Everything your business needs to grow online."
        text="From your first website to campaigns and performance tracking, we help connect the pieces."
      />

      {/* SERVICES */}
      <section>
        <div className="cards">
          {services.map(
            (service, index) => {
              const Icon = icons[index];

              return (
                <div
                  className="card"
                  key={service.title}
                >
                  <Icon />

                  <h3>
                    {service.title}
                  </h3>

                  <p>
                    {service.text}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* PRICING */}
      <section className="soft">
        <SectionTitle
          eyebrow="WEBSITE PRICING"
          title="Clear starting prices. Customised to your project."
          text="Final pricing depends on scope, content, integrations and functionality. Hosting, domains and paid third-party services can be quoted separately."
        />

        <div className="pricing">
          {pricing.map(
            (price, index) => (
              <div
                className={
                  "price " +
                  (index === 1
                    ? "featured"
                    : "")
                }
                key={price.name}
              >
                {index === 1 && (
                  <small>
                    POPULAR
                  </small>
                )}

                <h3>
                  {price.name}
                </h3>

                <strong>
                  {price.price}
                </strong>

                {price.features.map(
                  (feature) => (
                    <span key={feature}>
                      ✓ {feature}
                    </span>
                  )
                )}

                <Link to="/quote">
                  Request quote
                </Link>
              </div>
            )
          )}
        </div>
      </section>

      <CTA />
    </>
  );
}