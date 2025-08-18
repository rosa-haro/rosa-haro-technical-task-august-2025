import type { ReactNode } from "react";
import ErrorIcon from "../../assets/icons/error.svg?react";

/**
 * Generic error message presenter.
 *
 * Responsibilities:
 * - Displays an error icon, message text, and an optional action (button/link).
 * - Styled to appear centered and prominent.
 *
 * Accessibility:
 * - Root has `role="alert"` with `aria-live="assertive"`, so the message is
 *   announced immediately by screen readers.
 */

/**
 * Props for ErrorStateComponent.
 *
 * @property {string} [message="Something went wrong."] - Error message to display.
 * @property {ReactNode} [action] - Optional action, e.g. a Retry button or Back link.
 * @property {string} [className] - Optional extra CSS classes.
 */

type Props = {
  message?: string;
  action?: ReactNode;
  className?: string;
};

/**
 * ErrorStateComponent
 *
 * @example
 * <ErrorStateComponent
 *   message="Failed to load user data and repositories."
 *   action={<Link to="/">Back to search</Link>}
 * />
 */

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
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </div>
  );
};

export default ErrorStateComponent;
