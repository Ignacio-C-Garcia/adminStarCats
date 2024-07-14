/* eslint-disable react/prop-types */
import Spinner from "react-bootstrap/Spinner";
export default function StarCatsButton({
  onClick,
  children,
  type = "button",
  isLoading = false,
  className,
}) {
  return (
    <button
      type={type}
      className={`btn-component ${className}`}
      onClick={onClick}
    >
      {!isLoading && children}
      {isLoading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
