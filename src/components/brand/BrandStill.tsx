import Image from "next/image";

/** James's official static logo. Not a reconstructed coil. */
export const BRAND_MARK = "/brand/creative-control-mark.png";

export function BrandStill({
  className = "",
  decorative = false,
  priority = false,
}: {
  className?: string;
  decorative?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src={BRAND_MARK}
      alt={decorative ? "" : "Creative Control"}
      width={640}
      height={640}
      className={className}
      draggable={false}
      priority={priority}
    />
  );
}
