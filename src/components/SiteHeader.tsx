"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useClientTokenSnapshot } from "@/lib/useClientTokenSnapshot";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { hasToken: isAuthenticated } = useClientTokenSnapshot();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 md:h-16">
        <Link href="/" className="flex items-center">
          <Image src="/eig-logo.svg" alt="EIG" width={108} height={35} priority className="md:h-auto md:w-auto" />
        </Link>

        <div className="hidden items-center gap-5 text-sm font-medium text-slate-700 md:flex">
          <Link href="/#pourquoi">Pourquoi</Link>
          <Link href="/#qui">Qui peut devenir</Link>
          <Link href="/#comment">Comment ca marche</Link>
          <Link href="/#commissions">Commissions</Link>
          <Link href="/#avantages">Avantages</Link>
          <Link href="/formations">Formations</Link>
          <Link href="/contact">Contact</Link>
          {!isAuthenticated ? (
            <>
              <Link
                href="/partenaires/inscription"
                className="rounded-md bg-[#0b2e7a] px-3 py-2 text-white"
              >
                Rejoindre
              </Link>
              <Link href="/connexion" className="rounded-md border border-slate-300 px-3 py-2">
                Connexion
              </Link>
            </>
          ) : (
            <Link href="/dashboard" className="rounded-md bg-[#0b2e7a] px-3 py-2 text-white">
              Mon espace
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <Link href="/formations" onClick={() => setOpen(false)}>
              Formations
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>
            <Link href="/#pourquoi" onClick={() => setOpen(false)}>
              Pourquoi
            </Link>
            <Link href="/#qui" onClick={() => setOpen(false)}>
              Qui peut devenir
            </Link>
            <Link href="/#comment" onClick={() => setOpen(false)}>
              Comment ca marche
            </Link>
            <Link href="/#commissions" onClick={() => setOpen(false)}>
              Commissions
            </Link>
            <Link href="/#avantages" onClick={() => setOpen(false)}>
              Avantages
            </Link>
            <Link href="/#outils" onClick={() => setOpen(false)}>
              Outils
            </Link>
            <Link href="/#rejoindre" onClick={() => setOpen(false)}>
              Rejoindre
            </Link>
            <Link href="/#final" onClick={() => setOpen(false)}>
              Final
            </Link>
            {!isAuthenticated ? (
              <div className="mt-2 flex gap-2">
                <Link
                  href="/partenaires/inscription"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-[#0b2e7a] px-3 py-2 text-white"
                >
                  Rejoindre
                </Link>
                <Link
                  href="/connexion"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-slate-300 px-3 py-2"
                >
                  Connexion
                </Link>
              </div>
            ) : (
              <div className="mt-2">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="inline-flex rounded-md bg-[#0b2e7a] px-3 py-2 text-white"
                >
                  Mon espace
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
