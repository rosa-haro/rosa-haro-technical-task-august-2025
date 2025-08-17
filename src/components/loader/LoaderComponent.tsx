import { ClipLoader } from "react-spinners";

type Props = {
  label?: string;
  size?: number;
  color?: string;
  className?: string;
  hideLabel?: boolean;
}
const LoaderComponent = ({
  label = "Loading",
  size = 40,
  color = "currentColor",
  className,
  hideLabel = false,
}: Props) => {
  return (
    <div role="status"
    aria-label={hideLabel ? label : undefined}
    className={["min-h-[40vh] grid place-items-center", className ?? "",].join(" ")}
    >
      <div className="flex flex-col items-center gap-4 text-[color:var(--color-muted)]">

      <ClipLoader size={size} color={color} />
      {!hideLabel && (
        <span className="text-[length:var(--font-h2)]">{label}</span>
      )}
      </div>
    </div>
  )
}

export default LoaderComponent