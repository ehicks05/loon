import { FaSpinner } from 'react-icons/fa6';

export const PageLoader = () => (
	<div className="h-dvh w-dvw flex items-center justify-center bg-neutral-950">
		<FaSpinner color="#44CC44" size={48} className="animate-spin" />
	</div>
);
