import {
  ArrowRight,
  BarChart3,
  Code2,
  Lightbulb,
  Megaphone,
  Settings,
  ShoppingCart,
} from "lucide-react";

import { Link } from "react-router-dom";

import CTA from "../components/CTA";
import ProjectCard from "../components/ProjectCard";
import SectionTitle from "../components/SectionTitle";

import {
  projects,
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

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div>
          <div className="eyebrow">
            WEB • SOCIAL • ANALYTICS
          </div>

          <h1>
            We build digital experiences that{" "}
            <em>move businesses forward.</em>
          </h1>

          <p>
            OP Digital Creations creates modern websites, digital
            campaigns and measurable online experiences for growing
            businesses.
          </p>

          <div className="actions">
            <Link
              className="primary"
              to="/quote"
            >
              Start your project
              <ArrowRight size={18} />
            </Link>

            <Link
              className="secondary"
              to="/work"
            >
              View our work
            </Link>
          </div>
        </div>

        <div className="hero-art">
          <div className="window">
            <div className="dots">
              ● ● ●
            </div>

            <div className="mock">
              <span>OP</span>

              <h3>
                Your business.
                <br />
                Better online.
              </h3>

              <i></i>
              <i></i>
              <i></i>
            </div>
          </div>

          <div className="stat">
            <b>
              Strategy + Design + Code
            </b>

            <span>
              One digital partner
            </span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section>
        <SectionTitle
          eyebrow="WHAT WE DO"
          title="Digital services built around your business."
        />

        <div className="cards">
          {services
            .slice(0, 4)
            .map((service, index) => {
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
            })}
        </div>

        <div className="center">
          <Link
            className="text-link"
            to="/services"
          >
            Explore all services
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="dark">
        <SectionTitle
          eyebrow="SELECTED WORK"
          title="Ideas turned into useful digital products."
        />

        <div className="projects">
          {projects
            .slice(0, 3)
            .map((project) => (
              <ProjectCard
                p={project}
                key={project.name}
              />
            ))}
        </div>
      </section>

     {/* FOUNDER */}
{/* FOUNDER */}
<section className="founder">
  <div>
    <small>FROM THE FOUNDER</small>

    <h2>Building something that can outlive me.</h2>

    <p>
      OP Digital Creations is named after my daughter,{" "}
      <b>Oamogetswe Precious</b>. I created the business not
      only from my love of building useful digital products,
      but with the intention of building a legacy that can grow
      with her and create opportunities long into the future.
    </p>

    <p>
      For our clients, that means thoughtful work built with
      the same long-term mindset: professional, practical
      digital solutions that help businesses move forward.
    </p>

    <b>— Founder, OP Digital Creations</b>
  </div>
</section>

      <CTA />
    </>
  );
}