import type { Node } from 'react-checkbox-tree';
import type { Track } from '@/types/library';

// expand the tree recursively until we expand a node with multiple children
const expandTree = (rootNode: Node, expandedIds: string[]) => {
	let node = rootNode;
	while (true) {
		expandedIds.push(node.value);

		const { children } = node;
		if (!children || children.length !== 1) {
			break;
		}
		node = children[0];
	}
};

const expandForest = (nodes: Node[]) => {
	const expandedIds: string[] = [];

	// each top-level node is a tree, we will expand one
	nodes.forEach((rootNode) => expandTree(rootNode, expandedIds));

	return expandedIds;
};

const SUPPORTED_MEDIA_TYPES = ['flac', 'mp3'];
const isLeaf = (input: string) =>
	SUPPORTED_MEDIA_TYPES.some((type) => input.endsWith(`.${type}`));

export const tracksToNodes = (tracks: Track[]) => {
	let nodes: Node[] = [];

	tracks.forEach((track) => {
		const { path } = track;
		const parts = path.split('/').slice(1);

		let partialPath = '';
		let parent: Node;
		parts.forEach((part, i) => {
			let node =
				i === 0
					? nodes.find((n) => n.value === part)
					: parent?.children?.find((c) => c.value === `${partialPath}/${part}`);

			if (!node) {
				const leaf = isLeaf(part);
				const value = leaf ? track.id : i === 0 ? part : `${partialPath}/${part}`;
				node = {
					label: part,
					value,
					children: leaf ? undefined : [],
				};
				if (parent) {
					parent.children = [...(parent?.children || []), node];
				} else {
					nodes = [...nodes, node];
				}
			}

			partialPath = `${partialPath}/${part}`;
			parent = node;
		});
	});

	const expandedIds = expandForest(nodes);
	return { nodes, expandedIds };
};
