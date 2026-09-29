export default function PageHero({ tag, title, text }) {
  return (
    <section className="page-hero">
      <small>{tag}</small>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}
