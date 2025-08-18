import { ClipLoader } from "react-spinners";

/**
 * Generic loading indicator.
 *
 * Responsibilities:
 * - Shows a centered spinner (react-spinners/ClipLoader).
 * - Optionally displays a label (e.g. "Loading user and repositories...").
 *
 * Accessibility:
 * - Wrapper has `role="status"` so screen readers announce loading state.
 * - If `hideLabel` is true, label text is provided via `aria-label` instead.
 *
 * Notes:
 * - Spinner size and color are configurable via props.
 */

/**
 * Props for LoaderComponent.
 *
 * @property {string} [label="Loading..."] - Text label to show alongside the spinner.
 * @property {number} [size=40] - Size of the spinner in pixels.
 * @property {string} [color="currentColor"] - Spinner color.
 * @property {string} [className] - Optional extra CSS classes.
 * @property {boolean} [hideLabel=false] - If true, hides label visually but keeps it accessible.
 */

type Props = {
  label?: string;
  size?: number;
  color?: string;
  className?: string;
  hideLabel?: boolean;
};

/**
 * LoaderComponent
 * 
 * @example
 * <LoaderComponent label="Loading repositories..." />
 * 
 */

const LoaderComponent = ({
  label = "Loading...",
  size = 40,
  color = "currentColor",
  className,
  hideLabel = false,
}: Props) => {
  return (
    <div
      role="status"
      aria-label={hideLabel ? label : undefined}
      className={["min-h-[40vh] grid place-items-center", className ?? ""].join(
        " "
      )}
    >
      <div className="flex flex-col items-center gap-4 text-[color:var(--color-muted)]">
        <ClipLoader size={size} color={color} />
        {!hideLabel && (
          <span className="text-[length:var(--font-h2)]">{label}</span>
        )}
      </div>
    </div>
  );
};

export default LoaderComponent;
