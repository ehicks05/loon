import { Link } from '@tanstack/react-router';

interface Props {
	artists: { id: string; name: string }[];
	linkClass?: string;
}

export const ArtistLinks = ({ artists, linkClass }: Props) => (
	<span>
		{artists.map(({ id, name }, i) => (
			<span key={id}>
				{i !== 0 && ', '}
				<Link className={linkClass} to="/artists/$id" params={{ id }}>
					{name}
				</Link>
			</span>
		))}
	</span>
);
