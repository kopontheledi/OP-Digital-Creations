export default function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="section-title">
      <small>{eyebrow}</small>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
