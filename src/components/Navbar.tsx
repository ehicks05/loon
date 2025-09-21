import { UserButton, type UserButtonProps } from '@daveyplate/better-auth-ui';
import { Link, useLocation } from '@tanstack/react-router';
import { Wrench } from 'lucide-react';
import { FaBars, FaXmark } from 'react-icons/fa6';
import { twMerge } from 'tailwind-merge';
import { authClient } from '@/lib/auth-client';

const navigation = [
	{ name: 'Search', href: '/search' },
	{ name: 'Library', href: '/library' },
	{ name: 'Artists', href: '/artists' },
	{ name: 'Albums', href: '/albums' },
];

const adminMenuItems = [
	{ href: '/admin', label: 'Manage System', icon: <Wrench /> },
];

export default function Navbar() {
	const { pathname } = useLocation();
	const { data: session } = authClient.useSession();
	const isAdmin = session?.user.role === 'admin';

	const additionalLinks: UserButtonProps['additionalLinks'] = [
		...(isAdmin ? adminMenuItems : []),
	];

	return (
		<div className="bg-neutral-900">
			<div className="mx-auto max-w-screen-2xl px-2 sm:px-6 lg:px-8">
				<div className="relative flex h-16 items-center justify-between">
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						{/* Mobile menu button*/}
						<button
							type="button"
							className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-neutral-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset"
						>
							<span className="-inset-0.5 absolute" />
							<span className="sr-only">Open main menu</span>
							<FaBars
								aria-hidden="true"
								className="block h-6 w-6 group-data-[open]:hidden"
							/>
							<FaXmark
								aria-hidden="true"
								className="hidden h-6 w-6 group-data-[open]:block"
							/>
						</button>
					</div>
					<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
						<div className="flex flex-shrink-0 items-center h-10">
							<img
								src="/images/document (14b).png"
								className="h-10 object-contain"
								alt="Loon"
							/>
						</div>
						<div className="hidden sm:ml-6 sm:flex items-center">
							<div className="flex space-x-4">
								{navigation.map((item) => (
									<Link
										key={item.name}
										to={item.href}
										aria-current={pathname === item.href ? 'page' : undefined}
										className={twMerge(
											pathname === item.href
												? 'bg-neutral-800 text-white'
												: 'text-gray-100 hover:bg-neutral-700 hover:text-white',
											'rounded-md px-3 py-2 font-medium text-sm',
										)}
									>
										{item.name}
									</Link>
								))}
							</div>
						</div>
					</div>
					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
						<UserButton
							size="icon"
							classNames={{ trigger: { base: 'bg-black' } }}
							disableDefaultLinks
							additionalLinks={additionalLinks}
						/>
					</div>
				</div>
			</div>

			<div className="sm:hidden">
				<div className="space-y-1 px-2 pt-2 pb-3">
					{navigation.map((item) => (
						<Link
							key={item.name}
							to={item.href}
							aria-current={pathname === item.href ? 'page' : undefined}
							className={twMerge(
								pathname === item.href
									? 'bg-neutral-800 text-white'
									: 'text-gray-100 hover:bg-neutral-700 hover:text-white',
								'block rounded-md px-3 py-2 font-medium text-base',
							)}
						>
							{item.name}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
