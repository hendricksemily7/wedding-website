"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { useEffect, useState } from "react";

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});

const adminLinks = [
  { href: "/admin/guests", label: "Guest Tracking" },
  { href: "/admin/vendors", label: "Vendors" },
  { href: "/admin/expenses", label: "Expenses" },
  { href: "/admin/tasks", label: "Tasks" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const storedAuth = sessionStorage.getItem("admin_authenticated");
    setIsAuthenticated(storedAuth === "true");
    setCheckingAuth(false);
  }, []);

  const handlePinSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPinError("");
    setVerifying(true);

    try {
      const response = await fetch("/api/admin/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        setPinError("Invalid PIN");
        setPin("");
        return;
      }

      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
    } catch {
      setPinError("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
    setPin("");
  };

  if (checkingAuth) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <p className="text-center text-gray-500">Loading admin...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f6]">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
          <h1 className={`${playfair.className} mb-2 text-center text-2xl font-medium text-[#2D4D3A]`}>
            Wedding Admin
          </h1>
          <p className="mb-6 text-center text-sm text-gray-600">
            Enter the PIN once to unlock the full admin workspace for this browser session.
          </p>
          <form onSubmit={handlePinSubmit}>
            <label htmlFor="pin" className="mb-2 block text-sm font-medium text-gray-700">
              Enter PIN
            </label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[#2D4D3A]"
              placeholder="••••"
              autoFocus
              disabled={verifying}
            />
            {pinError ? <p className="mt-3 text-center text-sm text-red-600">{pinError}</p> : null}
            <button
              type="submit"
              disabled={!pin || verifying}
              className="mt-5 w-full rounded-md bg-[#2D4D3A] px-4 py-2 text-white transition hover:bg-[#1e3428] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {verifying ? "Verifying..." : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6 rounded-3xl border border-[#d2dad5] bg-white/95 p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#6a7f72]">Wedding Admin</p>
            <h1 className={`${playfair.className} mt-2 text-3xl font-medium text-[#2D4D3A]`}>
              Planning workspace
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Separate routes for guests, vendors, expenses, and tasks with one shared PIN session.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md border border-[#d5ddd8] px-3 py-2 text-sm text-[#2D4D3A] transition hover:bg-[#f5f7f6]"
          >
            Lock admin
          </button>
        </div>

        <nav className="mt-5 flex flex-wrap gap-2">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-[#2D4D3A] text-white"
                    : "bg-[#eef2ef] text-[#355241] hover:bg-[#dfe8e2]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </div>
  );
}