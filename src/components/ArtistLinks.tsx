import { Link } from "react-router-dom";

interface Props {
  artists: { id: string; name: string }[];
  linkClass?: string;
}

export const ArtistLinks = ({ artists, linkClass }: Props) => (
  <span>
    {artists.map(({ id, name }, i) => (
      <span key={id}>
        {i !== 0 && ", "}
        <Link className={linkClass} to={`/artists/${id}`}>
          {name}
        </Link>
      </span>
    ))}
  </span>
);
