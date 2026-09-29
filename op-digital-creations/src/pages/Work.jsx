import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import PageHero from "../components/PageHero";
import CTA from "../components/CTA";
import { db } from "../lib/firebase";

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // CREATE PROJECT INITIALS
  // =========================================

  const getProjectInitials = (title = "") => {
    const words = title
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) {
      return "OP";
    }

    if (words.length === 1) {
      return words[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  };

  // =========================================
  // LOAD PROJECTS FROM FIREBASE
  // =========================================

  useEffect(() => {
    const projectsQuery = query(
      collection(db, "projects"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      projectsQuery,

      (snapshot) => {
        const projectData = snapshot.docs.map(
          (projectDoc) => ({
            id: projectDoc.id,
            ...projectDoc.data(),
          })
        );

        setProjects(projectData);
        setLoading(false);
      },

      (error) => {
        console.error(
          "Error loading projects:",
          error
        );

        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <>
      {/* =====================================
          PAGE HERO
      ===================================== */}

      <PageHero
        tag="OUR WORK"
        title="Built to solve real business needs."
        text="A selection of websites and digital products created across e-commerce, service businesses and community platforms."
      />

      {/* =====================================
          PROJECTS
      ===================================== */}

      <section className="work-section">
        <div className="work-container">

          {loading ? (
            <div className="work-status">
              <span className="work-loader" />

              <p>
                Loading our work...
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="work-empty">
              <span>
                OP DIGITAL CREATIONS
              </span>

              <h2>
                New work is on the way.
              </h2>

              <p>
                We're building thoughtful digital
                experiences for businesses and
                brands. Our latest projects will
                appear here soon.
              </p>
            </div>
          ) : (
            <div className="work-grid">
              {projects.map((project) => (
                <article
                  className="work-project-card"
                  key={project.id}
                >
                  {/* PROJECT VISUAL */}

                  <div className="work-project-visual">
                    <div className="work-project-monogram">
                      {getProjectInitials(
                        project.title
                      )}
                    </div>

                    <span>
                      OP DIGITAL CREATIONS
                    </span>
                  </div>

                  {/* PROJECT CONTENT */}

                  <div className="work-project-content">
                    <span className="work-project-label">
                      PROJECT
                    </span>

                    <h2>
                      {project.title}
                    </h2>

                    <p>
                      {project.description}
                    </p>

                    {Array.isArray(
                      project.techStack
                    ) &&
                      project.techStack.length >
                        0 && (
                        <div className="work-project-tech">
                          {project.techStack.map(
                            (tech, index) => (
                              <span
                                key={`${tech}-${index}`}
                              >
                                {tech}
                              </span>
                            )
                          )}
                        </div>
                      )}
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* =====================================
          CTA
      ===================================== */}

      <CTA />
    </>
  );
}