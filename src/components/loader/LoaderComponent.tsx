import { ClipLoader } from "react-spinners";

type Props = {
  /** Label: Text announced to screen readers (and optionally shown). */
  label?: string;
  size?: number;
  color?: string;
  className?: string;
  hideLabel?: boolean;
}
const LoaderComponent = ({
  label = "Loading",
  size = 20,
  color = "currentColor",
  className,
  hideLabel = false,
}: Props) => {
  return (
    <div role="status"
    aria-label={hideLabel ? label : undefined}
    className={className}
    >
      <ClipLoader size={size} color={color} />
    </div>
  )
}

export default LoaderComponent