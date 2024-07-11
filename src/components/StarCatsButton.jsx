/* eslint-disable react/prop-types */
export default function StarCatsButton({ onClick, children, type = "button" }) {
  return (
    <button type={type} className="btn-component" onClick={onClick}>
      {children}
    </button>
  );
}
