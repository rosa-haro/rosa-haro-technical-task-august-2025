import { useId, type ReactNode } from "react";

/**
 * Generic empty state presenter.
 *
 * Responsibilities:
 * - Shows a title (required), optional description and optional action (e.g. button).
 * - Intended for "no data" cases (e.g., no repos found).
 *
 * Accessibility:
 * - Uses `<section aria-labelledby>` to tie heading and section
 */

/**
 * Props for EmptyStateComponent.
 *
 * @property {string} title - Main message to display.
 * @property {string} [description] - Secondary explanatory text.
 * @property {ReactNode} [action] - Optional CTA (button/link).
 * @property {string} [className] - Optional extra CSS classes.
 */

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

/**
 * EmptyStateComponent
 *
 * @example
 * <EmptyStateComponent
 *   title="No repositories match your filters."
 *   description="Try adjusting the filters."
 * />
 */

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
