import type { ReactNode } from "react";

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
  className
}: Props) => {
  return (
    <div role="alert" className={className}>
      <p>{message}</p>
    {action ? <div>{action}</div> : null}
    </div>
  )
}

export default ErrorStateComponent