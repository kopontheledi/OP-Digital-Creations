import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db, firebaseConfigured } from "../lib/firebase";

export default function EnquiryForm({ quote = false }) {
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name")?.trim(),
      email: formData.get("email")?.trim(),
      phone: formData.get("phone")?.trim() || "",
      service:
        formData.get("service") || "General enquiry",
      budget:
        formData.get("budget") || "",
      timeline:
        formData.get("timeline") || "",
      message: formData.get("message")?.trim(),
    };

    // Check Firebase connection
    if (!firebaseConfigured || !db) {
      console.error(
        "Firebase is not configured correctly."
      );

      alert(
        "Firebase is not configured correctly. Please check your environment variables."
      );

      return;
    }

    try {
      setSubmitting(true);

      console.log(
        "Sending enquiry to Firestore:",
        payload
      );

      // Save enquiry to Firebase
      const docRef = await addDoc(
        collection(db, "quotes"),
        {
          ...payload,
          status: "new",
          createdAt: serverTimestamp(),
        }
      );

      console.log(
        "Enquiry saved successfully:",
        docRef.id
      );

      // Clear the form
      form.reset();

      // Redirect to thank-you page
      navigate("/thank-you");

    } catch (error) {
      console.error(
        "Firebase quote error:",
        error
      );

      console.error(
        "Firebase error code:",
        error?.code
      );

      console.error(
        "Firebase error message:",
        error?.message
      );

      alert(
        `We could not send your enquiry.\n\n${
          error?.message ||
          "Unknown Firebase error"
        }`
      );

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-wrap">
      <form onSubmit={handleSubmit}>

        <div className="form-grid">

          {/* NAME */}
          <label>
            Name

            <input
              required
              type="text"
              name="name"
              placeholder="Your name"
            />
          </label>

          {/* EMAIL */}
          <label>
            Email

            <input
              required
              type="email"
              name="email"
              placeholder="you@example.com"
            />
          </label>

          {/* PHONE */}
          <label>
            Phone

            <input
              type="tel"
              name="phone"
              placeholder="Your contact number"
            />
          </label>

          {/* SERVICE */}
          {quote && (
            <label>
              Service

              <select name="service">
                <option value="Business Website">
                  Business Website
                </option>

                <option value="E-commerce Website">
                  E-commerce Website
                </option>

                <option value="Custom Web App">
                  Custom Web App
                </option>

                <option value="Social Media Campaign">
                  Social Media Campaign
                </option>

                <option value="Google Analytics">
                  Google Analytics
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </label>
          )}

          {/* BUDGET */}
          {quote && (
            <label>
              Estimated budget

              <select name="budget">
                <option value="Under R3,000">
                  Under R3,000
                </option>

                <option value="R3,000 – R5,000">
                  R3,000 – R5,000
                </option>

                <option value="R5,000 – R10,000">
                  R5,000 – R10,000
                </option>

                <option value="R10,000+">
                  R10,000+
                </option>

                <option value="Not sure yet">
                  Not sure yet
                </option>
              </select>
            </label>
          )}

          {/* TIMELINE */}
          {quote && (
            <label>
              Preferred timeline

              <select name="timeline">
                <option value="As soon as possible">
                  As soon as possible
                </option>

                <option value="2–4 weeks">
                  2–4 weeks
                </option>

                <option value="1–2 months">
                  1–2 months
                </option>

                <option value="Flexible">
                  Flexible
                </option>
              </select>
            </label>
          )}

        </div>

        {/* MESSAGE */}
        <label>
          {quote
            ? "Tell us about your project"
            : "Message"}

          <textarea
            name="message"
            required
            rows="7"
            placeholder={
              quote
                ? "What does your business do? What pages or features do you need?"
                : "How can we help?"
            }
          />
        </label>

        {/* SUBMIT */}
        <button
          className="primary"
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? quote
              ? "Submitting request..."
              : "Sending..."
            : quote
            ? "Request my quote"
            : "Send message"}

          {!submitting && (
            <ArrowRight size={18} />
          )}
        </button>

      </form>
    </section>
  );
}