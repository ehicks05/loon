import superFetch from "@/common/SuperFetch";
import { trpc } from "@/utils/trpc";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

import { FaUserCircle } from "react-icons/fa";
import { FaBars, FaXmark } from "react-icons/fa6";
import { Link, useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const navigation = [
  { name: "Search", href: "/search" },
  { name: "Library", href: "/library" },
  { name: "Artists", href: "/artists" },
  { name: "Albums", href: "/albums" },
];

export default function Navbar() {
  const utils = trpc.useUtils();
  const { data: user } = trpc.misc.me.useQuery();
  const { pathname } = useLocation();
  const history = useHistory();

  async function handleLogout() {
    await superFetch("/logout", { method: "POST" });
    utils.invalidate();
    history.push("/");
  }

  const isAdmin = user?.isAdmin;

  return (
    <Disclosure as="nav" className="bg-green-600">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-green-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset">
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
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                src="/images/loon.png"
                className="h-8 w-auto invert"
                alt="Loon"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={twMerge(
                      pathname === item.href
                        ? "bg-green-900 text-white"
                        : "text-gray-100 hover:bg-green-800 hover:text-white",
                      "rounded-md px-3 py-2 font-medium text-sm",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="-inset-1.5 absolute" />
                  <span className="sr-only">Open user menu</span>
                  <FaUserCircle className="h-8 w-8 rounded-full text-neutral-100" />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-neutral-800 py-1 shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {isAdmin && (
                  <>
                    <div className="px-4 py-2 text-neutral-500">Admin</div>
                    {adminMenuItems.map(({ to, label }) => (
                      <MenuItem key={to}>
                        <Link
                          to={to}
                          className="block px-4 py-2 text-sm data-[focus]:bg-neutral-900"
                        >
                          {label}
                        </Link>
                      </MenuItem>
                    ))}
                  </>
                )}
                <div className="px-4 py-2 text-neutral-500">Settings</div>
                {userMenuItems.map(({ to, label }) => (
                  <MenuItem key={to}>
                    <Link
                      to={to}
                      className="block px-4 py-2 text-sm data-[focus]:bg-neutral-900"
                    >
                      {label}
                    </Link>
                  </MenuItem>
                ))}

                <div className="px-4 py-2 text-neutral-500">Auth Status</div>
                {user && (
                  <MenuItem>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 block text-sm data-[focus]:bg-neutral-900"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                )}

                {!user && (
                  <MenuItem>
                    <Link
                      to="/login"
                      className="w-full text-left px-4 py-2 block text-sm data-[focus]:bg-neutral-900"
                    >
                      Sign in
                    </Link>
                  </MenuItem>
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={twMerge(
                pathname === item.href
                  ? "bg-green-900 text-white"
                  : "text-gray-100 hover:bg-green-800 hover:text-white",
                "block rounded-md px-3 py-2 font-medium text-base",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

const userMenuItems = [
  {
    to: "/settings/general",
    label: "General",
  },
  {
    to: "/settings/eq",
    label: "Equalizer",
  },
];
const adminMenuItems = [
  {
    to: "/admin/systemSettings",
    label: "Manage System",
  },
  {
    to: "/admin/users",
    label: "Manage Users",
  },
  {
    to: "/admin/about",
    label: "About Current Track",
  },
];
