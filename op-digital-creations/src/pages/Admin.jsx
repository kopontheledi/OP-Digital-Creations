import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  LogIn,
  LogOut,
  Mail,
  Phone,
  Trash2,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Pencil,
  Plus,
  Users,
} from "lucide-react";

import { auth, db } from "../lib/firebase";

import {
  addProject,
  deleteProject,
  updateProject,
} from "../lib/projects";

export default function Admin() {
  // =========================================
  // AUTH
  // =========================================

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // =========================================
  // QUOTES
  // =========================================

  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);

  // =========================================
  // PROJECTS
  // =========================================

  const [projects, setProjects] = useState([]);

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    techStack: "",
  });

  const [editingProject, setEditingProject] = useState(null);
  const [savingProject, setSavingProject] = useState(false);

  // =========================================
  // TEAM
  // =========================================

  const [teamMembers, setTeamMembers] = useState([]);

  const [teamForm, setTeamForm] = useState({
    name: "",
    role: "",
    department: "Web Development",
  });

  const [editingTeamMember, setEditingTeamMember] =
    useState(null);

  const [savingTeamMember, setSavingTeamMember] =
    useState(false);

  // =========================================
  // INITIALS
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
  // AUTH LISTENER
  // =========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setCheckingAuth(false);
      }
    );

    return unsubscribe;
  }, []);

  // =========================================
  // LOAD QUOTES
  // =========================================

  useEffect(() => {
    if (!user) {
      setQuotes([]);
      setLoadingQuotes(false);
      return;
    }

    setLoadingQuotes(true);

    const quotesQuery = query(
      collection(db, "quotes"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      quotesQuery,

      (snapshot) => {
        const data = snapshot.docs.map(
          (quoteDoc) => ({
            id: quoteDoc.id,
            ...quoteDoc.data(),
          })
        );

        setQuotes(data);
        setLoadingQuotes(false);
      },

      (error) => {
        console.error(
          "Error loading quotes:",
          error
        );

        setLoadingQuotes(false);
      }
    );

    return unsubscribe;
  }, [user]);

  // =========================================
  // LOAD PROJECTS
  // =========================================

  useEffect(() => {
    if (!user) {
      setProjects([]);
      return;
    }

    const projectsQuery = query(
      collection(db, "projects"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      projectsQuery,

      (snapshot) => {
        const data = snapshot.docs.map(
          (projectDoc) => ({
            id: projectDoc.id,
            ...projectDoc.data(),
          })
        );

        setProjects(data);
      },

      (error) => {
        console.error(
          "Error loading projects:",
          error
        );
      }
    );

    return unsubscribe;
  }, [user]);

  // =========================================
  // LOAD TEAM
  // =========================================

  useEffect(() => {
    if (!user) {
      setTeamMembers([]);
      return;
    }

    const teamQuery = query(
      collection(db, "team"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      teamQuery,

      (snapshot) => {
        const data = snapshot.docs.map(
          (teamDoc) => ({
            id: teamDoc.id,
            ...teamDoc.data(),
          })
        );

        setTeamMembers(data);
      },

      (error) => {
        console.error(
          "Error loading team:",
          error
        );
      }
    );

    return unsubscribe;
  }, [user]);

  // =========================================
  // LOGIN
  // =========================================

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoginError("");
    setLoggingIn(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setLoginError(
        "Incorrect email or password. Please try again."
      );
    } finally {
      setLoggingIn(false);
    }
  };

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  // =========================================
  // QUOTE STATUS
  // =========================================

  const updateQuoteStatus = async (
    quoteId,
    status
  ) => {
    try {
      await updateDoc(
        doc(db, "quotes", quoteId),
        {
          status,
        }
      );
    } catch (error) {
      console.error(
        "Error updating quote:",
        error
      );

      alert(
        "Could not update this enquiry."
      );
    }
  };

  // =========================================
  // DELETE QUOTE
  // =========================================

  const handleDeleteQuote = async (
    quoteId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, "quotes", quoteId)
      );
    } catch (error) {
      console.error(
        "Error deleting quote:",
        error
      );

      alert(
        "Could not delete this enquiry."
      );
    }
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "Just now";
    }

    try {
      return timestamp
        .toDate()
        .toLocaleString("en-ZA", {
          dateStyle: "medium",
          timeStyle: "short",
        });
    } catch {
      return "";
    }
  };

  // =========================================
  // PROJECT FORM
  // =========================================

  const handleProjectChange = (event) => {
    const { name, value } = event.target;

    setProjectForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: "",
      description: "",
      techStack: "",
    });

    setEditingProject(null);
  };

  const handleProjectSubmit = async (
    event
  ) => {
    event.preventDefault();

    const isEditing = Boolean(
      editingProject
    );

    try {
      setSavingProject(true);

      const projectData = {
        title:
          projectForm.title.trim(),

        description:
          projectForm.description.trim(),

        techStack:
          projectForm.techStack
            .split(",")
            .map((tech) =>
              tech.trim()
            )
            .filter(Boolean),
      };

      if (isEditing) {
        await updateProject(
          editingProject.id,
          projectData
        );
      } else {
        await addProject(
          projectData
        );
      }

      resetProjectForm();

      alert(
        isEditing
          ? "Project updated successfully."
          : "Project added successfully."
      );
    } catch (error) {
      console.error(
        "Project save error:",
        error
      );

      alert(
        "Could not save the project."
      );
    } finally {
      setSavingProject(false);
    }
  };

  const handleEditProject = (
    project
  ) => {
    setEditingProject(project);

    setProjectForm({
      title:
        project.title || "",

      description:
        project.description || "",

      techStack:
        Array.isArray(
          project.techStack
        )
          ? project.techStack.join(
              ", "
            )
          : "",
    });

    setTimeout(() => {
      document
        .getElementById(
          "project-form"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  const handleDeleteProject = async (
    projectId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await deleteProject(
        projectId
      );

      if (
        editingProject?.id ===
        projectId
      ) {
        resetProjectForm();
      }
    } catch (error) {
      console.error(
        "Project delete error:",
        error
      );

      alert(
        "Could not delete the project."
      );
    }
  };

  // =========================================
  // TEAM FORM
  // =========================================

  const handleTeamChange = (event) => {
    const { name, value } = event.target;

    setTeamForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetTeamForm = () => {
    setTeamForm({
      name: "",
      role: "",
      department: "Web Development",
    });

    setEditingTeamMember(null);
  };

  const handleTeamSubmit = async (
    event
  ) => {
    event.preventDefault();

    const isEditing = Boolean(
      editingTeamMember
    );

    try {
      setSavingTeamMember(true);

      const memberData = {
        name:
          teamForm.name.trim(),

        role:
          teamForm.role.trim(),

        department:
          teamForm.department,
      };

      if (isEditing) {
        await updateDoc(
          doc(
            db,
            "team",
            editingTeamMember.id
          ),
          {
            ...memberData,
            updatedAt:
              serverTimestamp(),
          }
        );
      } else {
        await addDoc(
          collection(
            db,
            "team"
          ),
          {
            ...memberData,
            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),
          }
        );
      }

      resetTeamForm();

      alert(
        isEditing
          ? "Team member updated successfully."
          : "Team member added successfully."
      );
    } catch (error) {
      console.error(
        "Team save error:",
        error
      );

      alert(
        "Could not save the team member."
      );
    } finally {
      setSavingTeamMember(false);
    }
  };

  const handleEditTeamMember = (
    member
  ) => {
    setEditingTeamMember(member);

    setTeamForm({
      name:
        member.name || "",

      role:
        member.role || "",

      department:
        member.department ||
        "Web Development",
    });

    setTimeout(() => {
      document
        .getElementById(
          "team-form"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  const handleDeleteTeamMember = async (
    memberId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this team member?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(
          db,
          "team",
          memberId
        )
      );

      if (
        editingTeamMember?.id ===
        memberId
      ) {
        resetTeamForm();
      }
    } catch (error) {
      console.error(
        "Team delete error:",
        error
      );

      alert(
        "Could not delete this team member."
      );
    }
  };

  // =========================================
  // QUOTE COUNTS
  // =========================================

  const newQuotes = quotes.filter(
    (quote) =>
      !quote.status ||
      quote.status === "new"
  ).length;

  const contactedQuotes =
    quotes.filter(
      (quote) =>
        quote.status ===
        "contacted"
    ).length;

  const completedQuotes =
    quotes.filter(
      (quote) =>
        quote.status ===
        "completed"
    ).length;

  // =========================================
  // LOADING AUTH
  // =========================================

  if (checkingAuth) {
    return (
      <div className="admin-loading">
        Loading...
      </div>
    );
  }

  // =========================================
  // LOGIN
  // =========================================

  if (!user) {
    return (
      <main className="admin-login-page">

        <div className="admin-login-card">

          <div className="admin-login-brand">
            <img
              src="/Images/op-digital-creations-logo.png"
              alt="OP Digital Creations"
            />
          </div>

          <small>
            ADMIN PORTAL
          </small>

          <h1>
            Welcome back.
          </h1>

          <p>
            Sign in to manage enquiries,
            projects and your team.
          </p>

          <form
            onSubmit={handleLogin}
          >

            <label>
              Email

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="admin@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
            </label>

            {loginError && (
              <p className="admin-login-error">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="primary admin-login-button"
              disabled={loggingIn}
            >
              <LogIn size={18} />

              {loggingIn
                ? "Signing in..."
                : "Sign in"}
            </button>

          </form>

        </div>

      </main>
    );
  }

  // =========================================
  // DASHBOARD
  // =========================================

  return (
    <main className="admin-dashboard">

      {/* HEADER */}

      <header className="admin-header">

        <div>

          <small>
            OP DIGITAL CREATIONS
          </small>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage enquiries,
            portfolio projects and
            team members.
          </p>

        </div>

        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Sign out
        </button>

      </header>

      {/* STATS */}

      <section className="admin-stats">

        <div className="admin-stat-card">
          <span>
            Total enquiries
          </span>

          <strong>
            {quotes.length}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>New</span>

          <strong>
            {newQuotes}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Contacted</span>

          <strong>
            {contactedQuotes}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Completed</span>

          <strong>
            {completedQuotes}
          </strong>
        </div>

      </section>

      {/* =====================================
          ENQUIRIES
      ===================================== */}

      <section className="admin-enquiries">

        <div className="admin-section-heading">

          <div>
            <small>
              ENQUIRIES
            </small>

            <h2>
              Quotation requests
            </h2>
          </div>

          <span>
            {quotes.length}{" "}
            {quotes.length === 1
              ? "enquiry"
              : "enquiries"}
          </span>

        </div>

        {loadingQuotes ? (

          <div className="admin-empty">
            Loading enquiries...
          </div>

        ) : quotes.length === 0 ? (

          <div className="admin-empty">

            <Mail size={30} />

            <h3>
              No enquiries yet
            </h3>

            <p>
              New quotation requests
              will appear here.
            </p>

          </div>

        ) : (

          <div className="admin-quotes">

            {quotes.map(
              (quote) => (

                <article
                  className="admin-quote-card"
                  key={quote.id}
                >

                  <div className="admin-quote-top">

                    <div>

                      <span
                        className={`quote-status ${
                          quote.status ||
                          "new"
                        }`}
                      >
                        {quote.status ||
                          "new"}
                      </span>

                      <h3>
                        {quote.name}
                      </h3>

                      <span className="quote-date">
                        {formatDate(
                          quote.createdAt
                        )}
                      </span>

                    </div>

                    <button
                      type="button"
                      className="quote-delete"
                      onClick={() =>
                        handleDeleteQuote(
                          quote.id
                        )
                      }
                      title="Delete enquiry"
                    >
                      <Trash2
                        size={18}
                      />
                    </button>

                  </div>

                  <div className="quote-contact">

                    <a
                      href={`mailto:${quote.email}`}
                    >
                      <Mail
                        size={16}
                      />

                      {quote.email}
                    </a>

                    {quote.phone && (

                      <a
                        href={`tel:${quote.phone}`}
                      >
                        <Phone
                          size={16}
                        />

                        {quote.phone}
                      </a>

                    )}

                  </div>

                  <div className="quote-details">

                    <div>
                      <span>
                        Service
                      </span>

                      <strong>
                        {quote.service ||
                          "General enquiry"}
                      </strong>
                    </div>

                    {quote.budget && (
                      <div>
                        <span>
                          Budget
                        </span>

                        <strong>
                          {quote.budget}
                        </strong>
                      </div>
                    )}

                    {quote.timeline && (
                      <div>
                        <span>
                          Timeline
                        </span>

                        <strong>
                          {quote.timeline}
                        </strong>
                      </div>
                    )}

                  </div>

                  <div className="quote-message">

                    <span>
                      Message
                    </span>

                    <p>
                      {quote.message}
                    </p>

                  </div>

                  <div className="quote-actions">

                    <button
                      type="button"
                      onClick={() =>
                        updateQuoteStatus(
                          quote.id,
                          "new"
                        )
                      }
                      className={
                        !quote.status ||
                        quote.status ===
                          "new"
                          ? "active"
                          : ""
                      }
                    >
                      <Clock3
                        size={16}
                      />

                      New
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuoteStatus(
                          quote.id,
                          "contacted"
                        )
                      }
                      className={
                        quote.status ===
                        "contacted"
                          ? "active"
                          : ""
                      }
                    >
                      <Mail
                        size={16}
                      />

                      Contacted
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuoteStatus(
                          quote.id,
                          "completed"
                        )
                      }
                      className={
                        quote.status ===
                        "completed"
                          ? "active"
                          : ""
                      }
                    >
                      <CheckCircle2
                        size={16}
                      />

                      Completed
                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>

      {/* =====================================
          PROJECTS
      ===================================== */}

      <section className="admin-projects-section">

        <div className="admin-section-heading">

          <div>
            <small>
              OP DIGITAL CREATIONS
              PORTFOLIO
            </small>

            <h2>
              Projects
            </h2>
          </div>

          <span>
            {projects.length}{" "}
            {projects.length === 1
              ? "project"
              : "projects"}
          </span>

        </div>

        <div className="admin-project-layout">

          {/* PROJECT FORM */}

          <form
            id="project-form"
            className="admin-project-form"
            onSubmit={
              handleProjectSubmit
            }
          >

            <div className="admin-project-form-heading">

              {editingProject ? (
                <Pencil size={20} />
              ) : (
                <Plus size={20} />
              )}

              <h3>
                {editingProject
                  ? "Edit project"
                  : "Add a project"}
              </h3>

            </div>

            <label>
              Project name

              <input
                required
                type="text"
                name="title"
                value={
                  projectForm.title
                }
                onChange={
                  handleProjectChange
                }
                placeholder="MJ Bakery Delights"
              />
            </label>

            <div className="admin-project-initial-preview">

              <div className="project-initials">
                {getInitials(
                  projectForm.title
                )}
              </div>

              <div>
                <span>
                  PROJECT PREVIEW
                </span>

                <strong>
                  {projectForm.title ||
                    "Project name"}
                </strong>
              </div>

            </div>

            <label>
              Description

              <textarea
                required
                name="description"
                rows="6"
                value={
                  projectForm.description
                }
                onChange={
                  handleProjectChange
                }
                placeholder="Tell visitors about the project..."
              />
            </label>

            <label>
              Tech stack

              <input
                type="text"
                name="techStack"
                value={
                  projectForm.techStack
                }
                onChange={
                  handleProjectChange
                }
                placeholder="React, Firebase, CSS"
              />

              <small>
                Separate technologies
                with commas.
              </small>
            </label>

            <div className="admin-project-form-actions">

              <button
                className="primary"
                type="submit"
                disabled={
                  savingProject
                }
              >

                {savingProject ? (
                  "Saving..."
                ) : editingProject ? (
                  <>
                    <Pencil
                      size={17}
                    />
                    Save changes
                  </>
                ) : (
                  <>
                    <Plus
                      size={17}
                    />
                    Add project
                  </>
                )}

              </button>

              {editingProject && (
                <button
                  type="button"
                  className="secondary"
                  onClick={
                    resetProjectForm
                  }
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

          {/* PROJECT LIST */}

          <div className="admin-project-list">

            {projects.length === 0 ? (

              <div className="admin-empty">

                <FolderKanban
                  size={32}
                />

                <h3>
                  No projects yet
                </h3>

                <p>
                  Add your first
                  OP Digital Creations
                  project.
                </p>

              </div>

            ) : (

              projects.map(
                (project) => (

                  <article
                    key={project.id}
                    className="admin-project-card"
                  >

                    <div className="admin-project-placeholder">

                      <div className="project-initials">
                        {getInitials(
                          project.title
                        )}
                      </div>

                      <span>
                        OP DIGITAL CREATIONS
                      </span>

                    </div>

                    <div className="admin-project-card-content">

                      <h3>
                        {project.title}
                      </h3>

                      <p>
                        {project.description}
                      </p>

                      {Array.isArray(
                        project.techStack
                      ) &&
                        project.techStack
                          .length > 0 && (

                          <div className="admin-project-tech">

                            {project.techStack.map(
                              (
                                tech,
                                index
                              ) => (
                                <span
                                  key={`${tech}-${index}`}
                                >
                                  {tech}
                                </span>
                              )
                            )}

                          </div>

                        )}

                      <div className="admin-project-card-actions">

                        <button
                          type="button"
                          onClick={() =>
                            handleEditProject(
                              project
                            )
                          }
                        >
                          <Pencil
                            size={15}
                          />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() =>
                            handleDeleteProject(
                              project.id
                            )
                          }
                        >
                          <Trash2
                            size={15}
                          />
                          Delete
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )

            )}

          </div>

        </div>

      </section>

      {/* =====================================
          TEAM
      ===================================== */}

      <section className="admin-team-section">

        <div className="admin-section-heading">

          <div>
            <small>
              OUR TEAM
            </small>

            <h2>
              Team members
            </h2>
          </div>

          <span>
            {teamMembers.length}{" "}
            {teamMembers.length === 1
              ? "member"
              : "members"}
          </span>

        </div>

        <div className="admin-team-layout">

          {/* TEAM FORM */}

          <form
            id="team-form"
            className="admin-team-form"
            onSubmit={
              handleTeamSubmit
            }
          >

            <div className="admin-project-form-heading">

              {editingTeamMember ? (
                <Pencil
                  size={20}
                />
              ) : (
                <Plus
                  size={20}
                />
              )}

              <h3>
                {editingTeamMember
                  ? "Edit team member"
                  : "Add team member"}
              </h3>

            </div>

            <label>
              Full name

              <input
                type="text"
                name="name"
                value={
                  teamForm.name
                }
                onChange={
                  handleTeamChange
                }
                placeholder="Kopo Ntheledi"
                required
              />
            </label>

            <label>
              Role

              <input
                type="text"
                name="role"
                value={
                  teamForm.role
                }
                onChange={
                  handleTeamChange
                }
                placeholder="Web Developer"
                required
              />
            </label>

            <label>
              Department

              <select
                name="department"
                value={
                  teamForm.department
                }
                onChange={
                  handleTeamChange
                }
                required
              >
                <option value="Web Development">
                  Web Development
                </option>

                <option value="Social Media">
                  Social Media
                </option>
              </select>
            </label>

            {/* TEAM PREVIEW */}

            <div className="admin-team-preview">

              <div className="admin-team-avatar">
                {getInitials(
                  teamForm.name
                )}
              </div>

              <div>

                <strong>
                  {teamForm.name ||
                    "Team member"}
                </strong>

                <span>
                  {teamForm.role ||
                    "Role"}
                </span>

                <small>
                  {teamForm.department}
                </small>

              </div>

            </div>

            <div className="admin-project-form-actions">

              <button
                type="submit"
                className="primary"
                disabled={
                  savingTeamMember
                }
              >

                {savingTeamMember
                  ? "Saving..."
                  : editingTeamMember
                  ? "Save changes"
                  : "Add team member"}

              </button>

              {editingTeamMember && (

                <button
                  type="button"
                  className="secondary"
                  onClick={
                    resetTeamForm
                  }
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

          {/* TEAM LIST */}

          <div className="admin-team-list">

            {teamMembers.length === 0 ? (

              <div className="admin-empty">

                <Users size={32} />

                <h3>
                  No team members yet
                </h3>

                <p>
                  Add the first
                  OP Digital Creations
                  team member.
                </p>

              </div>

            ) : (

              teamMembers.map(
                (member) => (

                  <article
                    className="admin-team-card"
                    key={member.id}
                  >

                    <div className="admin-team-avatar">
                      {getInitials(
                        member.name
                      )}
                    </div>

                    <div className="admin-team-info">

                      <small>
                        {member.department}
                      </small>

                      <h3>
                        {member.name}
                      </h3>

                      <p>
                        {member.role}
                      </p>

                    </div>

                    <div className="admin-team-actions">

                      <button
                        type="button"
                        onClick={() =>
                          handleEditTeamMember(
                            member
                          )
                        }
                      >
                        <Pencil
                          size={15}
                        />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="danger"
                        onClick={() =>
                          handleDeleteTeamMember(
                            member.id
                          )
                        }
                      >
                        <Trash2
                          size={15}
                        />
                        Delete
                      </button>

                    </div>

                  </article>

                )
              )

            )}

          </div>

        </div>

      </section>

    </main>
  );
}