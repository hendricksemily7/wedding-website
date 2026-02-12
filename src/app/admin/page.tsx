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
  comments?: string;
  respondedAt: string;
}

interface Guest {
  id: string;
  name: string;
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
    attending: true,
    mealChoice: "",
    dietaryNotes: "",
    needsShuttle: false,
  });

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

  useEffect(() => {
    fetchParties();
  }, []);

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
        const [partyName, guestNamesStr] = lines[i].split(",").map(s => s.trim());
        if (!partyName) continue;
        
        // Guest names can be semicolon-separated within the CSV cell
        const guestNames = guestNamesStr 
          ? guestNamesStr.split(";").map(n => n.trim()).filter(Boolean)
          : [partyName];
        
        await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: partyName,
            guestNames,
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
      attending: guest.rsvp?.attending ?? true,
      mealChoice: guest.rsvp?.mealChoice || "",
      dietaryNotes: guest.rsvp?.dietaryNotes || "",
      needsShuttle: guest.rsvp?.needsShuttle ?? false,
    });
  };

  const handleUpdateRsvp = async (guestId: string) => {
    try {
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
      alert("Failed to update RSVP");
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

  // Stats
  const totalParties = parties.length;
  const totalGuests = parties.reduce((sum, p) => sum + p.guests.length, 0);
  const respondedGuests = parties.reduce((sum, p) => sum + p.guests.filter(g => g.rsvp).length, 0);
  const attendingGuests = parties.reduce((sum, p) => sum + p.guests.filter(g => g.rsvp?.attending).length, 0);
  const notAttendingGuests = parties.reduce((sum, p) => sum + p.guests.filter(g => g.rsvp && !g.rsvp.attending).length, 0);
  const needsShuttleGuests = parties.reduce((sum, p) => sum + p.guests.filter(g => g.rsvp?.needsShuttle).length, 0);

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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-[#f5f7f6] rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-[#2D4D3A]">{totalParties}</p>
          <p className="text-sm text-gray-600">Parties</p>
        </div>
        <div className="bg-[#f5f7f6] rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-[#2D4D3A]">{totalGuests}</p>
          <p className="text-sm text-gray-600">Total Guests</p>
        </div>
        <div className="bg-[#f5f7f6] rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-[#2D4D3A]">{respondedGuests}</p>
          <p className="text-sm text-gray-600">Responded</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{attendingGuests}</p>
          <p className="text-sm text-gray-600">Attending</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{notAttendingGuests}</p>
          <p className="text-sm text-gray-600">Not Attending</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{needsShuttleGuests}</p>
          <p className="text-sm text-gray-600">Need Shuttle</p>
        </div>
      </div>

      {/* Add Party Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#2D4D3A] mb-4">Add Party</h2>
        <form onSubmit={handleAddParty} className="space-y-4">
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
            className="bg-[#2D4D3A] text-white px-6 py-2 rounded-md hover:bg-[#1f3528] transition disabled:opacity-50"
          >
            {addingParty ? "Adding..." : "Add Party"}
          </button>
        </form>

        {/* CSV Upload */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Or upload a CSV file (columns: partyName, guestNames (semicolon-separated))
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

      {/* Party List */}
      <div className="space-y-4">
        {parties.map((party) => (
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
                  <th className="px-4 py-2 font-medium text-gray-600">Notes</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {party.guests.map((guest) => (
                  <tr key={guest.id} className="border-t border-gray-100 hover:bg-gray-50">
                    {editingRsvpGuestId === guest.id ? (
                      <>
                        <td className="px-4 py-2 font-medium">{guest.name}</td>
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
                              <option value="CHICKEN">Airline Chicken</option>
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
                            onClick={() => handleUpdateRsvp(guest.id)}
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
                        <td className="px-4 py-2 font-medium">{guest.name}</td>
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
                        <td className="px-4 py-2 text-gray-600 text-sm max-w-[150px] truncate">
                          {guest.rsvp?.dietaryNotes || guest.rsvp?.comments || "-"}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => startEditingRsvp(guest)}
                            className="text-blue-600 hover:text-blue-800 text-sm mr-2"
                          >
                            Edit RSVP
                          </button>
                          {party.guests.length > 1 && (
                            <button
                              onClick={() => handleDeleteGuest(guest.id, guest.name, party.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          )}
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
      </div>
    </div>
  );
}
