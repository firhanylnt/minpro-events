"use client";
import useAuthStore from "@/stores/auth-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center bg-white">
      {/* Logo */}
      <div className="flex justify-between items-center w-full md:w-auto">
        <button onClick={() => router.push("/")} className="text-xl font-bold text-orange-500">
          EventYuk!
        </button>
        {/* Hamburger Button */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:flex flex-col md:flex-row md:gap-4 items-center`}
      >

        {user?.role === 1 ? (
          <>
            <Link href={'/admin/events'}>Event</Link>
            <Link href={'/admin/report'}>Report</Link>
          </>
        ) : (
          <>
            <Link href={'/event'}>Event</Link>
            <Link href={'/faq'}>FAQ</Link>
            <Link href={'/my-order'}>My Order</Link>
          </>
        )}
        
        {user ? (
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <button
              className="text-black"
              onClick={() => {
                clearAuth();
                router.push("/login");
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <Link href={'/login'}>Login</Link>
            <Link href={'/register'}>Register</Link>
          </div>
        )}
      </div>
    </div>
  );
}
