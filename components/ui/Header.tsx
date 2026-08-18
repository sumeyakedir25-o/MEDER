 "use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bookmark,
  Menu,
  Search,
  Sparkles,
  X,
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="MEDER home"
          className="shrink-0 font-serif text-2xl font-semibold tracking-[0.08em] text-[#D4AF37] transition hover:text-[#E5C158]"
        >
          MEDER
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          <Link
            href="/discover"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Discover
          </Link>

          <Link
            href="/meder-it"
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-[#D4AF37]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            Meder IT
          </Link>

          <Link
            href="/categories"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Categories
          </Link>

          <Link
            href="/near-me"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Near Me
          </Link>

          <Link
            href="/for-business"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            For Business
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-[#D4AF37]"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Link
            href="/favorites"
            aria-label="Saved places"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/5 hover:text-[#D4AF37]"
          >
            <Bookmark className="h-4 w-4" />
          </Link>

          <Link
            href="/sign-in"
            className="ml-2 rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/5 hover:text-[#D4AF37]"
          >
            <Search className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/5 hover:text-[#D4AF37]"
 >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-white/10 bg-black/95 px-4 pb-5 pt-3 backdrop-blur-md lg:hidden"
        >
          <div className="flex flex-col gap-1">
            <Link
              href="/discover"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              Discover
            </Link>

            <Link
              href="/meder-it"
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-3 text-sm font-semibold text-black"
            >
              <Sparkles className="h-4 w-4" />
              Meder IT
            </Link>

            <Link
              href="/categories"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              Categories
            </Link>

            <Link
              href="/near-me"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              Near Me
            </Link>

            <Link
              href="/for-business"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              For Business
            </Link>

            <div className="my-2 h-px bg-white/10" />

            <Link
              href="/favorites"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              <Bookmark className="h-4 w-4" />
              Saved Places
            </Link>

            <Link
              href="/sign-in"
              onClick={closeMenu}
              className="mt-1 rounded-full bg-[#D4AF37] px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-[#E5C158]"
            >
              Sign In
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}