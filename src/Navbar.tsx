import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import React, { useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { Link, useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import superFetch from "./common/SuperFetch";
import { useUserStore2 } from "./common/UserContextProvider";

const navigation = [
  { name: "Search", href: "/search", current: false },
  { name: "Library", href: "/library", current: false },
  { name: "Artists", href: "/artists", current: false },
  { name: "Albums", href: "/albums", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const user = useUserStore2((state) => state.user);
  const [isActive, setIsActive] = useState(false);

  const { pathname } = useLocation();
  const history = useHistory();

  function handleLogout() {
    superFetch("/logout", { method: "POST" }).then(() => {
      history.push("/");
    });
    return false;
  }

  const isAdmin = user.admin;

  return (
    <Disclosure as="nav" className="">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset">
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
                    className={classNames(
                      pathname === item.href
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
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
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="-inset-1.5 absolute" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="h-8 w-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-neutral-800 py-1 shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {isAdmin && (
                  <>
                    <div className="px-4 py-2 text-neutral-500">Admin</div>
                    <MenuItem>
                      <Link
                        to="/admin/systemSettings"
                        className="block px-4 py-2 text-sm data-[focus]:bg-neutral-900"
                      >
                        Manage System
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        to="/admin/users"
                        className="block px-4 py-2 text-sm data-[focus]:bg-neutral-900"
                      >
                        Manage Users
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        to="/admin/about"
                        className="block px-4 py-2 text-sm data-[focus]:bg-neutral-900"
                      >
                        About Current Track
                      </Link>
                    </MenuItem>
                  </>
                )}
                <div className="px-4 py-2 text-neutral-500">Settings</div>
                <MenuItem>
                  <Link
                    to="/settings/general"
                    className="block px-4 py-2 text-sm data-[focus]:bg-neutral-900"
                  >
                    General
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/settings/eq"
                    className="block px-4 py-2 text-sm data-[focus]:bg-neutral-900"
                  >
                    Equalizer
                  </Link>
                </MenuItem>

                <div className="px-4 py-2 text-neutral-500">Auth Status</div>
                <MenuItem>
                  <a
                    href="/"
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm data-[focus]:bg-neutral-900"
                  >
                    Sign out
                  </a>
                </MenuItem>
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
              className={classNames(
                pathname === item.href
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
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
