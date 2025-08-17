import type { ReactNode } from "react";
import ErrorIcon from "../../assets/icons/error.svg?react";

/**
 * ErrorStateComponent — generic error presenter.
 *
 * Accessibility:
 * - Uses role="alert" so screen readers announce the message immediately.
 *
 * Props:
 * - message: error messaage to display (default: "Something went wrong.")
 * - action: optional React node (e.g., a Retry button/link).
 * - className: for styling.
 */
type Props = {
  message?: string;
  action?: ReactNode;
  className?: string;
};

const ErrorStateComponent = ({
  message = "Something went wrong.",
  action,
  className,
}: Props) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        "min-h-[60vh] grid place-items-center px-6 text-center",
        className ?? "",
      ].join(" ")}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-[color:var(--color-danger)]">
          <ErrorIcon className="h-8 w-8 fill-current" aria-hidden="true" />
        </div>
        <p className="text-[length:var(--font-h2)] text-[color:var(--color-muted)] max-w-md">
          {message}
        </p>
        {action ? (
          <div className="mt-2">
            <button type="button" className="button-secondary px-5 py-2">
              {action}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ErrorStateComponent;
