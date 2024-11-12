"use client";
import { useState } from 'react';
import useAuthStore from "@/stores/auth-store";
import Link from 'next/link';
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  if(pathname.startsWith('/admin')){
    setIsAdmin(true)
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    clearAuth(); // Clear the authentication state
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold">
          <Link href="/">
            event
          </Link>
        </div>

        <div className="md:hidden ml-auto">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none"
            aria-label="Open navigation menu"
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } absolute top-0 left-0 w-full bg-white md:static md:flex md:items-center md:space-x-8 py-6 md:py-2`}
        >
          <div className="flex justify-between items-center w-full p-4 md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none ml-auto"
              aria-label="Close navigation menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col text-left space-y-4 pl-8 md:flex-row md:space-y-0 md:space-x-8 md:items-center md:text-right">
            {!isAdmin ? (
              <>
                <Link
                  className="block py-2 text-gray-700 hover:text-green-500 font-semibold"
                  href="/"
                >
                  Home
                </Link>
                <Link
                  className="block py-2 text-gray-700 hover:text-green-500 font-semibold"
                  href="/services"
                >
                  Services
                </Link>
                <Link
                  className="block py-2 text-gray-700 hover:text-green-500 font-semibold"
                  href="/about-us"
                >
                  About Us
                </Link>
                <Link
                  className="block py-2 text-gray-700 hover:text-green-500 font-semibold"
                  href="/teams"
                >
                  Teams
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="block py-2 text-gray-700 hover:text-green-500 font-semibold"
                  href="/teams"
                >
                  Event
                </Link>
              </>
            )}

          <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user?.fullname}</span>
                {/* <button
                  onClick={() => {
                    clearAuth();
                    router.push("/");
                  }}
                  className="py-2 px-4 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button> */}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
