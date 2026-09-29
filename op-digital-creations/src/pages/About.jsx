import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import PageHero from "../components/PageHero";
import SectionTitle from "../components/SectionTitle";

import { db } from "../lib/firebase";

export default function About() {
  const [team, setTeam] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  // =========================================
  // CREATE INITIALS
  // =========================================

  const getInitials = (name = "") => {
    const words = name
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
  // LOAD TEAM FROM FIRESTORE
  // =========================================

  useEffect(() => {
    const teamQuery = query(
      collection(db, "team"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      teamQuery,

      (snapshot) => {
        const teamData = snapshot.docs.map(
          (teamDoc) => ({
            id: teamDoc.id,
            ...teamDoc.data(),
          })
        );

        setTeam(teamData);
        setLoadingTeam(false);
      },

      (error) => {
        console.error(
          "Error loading team:",
          error
        );

        setLoadingTeam(false);
      }
    );

    return unsubscribe;
  }, []);

  // =========================================
  // GROUP TEAM
  // =========================================

  const webTeam = team.filter(
    (member) =>
      member.department === "Web Development"
  );

  const socialTeam = team.filter(
    (member) =>
      member.department === "Social Media"
  );

  return (
    <>
      {/* =====================================
          PAGE HERO
      ===================================== */}

      <PageHero
        tag="ABOUT OP"
        title="A digital studio built with purpose — and a legacy in mind."
        text="OP stands for Oamogetswe Precious. The business combines development, design, campaigns and measurement while building something meaningful for the next generation."
      />

      {/* =====================================
          FOUNDER
      ===================================== */}

      <section className="founder">

        <div className="portrait">
          <img
            src="/Images/kopo-ntheledi-img.jpg"
            alt="Kopo Ntheledi - Founder of OP Digital Creations"
            className="founder-image"
          />
        </div>

        <div>

          <small>
            MESSAGE FROM OUR FOUNDER
          </small>

          <h2>
            Created for today.
            Built for her tomorrow.
          </h2>

          <p>
            I'm Kopo Ntheledi, founder of
            OP Digital Creations and a web
            developer. I named this business
            after my daughter, Oamogetswe
            Precious. I want the work I do
            today to become part of a
            foundation she can be proud of
            and, if she chooses, build on
            one day.
          </p>

          <p>
            That purpose shapes how I want
            OP Digital Creations to work:
            build responsibly, treat clients
            well, keep learning, and create
            digital solutions with genuine
            value rather than simply putting
            another website online.
          </p>

          <b>
            Kopo Ntheledi — Founder &
            Web Developer
          </b>

        </div>

      </section>

      {/* =====================================
          TEAM
      ===================================== */}

      <section className="soft">

        <SectionTitle
          eyebrow="OUR TEAM"
          title="The people behind the work."
        />

        {loadingTeam ? (

          <div className="team-loading">
            Loading our team...
          </div>

        ) : team.length === 0 ? (

          <div className="team-empty">

            <span>
              OP DIGITAL CREATIONS
            </span>

            <h3>
              Our team is growing.
            </h3>

            <p>
              Meet the people helping
              OP Digital Creations build,
              create and grow.
            </p>

          </div>

        ) : (

          <>
            {/* WEB DEVELOPMENT */}

            {webTeam.length > 0 && (
              <div className="team-department">

                <h3 className="team-heading">
                  Web Development
                </h3>

                <div className="team">

                  {webTeam.map(
                    (member) => (

                      <article
                        className="person"
                        key={member.id}
                      >

                        <div className="avatar">
                          {getInitials(
                            member.name
                          )}
                        </div>

                        <div>

                          <h3>
                            {member.name}
                          </h3>

                          <p>
                            {member.role}
                          </p>

                        </div>

                      </article>

                    )
                  )}

                </div>

              </div>
            )}

            {/* SOCIAL MEDIA */}

            {socialTeam.length > 0 && (
              <div className="team-department">

                <h3 className="team-heading">
                  Social Media
                </h3>

                <div className="team">

                  {socialTeam.map(
                    (member) => (

                      <article
                        className="person"
                        key={member.id}
                      >

                        <div className="avatar">
                          {getInitials(
                            member.name
                          )}
                        </div>

                        <div>

                          <h3>
                            {member.name}
                          </h3>

                          <p>
                            {member.role}
                          </p>

                        </div>

                      </article>

                    )
                  )}

                </div>

              </div>
            )}

          </>
        )}

      </section>
    </>
  );
}