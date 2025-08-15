import { useId, type ReactNode } from "react";

/**
 * EmptyStateComponent — generic empty state presenter.
 *
 * Accessibility:
 * - Uses <section aria-labelledby=...> so screen readers announce the title.
 *
 * Props:
 * - title: main message (e.g., "User not found").
 * - description: optional secondary text.
 * - action: optional CTA (button/link) rendered after the text.
 * - className: for styling.
 */
type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

const EmptyStateComponent = ({
  title,
  description,
  action,
  className,
}: Props) => {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className={className}>
      <h3 id={titleId}>{title}</h3>
      {description ? <p>{description}</p> : null}
      {action ? <div>{action}</div> : null}
    </section>
  );
};

export default EmptyStateComponent;
