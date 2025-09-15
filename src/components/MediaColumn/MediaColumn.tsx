import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { PLACEHOLDER_IMAGE_URL } from '@/constants';
import { getTrackById } from '@/hooks/useLibraryStore';
import { setExpandMediaColumn, useUserStore } from '@/hooks/useUserStore';
import { trpc } from '@/utils/trpc';
import { Button } from '../Button';

export const Paragraphs = ({
	text,
	expanded,
}: {
	text?: string;
	expanded: boolean;
}) =>
	text
		?.split('\n')
		.filter((_, i) => expanded || i === 0)
		.filter((text) => !!text)
		.map((text) => {
			const i1 = text.indexOf('<a');
			const i2 = text.lastIndexOf('</a>') + 6;
			if (i1 === -1 || i2 === -1) return text;
			return text.slice(0, i1) + text.slice(i2, text.length - 1);
		})
		.map((p) => (
			<div
				key={p}
				className={`flex flex-col gap-1 ${expanded ? '' : 'line-clamp-6'}`}
			>
				{p}
			</div>
		));

const InfoBlock = ({
	image,
	name,
	content,
}: {
	image: string | null;
	name: string;
	content?: string;
}) => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="flex flex-col gap-2 items-center">
			<div className="w-64">
				<img
					src={image || PLACEHOLDER_IMAGE_URL}
					alt={name}
					className="rounded-lg"
				/>
			</div>
			<h1 className="text-lg text-center font-bold">{name}</h1>
			<div className="flex flex-col items-start gap-2 text-sm text-justify text-neutral-400">
				<Paragraphs text={content} expanded={expanded} />
				{content && (
					<Button onClick={() => setExpanded((expanded) => !expanded)}>
						{expanded ? 'Less' : 'More'}
					</Button>
				)}
			</div>
		</div>
	);
};

export const Content = () => {
	const selectedTrackId = useUserStore((state) => state.selectedTrackId);
	const track = getTrackById(selectedTrackId);
	const artist = track?.artists[0];
	const album = track?.album;

	const { data: artistInfo } = trpc.artist.info.useQuery(
		{ artist: artist?.name || '' },
		{ enabled: !!artist?.name },
	);

	const { data: albumInfo } = trpc.album.info.useQuery(
		{ artist: artist?.name || '', album: album?.name || '' },
		{ enabled: !!artist?.name && !!album?.name },
	);

	if (!track || !artist || !album) return 'Welcome!';

	return (
		<div className="flex flex-col gap-8">
			<InfoBlock
				image={artist.image}
				name={artist.name}
				content={artistInfo?.bio.content}
			/>
			<InfoBlock
				image={track.album.image}
				name={track.album.name}
				content={albumInfo?.wiki.content}
			/>
		</div>
	);
};

export const MediaColumn = () => {
	const expanded = useUserStore((state) => state.expandMediaColumn);

	const button = (
		<Button
			className="aspect-square"
			onClick={() => setExpandMediaColumn(!expanded)}
		>
			{expanded ? <FaMinus /> : <FaPlus />}
		</Button>
	);

	if (!expanded) {
		return <div className="w-min p-2">{button}</div>;
	}

	return (
		<div className="hidden xl:block flex-shrink-0 w-[28rem]">
			<div className="flex flex-col gap-2 items-center h-full p-4 bg-neutral-900 rounded-lg overflow-y-auto overflow-x-hidden">
				{button}
				{expanded && <Content />}
			</div>
		</div>
	);
};
