"use client";

import { useState, useEffect, useRef } from "react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});

interface RSVP {
  attending: boolean;
  mealChoice?: string;
  dietaryNotes?: string;
  needsShuttle: boolean;
  attendingRehearsalDinner?: boolean;
  comments?: string;
  respondedAt: string;
}

interface Guest {
  id: string;
  name: string;
  isWeddingParty: boolean;
  rsvp?: RSVP;
}

interface Party {
  id: string;
  name: string;
  slug: string;
  guests: Guest[];
  createdAt: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for adding a new party
  const [newParty, setNewParty] = useState({ name: "", guestNames: [""] });
  const [addingParty, setAddingParty] = useState(false);
  
  // CSV upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Edit mode
  const [editingPartyId, setEditingPartyId] = useState<string | null>(null);
  const [editPartyForm, setEditPartyForm] = useState({ name: "" });
  
  // Adding guest to existing party
  const [addingGuestToPartyId, setAddingGuestToPartyId] = useState<string | null>(null);
  const [newGuestName, setNewGuestName] = useState("");

  // Editing guest RSVP
  const [editingRsvpGuestId, setEditingRsvpGuestId] = useState<string | null>(null);
  const [editRsvpForm, setEditRsvpForm] = useState({
    name: "",
    attending: true,
    mealChoice: "",
    dietaryNotes: "",
    needsShuttle: false,
  });

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Add Party Modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter
  type FilterType = "all" | "weddingParty" | "responded" | "attending" | "notAttending" | "needsShuttle" | "noResponse";
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const fetchParties = async () => {
    try {
      const res = await fetch("/api/rsvp");
      if (!res.ok) throw new Error("Failed to fetch parties");
      const data = await res.json();
      setParties(data.parties);
    } catch (err) {
      setError("Failed to load parties");
    } finally {
      setLoading(false);
    }
  };

  // Check if already authenticated (via sessionStorage)
  useEffect(() => {
    const storedAuth = sessionStorage.getItem("admin_authenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
      fetchParties();
    }
    setCheckingAuth(false);
  }, []);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    setVerifying(true);

    try {
      const res = await fetch("/api/admin/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        sessionStorage.setItem("admin_authenticated", "true");
        setIsAuthenticated(true);
        fetchParties();
      } else {
        setPinError("Invalid PIN");
        setPin("");
      }
    } catch (err) {
      setPinError("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleAddParty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParty.name.trim()) return;
    
    const guestNames = newParty.guestNames.filter(n => n.trim());
    if (guestNames.length === 0) {
      guestNames.push(newParty.name); // Use party name as guest name if none provided
    }
    
    setAddingParty(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newParty.name,
          guestNames,
        }),
      });
      
      if (!res.ok) throw new Error("Failed to add party");
      
      setNewParty({ name: "", guestNames: [""] });
      await fetchParties();
    } catch (err) {
      alert("Failed to add party");
    } finally {
      setAddingParty(false);
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const text = await file.text();
      const lines = text.split("\n").filter(line => line.trim());
      
      // Skip header row if it exists
      const startIndex = lines[0]?.toLowerCase().includes("name") ? 1 : 0;
      
      for (let i = startIndex; i < lines.length; i++) {
        const [partyName, guestNamesStr, weddingPartyStr] = lines[i].split(",").map(s => s.trim());
        if (!partyName) continue;
        
        // Guest names can be semicolon-separated within the CSV cell
        // Use asterisk (*) suffix OR third column to mark wedding party members
        const rawNames = guestNamesStr 
          ? guestNamesStr.split(";").map(n => n.trim()).filter(Boolean)
          : [partyName];
        
        // Parse wedding party column if provided (semicolon-separated: "yes;no" or "true;false" or "1;0")
        const weddingPartyValues = weddingPartyStr 
          ? weddingPartyStr.split(";").map(v => v.trim().toLowerCase())
          : [];
        
        const guestNames: string[] = [];
        const weddingPartyFlags: boolean[] = [];
        
        for (let j = 0; j < rawNames.length; j++) {
          const rawName = rawNames[j];
          // Check for asterisk suffix first, then fall back to third column
          const hasAsterisk = rawName.endsWith("*");
          const fromColumn = weddingPartyValues[j] === "yes" || weddingPartyValues[j] === "true" || weddingPartyValues[j] === "1";
          const isWeddingParty = hasAsterisk || fromColumn;
          
          guestNames.push(hasAsterisk ? rawName.slice(0, -1).trim() : rawName);
          weddingPartyFlags.push(isWeddingParty);
        }
        
        await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: partyName,
            guestNames,
            weddingPartyFlags,
          }),
        });
      }
      
      await fetchParties();
      alert("CSV imported successfully!");
    } catch (err) {
      alert("Failed to import CSV");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteParty = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the entire party "${name}"?`)) return;
    
    try {
      const res = await fetch(`/api/admin/guests/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchParties();
    } catch (err) {
      alert("Failed to delete party");
    }
  };

  const handleDeleteGuest = async (guestId: string, guestName: string, partyId: string) => {
    if (!confirm(`Are you sure you want to remove ${guestName} from this party?`)) return;
    
    try {
      const res = await fetch(`/api/admin/guests/${guestId}?type=guest`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchParties();
    } catch (err) {
      alert("Failed to delete guest");
    }
  };

  const handleDeleteAllParties = async () => {
    if (!confirm(`Are you sure you want to delete ALL ${totalParties} parties and ${totalGuests} guests? This cannot be undone.`)) return;
    
    try {
      for (const party of parties) {
        await fetch(`/api/admin/guests/${party.id}`, { method: "DELETE" });
      }
      await fetchParties();
    } catch (err) {
      alert("Failed to delete all parties");
    }
  };

  const startEditingParty = (party: Party) => {
    setEditingPartyId(party.id);
    setEditPartyForm({
      name: party.name,
    });
  };

  const handleUpdateParty = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/guests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editPartyForm),
      });
      if (!res.ok) throw new Error("Failed to update");
      setEditingPartyId(null);
      await fetchParties();
    } catch (err) {
      alert("Failed to update party");
    }
  };

  const handleAddGuestToParty = async (partyId: string) => {
    if (!newGuestName.trim()) return;
    
    try {
      const res = await fetch(`/api/admin/guests/${partyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "addGuest", name: newGuestName }),
      });
      if (!res.ok) throw new Error("Failed to add guest");
      setAddingGuestToPartyId(null);
      setNewGuestName("");
      await fetchParties();
    } catch (err) {
      alert("Failed to add guest");
    }
  };

  const startEditingRsvp = (guest: Guest) => {
    setEditingRsvpGuestId(guest.id);
    setEditRsvpForm({
      name: guest.name,
      attending: guest.rsvp?.attending ?? true,
      mealChoice: guest.rsvp?.mealChoice || "",
      dietaryNotes: guest.rsvp?.dietaryNotes || "",
      needsShuttle: guest.rsvp?.needsShuttle ?? false,
    });
  };

  const handleUpdateRsvp = async (guestId: string, originalName: string) => {
    try {
      // Update guest name if changed
      if (editRsvpForm.name && editRsvpForm.name !== originalName) {
        const nameRes = await fetch(`/api/admin/guests/${guestId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "guestDetails",
            name: editRsvpForm.name,
          }),
        });
        if (!nameRes.ok) throw new Error("Failed to update guest name");
      }

      // Update RSVP
      const res = await fetch(`/api/admin/guests/${guestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "rsvp",
          attending: editRsvpForm.attending,
          mealChoice: editRsvpForm.attending && editRsvpForm.mealChoice ? editRsvpForm.mealChoice : undefined,
          dietaryNotes: editRsvpForm.dietaryNotes || undefined,
          needsShuttle: editRsvpForm.attending ? editRsvpForm.needsShuttle : false,
        }),
      });
      if (!res.ok) throw new Error("Failed to update RSVP");
      setEditingRsvpGuestId(null);
      await fetchParties();
    } catch (err) {
      alert("Failed to update");
    }
  };

  const getMealName = (choice?: string) => {
    const meals: Record<string, string> = {
      CHICKEN: "Lemon Chicken",
      PASTA: "Spinach Ravioli",
      SQUASH: "Stuffed Acorn Squash",
    };
    return choice ? meals[choice] || choice : "-";
  };

  // Stats
  const totalParties = parties.length;
  const totalGuests = parties.reduce((sum, p) => sum + p.guests.length, 0);
  const weddingPartyGuests = parties.reduce((sum, p) => sum + p.guests.filter(g => g.isWeddingParty).length, 0);
  const respondedGuests = parties.reduce((sum, p) => sum + p.guests.filter(g => g.rsvp).length, 0);
  const noResponseGuests = totalGuests - respondedGuests;
  const attendingGuests = parties.reduce((sum, p) => sum + p.guests.filter(g => g.rsvp?.attending).length, 0);
  const notAttendingGuests = parties.reduce((sum, p) => sum + p.guests.filter(g => g.rsvp && !g.rsvp.attending).length, 0);
  const needsShuttleGuests = parties.reduce((sum, p) => sum + p.guests.filter(g => g.rsvp?.needsShuttle).length, 0);

  // Apply filter function to guests
  const applyFilter = (guest: Guest): boolean => {
    switch (activeFilter) {
      case "weddingParty": return guest.isWeddingParty;
      case "responded": return !!guest.rsvp;
      case "noResponse": return !guest.rsvp;
      case "attending": return !!guest.rsvp?.attending;
      case "notAttending": return !!guest.rsvp && !guest.rsvp.attending;
      case "needsShuttle": return !!guest.rsvp?.needsShuttle;
      default: return true;
    }
  };

  // Filter parties based on search query and active filter
  const filteredParties = parties
    .map(party => ({
      ...party,
      guests: party.guests.filter(guest => {
        const matchesSearch = !searchQuery.trim() || 
          guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          party.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = applyFilter(guest);
        return matchesSearch && matchesFilter;
      })
    }))
    .filter(party => party.guests.length > 0 || 
      (!searchQuery.trim() && activeFilter === "all" && party.name.toLowerCase().includes(searchQuery.toLowerCase())));

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  // Show PIN entry if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f6]">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className={`${playfair.className} text-2xl font-medium text-[#2D4D3A] mb-6 text-center`}>
            Admin Access
          </h1>
          <form onSubmit={handlePinSubmit}>
            <div className="mb-4">
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                Enter PIN
              </label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D4D3A] focus:border-transparent text-center text-lg tracking-widest"
                placeholder="••••"
                autoFocus
                disabled={verifying}
              />
            </div>
            {pinError && (
              <p className="text-red-600 text-sm mb-4 text-center">{pinError}</p>
            )}
            <button
              type="submit"
              disabled={verifying || !pin}
              className="w-full bg-[#2D4D3A] text-white py-2 px-4 rounded-md hover:bg-[#1e3428] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying ? "Verifying..." : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <h1 className={`${playfair.className} text-3xl md:text-4xl font-medium text-[#2D4D3A] text-center`}>
          Guest Admin
        </h1>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
        <button
          onClick={() => setActiveFilter("all")}
          className={`rounded-lg p-4 text-center transition ${activeFilter === "all" ? "ring-2 ring-[#2D4D3A] bg-[#e8ebe9]" : "bg-[#f5f7f6] hover:bg-[#e8ebe9]"}`}
        >
          <p className="text-2xl font-bold text-[#2D4D3A]">{totalParties}</p>
          <p className="text-sm text-gray-600">Parties</p>
        </button>
        <button
          onClick={() => setActiveFilter("all")}
          className={`rounded-lg p-4 text-center transition ${activeFilter === "all" ? "ring-2 ring-[#2D4D3A] bg-[#e8ebe9]" : "bg-[#f5f7f6] hover:bg-[#e8ebe9]"}`}
        >
          <p className="text-2xl font-bold text-[#2D4D3A]">{totalGuests}</p>
          <p className="text-sm text-gray-600">Total Guests</p>
        </button>
        <button
          onClick={() => setActiveFilter(activeFilter === "weddingParty" ? "all" : "weddingParty")}
          className={`rounded-lg p-4 text-center transition ${activeFilter === "weddingParty" ? "ring-2 ring-purple-500 bg-purple-100" : "bg-purple-50 hover:bg-purple-100"}`}
        >
          <p className="text-2xl font-bold text-purple-700">{weddingPartyGuests}</p>
          <p className="text-sm text-gray-600">Wedding Party</p>
        </button>
        <button
          onClick={() => setActiveFilter(activeFilter === "responded" ? "all" : "responded")}
          className={`rounded-lg p-4 text-center transition ${activeFilter === "responded" ? "ring-2 ring-[#2D4D3A] bg-[#e8ebe9]" : "bg-[#f5f7f6] hover:bg-[#e8ebe9]"}`}
        >
          <p className="text-2xl font-bold text-[#2D4D3A]">{respondedGuests}</p>
          <p className="text-sm text-gray-600">Responded</p>
        </button>
        <button
          onClick={() => setActiveFilter(activeFilter === "attending" ? "all" : "attending")}
          className={`rounded-lg p-4 text-center transition ${activeFilter === "attending" ? "ring-2 ring-green-500 bg-green-100" : "bg-green-50 hover:bg-green-100"}`}
        >
          <p className="text-2xl font-bold text-green-700">{attendingGuests}</p>
          <p className="text-sm text-gray-600">Attending</p>
        </button>
        <button
          onClick={() => setActiveFilter(activeFilter === "notAttending" ? "all" : "notAttending")}
          className={`rounded-lg p-4 text-center transition ${activeFilter === "notAttending" ? "ring-2 ring-red-500 bg-red-100" : "bg-red-50 hover:bg-red-100"}`}
        >
          <p className="text-2xl font-bold text-red-700">{notAttendingGuests}</p>
          <p className="text-sm text-gray-600">Not Attending</p>
        </button>
        <button
          onClick={() => setActiveFilter(activeFilter === "needsShuttle" ? "all" : "needsShuttle")}
          className={`rounded-lg p-4 text-center transition ${activeFilter === "needsShuttle" ? "ring-2 ring-blue-500 bg-blue-100" : "bg-blue-50 hover:bg-blue-100"}`}
        >
          <p className="text-2xl font-bold text-blue-700">{needsShuttleGuests}</p>
          <p className="text-sm text-gray-600">Need Shuttle</p>
        </button>
      </div>

      {/* Active Filter Indicator */}
      {activeFilter !== "all" && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtered by:</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-sm font-medium">
            {activeFilter === "weddingParty" && "Wedding Party"}
            {activeFilter === "responded" && "Responded"}
            {activeFilter === "noResponse" && "No Response"}
            {activeFilter === "attending" && "Attending"}
            {activeFilter === "notAttending" && "Not Attending"}
            {activeFilter === "needsShuttle" && "Needs Shuttle"}
          </span>
          <button
            onClick={() => setActiveFilter("all")}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Add Party Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="mb-6 bg-[#2D4D3A] text-white px-4 py-2 rounded-md hover:bg-[#1f3528] transition flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Party
      </button>

      {/* Add Party Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#2D4D3A]">Add Party</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={(e) => { handleAddParty(e); setShowAddModal(false); }} className="space-y-4">
              <input
                type="text"
                placeholder="Party Name (e.g., 'The Smith Family') *"
                value={newParty.name}
                onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#2D4D3A]"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guest Names</label>
                {newParty.guestNames.map((name, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Guest ${index + 1} name`}
                      value={name}
                      onChange={(e) => {
                        const updated = [...newParty.guestNames];
                        updated[index] = e.target.value;
                        setNewParty({ ...newParty, guestNames: updated });
                      }}
                      className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#2D4D3A]"
                    />
                    {newParty.guestNames.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = newParty.guestNames.filter((_, i) => i !== index);
                          setNewParty({ ...newParty, guestNames: updated });
                        }}
                        className="text-red-600 hover:text-red-800 px-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setNewParty({ ...newParty, guestNames: [...newParty.guestNames, ""] })}
                  className="text-sm text-[#2D4D3A] hover:underline"
                >
                  + Add another guest
                </button>
              </div>
              
              <button
                type="submit"
                disabled={addingParty}
                className="w-full bg-[#2D4D3A] text-white px-6 py-2 rounded-md hover:bg-[#1f3528] transition disabled:opacity-50"
              >
                {addingParty ? "Adding..." : "Add Party"}
              </button>
            </form>

            {/* CSV Upload */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Or upload a CSV file:</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => { handleCSVUpload(e); setShowAddModal(false); }}
                disabled={uploading}
                className="text-sm"
              />
              {uploading && <span className="ml-2 text-sm text-gray-500">Uploading...</span>}
            </div>
          </div>
        </div>
      )}

      {/* Party List */}
      <div className="space-y-4">
        {totalParties > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <div className="flex-1 min-w-[200px] max-w-md">
              <input
                type="text"
                placeholder="Search guests or parties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:border-[#2D4D3A]"
              />
            </div>
            <button
              onClick={handleDeleteAllParties}
              className="text-sm text-red-600 hover:text-red-800 border border-red-300 px-3 py-1 rounded hover:bg-red-50 transition"
            >
              Delete All ({totalGuests} guests)
            </button>
          </div>
        )}
        {filteredParties.map((party) => (
          <div key={party.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Party Header */}
            <div className="bg-[#f5f7f6] px-4 py-3 flex flex-wrap items-center justify-between gap-2">
              {editingPartyId === party.id ? (
                <div className="flex flex-wrap gap-2 flex-1">
                  <input
                    type="text"
                    value={editPartyForm.name}
                    onChange={(e) => setEditPartyForm({ ...editPartyForm, name: e.target.value })}
                    className="border border-gray-300 rounded px-2 py-1"
                    placeholder="Party name"
                  />
                  <button
                    onClick={() => handleUpdateParty(party.id)}
                    className="text-green-600 hover:text-green-800 px-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPartyId(null)}
                    className="text-gray-600 hover:text-gray-800 px-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <span className="font-semibold text-[#2D4D3A]">{party.name}</span>
                    <span className="text-gray-500 text-sm ml-2">({party.guests.length} guest{party.guests.length !== 1 ? 's' : ''})</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAddingGuestToPartyId(party.id)}
                      className="text-[#2D4D3A] hover:underline text-sm"
                    >
                      + Add Guest
                    </button>
                    <button
                      onClick={() => startEditingParty(party)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteParty(party.id, party.name)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Add Guest Form */}
            {addingGuestToPartyId === party.id && (
              <div className="px-4 py-3 bg-blue-50 flex gap-2">
                <input
                  type="text"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="New guest name"
                  className="flex-1 border border-gray-300 rounded px-2 py-1"
                />
                <button
                  onClick={() => handleAddGuestToParty(party.id)}
                  className="bg-[#2D4D3A] text-white px-4 py-1 rounded hover:bg-[#1f3528]"
                >
                  Add
                </button>
                <button
                  onClick={() => { setAddingGuestToPartyId(null); setNewGuestName(""); }}
                  className="text-gray-600 hover:text-gray-800 px-2"
                >
                  Cancel
                </button>
              </div>
            )}
            
            {/* Guest Table */}
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-600">Guest Name</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Meal</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Shuttle</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Rehearsal</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Notes</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {party.guests.map((guest) => (
                  <tr key={guest.id} className="border-t border-gray-100 hover:bg-gray-50">
                    {editingRsvpGuestId === guest.id ? (
                      <>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={editRsvpForm.name}
                            onChange={(e) => setEditRsvpForm({ ...editRsvpForm, name: e.target.value })}
                            className="border border-gray-300 rounded px-2 py-1 text-sm font-medium w-full max-w-[150px]"
                          />
                          {guest.isWeddingParty && (
                            <span className="ml-2 px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">WP</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={editRsvpForm.attending ? "yes" : "no"}
                            onChange={(e) => setEditRsvpForm({ ...editRsvpForm, attending: e.target.value === "yes" })}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="yes">Attending</option>
                            <option value="no">Not Attending</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          {editRsvpForm.attending ? (
                            <select
                              value={editRsvpForm.mealChoice}
                              onChange={(e) => setEditRsvpForm({ ...editRsvpForm, mealChoice: e.target.value })}
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value="">Select meal</option>
                              <option value="CHICKEN">Lemon Chicken</option>
                              <option value="PASTA">Spinach Ravioli</option>
                              <option value="SQUASH">Stuffed Acorn Squash</option>
                            </select>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {editRsvpForm.attending ? (
                            <input
                              type="checkbox"
                              checked={editRsvpForm.needsShuttle}
                              onChange={(e) => setEditRsvpForm({ ...editRsvpForm, needsShuttle: e.target.checked })}
                              className="accent-[#2D4D3A]"
                            />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {guest.isWeddingParty ? (guest.rsvp?.attendingRehearsalDinner ? "Yes" : guest.rsvp?.attendingRehearsalDinner === false ? "No" : "-") : "-"}
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={editRsvpForm.dietaryNotes}
                            onChange={(e) => setEditRsvpForm({ ...editRsvpForm, dietaryNotes: e.target.value })}
                            placeholder="Dietary notes"
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-full max-w-[120px]"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleUpdateRsvp(guest.id, guest.name)}
                            className="text-green-600 hover:text-green-800 text-sm mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingRsvpGuestId(null)}
                            className="text-gray-600 hover:text-gray-800 text-sm"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2 font-medium">
                          {guest.name}
                          {guest.isWeddingParty && (
                            <span className="ml-2 px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">WP</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {guest.rsvp ? (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                guest.rsvp.attending
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {guest.rsvp.attending ? "Attending" : "Not Attending"}
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              No Response
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-gray-600 text-sm">{getMealName(guest.rsvp?.mealChoice)}</td>
                        <td className="px-4 py-2 text-gray-600">{guest.rsvp?.needsShuttle ? "Yes" : "-"}</td>
                        <td className="px-4 py-2 text-gray-600">
                          {guest.isWeddingParty ? (guest.rsvp?.attendingRehearsalDinner ? "Yes" : guest.rsvp?.attendingRehearsalDinner === false ? "No" : "-") : "-"}
                        </td>
                        <td className="px-4 py-2 text-gray-600 text-sm max-w-[150px] truncate">
                          {guest.rsvp?.dietaryNotes || guest.rsvp?.comments || "-"}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => startEditingRsvp(guest)}
                            className="text-gray-400 hover:text-gray-600 mr-3"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteGuest(guest.id, guest.name, party.id)}
                            className="text-gray-400 hover:text-red-500"
                            title="Remove"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        
        {parties.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
            No parties yet. Add your first party above!
          </div>
        )}
        
        {parties.length > 0 && filteredParties.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
            {searchQuery && activeFilter !== "all" 
              ? `No guests match "${searchQuery}" with the current filter`
              : searchQuery 
                ? `No guests or parties match "${searchQuery}"`
                : "No guests match the current filter"}
          </div>
        )}
      </div>
    </div>
  );
}
