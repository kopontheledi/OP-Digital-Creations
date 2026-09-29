export default function Person({ name, role, initials }) {
  return (
    <div className="person">
      <div className="avatar">{initials}</div>
      <div>
        <h3>{name}</h3>
        <p>{role}</p>
      </div>
    </div>
  );
}
