import { PLACEHOLDER_IMAGE_URL } from "@/constants";
import type { Track } from "@/types/trpc";
import ActionMenu from "./ActionMenu";

interface Props {
  src: string;
  tracks: Track[];
}

export const ActionableImage = ({ src, tracks }: Props) => (
  <div className="group relative flex-shrink-0 w-full">
    <img
      src={PLACEHOLDER_IMAGE_URL}
      data-src={src}
      alt="pic"
      className="lazyload rounded-lg w-full aspect-square object-cover"
    />
    <div className="invisible group-hover:visible absolute top-2 right-2">
      <ActionMenu tracks={tracks} />
    </div>
  </div>
);
