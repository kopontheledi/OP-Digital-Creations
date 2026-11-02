import EnquiryForm from "../components/EnquiryForm";
import PageHero from "../components/PageHero";

export default function Quote() {
  return (
    <>
      <PageHero
        tag="GET A QUOTE"
        title="Tell us what you want to build."
        text="Give us a little information about your project and we'll have what you need to prepare a tailored quotation."
      />

      <EnquiryForm quote />
    </>
  );
}