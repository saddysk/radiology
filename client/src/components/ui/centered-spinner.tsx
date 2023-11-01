import { CSSProperties } from "react";
import { CircleLoader, PacmanLoader, PropagateLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

function CenteredSpinner({
  loaderType = "propagate",
  size = 14,
  color,
  text,
}: {
  loaderType?: "circle" | "pacman" | "propagate";
  size?: number;
  color?: string;
  text?: string;
}) {
  const Loader =
    loaderType === "pacman"
      ? PacmanLoader
      : loaderType === "propagate"
      ? PropagateLoader
      : CircleLoader;
  return (
    <div className="flex flex-col justify-center align-middle w-full">
      <Loader
        color={color || `#ffffff`}
        loading={true}
        cssOverride={override}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
        className="mx-auto"
      />
      {text && (
        <div className="w-full  text-blue-950 flex justify-center mt-4">
          <p className="text-md">{text}</p>
        </div>
      )}
    </div>
  );
}

export default CenteredSpinner;
