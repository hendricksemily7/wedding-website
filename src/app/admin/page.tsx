"use client";

import { useState, useEffect, useRef } from "react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});

interface RSVP {
  attending: boolean;
  mealChoices?: string[];
  dietaryNotes?: string;
  needsShuttle: boolean;
  comments?: string;
  respondedAt: string;
}

interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  partySize: number;
  rsvp?: RSVP;
  createdAt: string;
}

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for adding a new guest
  const [newGuest, setNewGuest] = useState({ name: "", email: "", phone: "", partySize: 1 });
  const [addingGuest, setAddingGuest] = useState(false);
  
  // CSV upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", partySize: 1 });

  const fetchGuests = async () => {
    try {
      const res = await fetch("/api/rsvp");
      if (!res.ok) throw new Error("Failed to fetch guests");
      const data = await res.json();
      setGuests(data.guests);
    } catch (err) {
      setError("Failed to load guests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuest.name.trim()) return;
    
    setAddingGuest(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGuest),
      });
      
      if (!res.ok) throw new Error("Failed to add guest");
      
      setNewGuest({ name: "", email: "", phone: "", partySize: 1 });
      await fetchGuests();
    } catch (err) {
      alert("Failed to add guest");
    } finally {
      setAddingGuest(false);
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
        const [name, email, phone, partySize] = lines[i].split(",").map(s => s.trim());
        if (!name) continue;
        
        await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email: email || undefined,
            phone: phone || undefined,
            partySize: parseInt(partySize) || 1,
          }),
        });
      }
      
      await fetchGuests();
      alert("CSV imported successfully!");
    } catch (err) {
      alert("Failed to import CSV");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteGuest = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      const res = await fetch(`/api/admin/guests/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchGuests();
    } catch (err) {
      alert("Failed to delete guest");
    }
  };

  const startEditing = (guest: Guest) => {
    setEditingId(guest.id);
    setEditForm({
      name: guest.name,
      email: guest.email || "",
      phone: guest.phone || "",
      partySize: guest.partySize,
    });
  };

  const handleUpdateGuest = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/guests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update");
      setEditingId(null);
      await fetchGuests();
    } catch (err) {
      alert("Failed to update guest");
    }
  };

  const getMealName = (choice?: string) => {
    const meals: Record<string, string> = {
      CHICKEN: "Airline Chicken",
      PASTA: "Spinach Ravioli",
      SQUASH: "Stuffed Acorn Squash",
    };
    return choice ? meals[choice] || choice : "-";
  };

  const formatMealChoices = (choices?: string[]) => {
    if (!choices || choices.length === 0) return "-";
    return choices.map(c => getMealName(c)).join(", ");
  };

  // Stats
  const totalGuests = guests.length;
  const responded = guests.filter(g => g.rsvp).length;
  const attending = guests.filter(g => g.rsvp?.attending).length;
  const notAttending = guests.filter(g => g.rsvp && !g.rsvp.attending).length;
  const needsShuttle = guests.filter(g => g.rsvp?.needsShuttle).length;

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <h1 className={`${playfair.className} text-3xl md:text-4xl font-medium text-[#2D4D3A] mb-6 text-center`}>
        Guest Admin
      </h1>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-[#f5f7f6] rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-[#2D4D3A]">{totalGuests}</p>
          <p className="text-sm text-gray-600">Total Guests</p>
        </div>
        <div className="bg-[#f5f7f6] rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-[#2D4D3A]">{responded}</p>
          <p className="text-sm text-gray-600">Responded</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{attending}</p>
          <p className="text-sm text-gray-600">Attending</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{notAttending}</p>
          <p className="text-sm text-gray-600">Not Attending</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{needsShuttle}</p>
          <p className="text-sm text-gray-600">Need Shuttle</p>
        </div>
      </div>

      {/* Add Guest Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#2D4D3A] mb-4">Add Guest</h2>
        <form onSubmit={handleAddGuest} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Name *"
            value={newGuest.name}
            onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#2D4D3A]"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newGuest.email}
            onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#2D4D3A]"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={newGuest.phone}
            onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#2D4D3A]"
          />
          <input
            type="number"
            placeholder="Party Size"
            value={newGuest.partySize}
            onChange={(e) => setNewGuest({ ...newGuest, partySize: parseInt(e.target.value) || 1 })}
            className="w-24 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#2D4D3A]"
            min={1}
          />
          <button
            type="submit"
            disabled={addingGuest}
            className="bg-[#2D4D3A] text-white px-6 py-2 rounded-md hover:bg-[#1f3528] transition disabled:opacity-50"
          >
            {addingGuest ? "Adding..." : "Add"}
          </button>
        </form>

        {/* CSV Upload */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Or upload a CSV file (columns: name, email, phone, partySize)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            disabled={uploading}
            className="text-sm"
          />
          {uploading && <span className="ml-2 text-sm text-gray-500">Uploading...</span>}
        </div>
      </div>

      {/* Guest List Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f5f7f6]">
              <tr>
                <th className="px-4 py-3 font-semibold text-[#2D4D3A]">Name</th>
                <th className="px-4 py-3 font-semibold text-[#2D4D3A]">Email</th>
                <th className="px-4 py-3 font-semibold text-[#2D4D3A]">Status</th>
                <th className="px-4 py-3 font-semibold text-[#2D4D3A]">Meal</th>
                <th className="px-4 py-3 font-semibold text-[#2D4D3A]">Shuttle</th>
                <th className="px-4 py-3 font-semibold text-[#2D4D3A]">Notes</th>
                <th className="px-4 py-3 font-semibold text-[#2D4D3A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id} className="border-t border-gray-100 hover:bg-gray-50">
                  {editingId === guest.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-3" colSpan={4}>
                        <span className="text-gray-400 text-sm">RSVP data cannot be edited here</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleUpdateGuest(guest.id)}
                          className="text-green-600 hover:text-green-800 mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium">{guest.name}</td>
                      <td className="px-4 py-3 text-gray-600">{guest.email || "-"}</td>
                      <td className="px-4 py-3">
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
                      <td className="px-4 py-3 text-gray-600 text-sm">{formatMealChoices(guest.rsvp?.mealChoices)}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {guest.rsvp?.needsShuttle ? "Yes" : "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm max-w-[200px] truncate">
                        {guest.rsvp?.dietaryNotes || guest.rsvp?.comments || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => startEditing(guest)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(guest.id, guest.name)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {guests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No guests yet. Add your first guest above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
