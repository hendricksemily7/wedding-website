"use client";

import { useEffect, useRef, useState } from "react";

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

interface AnalyticsFunnelRow {
  deviceType: "mobile" | "web";
  step: string | null;
  count: number;
}

interface AnalyticsKeyEventRow {
  deviceType: "mobile" | "web";
  eventType: string;
  count: number;
}

interface AnalyticsSummary {
  funnel: AnalyticsFunnelRow[];
  keyEvents: AnalyticsKeyEventRow[];
}

type FilterType = "all" | "weddingParty" | "responded" | "attending" | "notAttending" | "needsShuttle" | "noResponse";

export default function GuestAdmin() {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newParty, setNewParty] = useState({ name: "", guestNames: [""] });
  const [addingParty, setAddingParty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editingPartyId, setEditingPartyId] = useState<string | null>(null);
  const [editPartyForm, setEditPartyForm] = useState({ name: "" });
  const [addingGuestToPartyId, setAddingGuestToPartyId] = useState<string | null>(null);
  const [newGuestName, setNewGuestName] = useState("");
  const [editingRsvpGuestId, setEditingRsvpGuestId] = useState<string | null>(null);
  const [editRsvpForm, setEditRsvpForm] = useState({
    name: "",
    attending: true,
    mealChoice: "",
    dietaryNotes: "",
    needsShuttle: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({ funnel: [], keyEvents: [] });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [analyticsExpanded, setAnalyticsExpanded] = useState(true);

  const fetchParties = async () => {
    try {
      const response = await fetch("/api/rsvp");
      if (!response.ok) {
        throw new Error("Failed to fetch parties");
      }
      const data = await response.json();
      setParties(data.parties);
    } catch {
      setError("Failed to load parties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/rsvp/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch RSVP analytics");
        }

        const data = await response.json();
        setAnalytics({
          funnel: data.funnel ?? [],
          keyEvents: data.keyEvents ?? [],
        });
      } catch {
        setAnalyticsError("Unable to load RSVP flow analytics right now.");
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    setAnalyticsExpanded(!isMobile);
  }, []);

  const handleAddParty = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newParty.name.trim()) {
      return;
    }

    const guestNames = newParty.guestNames.filter((name) => name.trim());
    if (guestNames.length === 0) {
      guestNames.push(newParty.name);
    }

    setAddingParty(true);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newParty.name, guestNames }),
      });

      if (!response.ok) {
        throw new Error("Failed to add party");
      }

      setNewParty({ name: "", guestNames: [""] });
      await fetchParties();
    } catch {
      alert("Failed to add party");
    } finally {
      setAddingParty(false);
    }
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim());
      const startIndex = lines[0]?.toLowerCase().includes("name") ? 1 : 0;

      for (let index = startIndex; index < lines.length; index += 1) {
        const [partyName, guestNamesStr, weddingPartyStr] = lines[index].split(",").map((item) => item.trim());
        if (!partyName) {
          continue;
        }

        const rawNames = guestNamesStr
          ? guestNamesStr.split(";").map((name) => name.trim()).filter(Boolean)
          : [partyName];
        const weddingPartyValues = weddingPartyStr
          ? weddingPartyStr.split(";").map((value) => value.trim().toLowerCase())
          : [];

        const guestNames: string[] = [];
        const weddingPartyFlags: boolean[] = [];

        for (let rawIndex = 0; rawIndex < rawNames.length; rawIndex += 1) {
          const rawName = rawNames[rawIndex];
          const hasAsterisk = rawName.endsWith("*");
          const fromColumn = ["yes", "true", "1"].includes(weddingPartyValues[rawIndex]);
          guestNames.push(hasAsterisk ? rawName.slice(0, -1).trim() : rawName);
          weddingPartyFlags.push(hasAsterisk || fromColumn);
        }

        await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: partyName, guestNames, weddingPartyFlags }),
        });
      }

      await fetchParties();
      alert("CSV imported successfully!");
    } catch {
      alert("Failed to import CSV");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteParty = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the entire party "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/guests/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete party");
      }
      await fetchParties();
    } catch {
      alert("Failed to delete party");
    }
  };

  const handleDeleteGuest = async (guestId: string, guestName: string) => {
    if (!confirm(`Are you sure you want to remove ${guestName} from this party?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/guests/${guestId}?type=guest`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete guest");
      }
      await fetchParties();
    } catch {
      alert("Failed to delete guest");
    }
  };

  const startEditingParty = (party: Party) => {
    setEditingPartyId(party.id);
    setEditPartyForm({ name: party.name });
  };

  const handleUpdateParty = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/guests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editPartyForm),
      });
      if (!response.ok) {
        throw new Error("Failed to update party");
      }
      setEditingPartyId(null);
      await fetchParties();
    } catch {
      alert("Failed to update party");
    }
  };

  const handleAddGuestToParty = async (partyId: string) => {
    if (!newGuestName.trim()) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/guests/${partyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "addGuest", name: newGuestName }),
      });
      if (!response.ok) {
        throw new Error("Failed to add guest");
      }
      setAddingGuestToPartyId(null);
      setNewGuestName("");
      await fetchParties();
    } catch {
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
      if (editRsvpForm.name && editRsvpForm.name !== originalName) {
        const nameResponse = await fetch(`/api/admin/guests/${guestId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "guestDetails", name: editRsvpForm.name }),
        });
        if (!nameResponse.ok) {
          throw new Error("Failed to update guest name");
        }
      }

      const response = await fetch(`/api/admin/guests/${guestId}`, {
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

      if (!response.ok) {
        throw new Error("Failed to update RSVP");
      }

      setEditingRsvpGuestId(null);
      await fetchParties();
    } catch {
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

  const totalParties = parties.length;
  const totalGuests = parties.reduce((sum, party) => sum + party.guests.length, 0);
  const weddingPartyGuests = parties.reduce((sum, party) => sum + party.guests.filter((guest) => guest.isWeddingParty).length, 0);
  const respondedGuests = parties.reduce((sum, party) => sum + party.guests.filter((guest) => guest.rsvp).length, 0);
  const noResponseGuests = totalGuests - respondedGuests;
  const attendingGuests = parties.reduce((sum, party) => sum + party.guests.filter((guest) => guest.rsvp?.attending).length, 0);
  const notAttendingGuests = parties.reduce((sum, party) => sum + party.guests.filter((guest) => guest.rsvp && !guest.rsvp.attending).length, 0);
  const needsShuttleGuests = parties.reduce((sum, party) => sum + party.guests.filter((guest) => guest.rsvp?.needsShuttle).length, 0);

  const applyFilter = (guest: Guest) => {
    switch (activeFilter) {
      case "weddingParty":
        return guest.isWeddingParty;
      case "responded":
        return !!guest.rsvp;
      case "noResponse":
        return !guest.rsvp;
      case "attending":
        return !!guest.rsvp?.attending;
      case "notAttending":
        return !!guest.rsvp && !guest.rsvp.attending;
      case "needsShuttle":
        return !!guest.rsvp?.needsShuttle;
      default:
        return true;
    }
  };

  const filteredParties = parties
    .map((party) => {
      const guests = party.guests.filter((guest) => {
        const matchesSearch = !searchQuery.trim()
          || guest.name.toLowerCase().includes(searchQuery.toLowerCase())
          || party.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && applyFilter(guest);
      });

      if (activeFilter === "responded") {
        guests.sort((a, b) => {
          const aTime = a.rsvp ? new Date(a.rsvp.respondedAt).getTime() : 0;
          const bTime = b.rsvp ? new Date(b.rsvp.respondedAt).getTime() : 0;
          return bTime - aTime;
        });
      }

      return {
        ...party,
        guests,
      };
    })
    .filter((party) => party.guests.length > 0 || (!searchQuery.trim() && activeFilter === "all"))
    .sort((a, b) => {
      if (activeFilter !== "responded") {
        return 0;
      }

      const aLatestResponse = a.guests.reduce((latest, guest) => {
        const respondedAt = guest.rsvp ? new Date(guest.rsvp.respondedAt).getTime() : 0;
        return Math.max(latest, respondedAt);
      }, 0);

      const bLatestResponse = b.guests.reduce((latest, guest) => {
        const respondedAt = guest.rsvp ? new Date(guest.rsvp.respondedAt).getTime() : 0;
        return Math.max(latest, respondedAt);
      }, 0);

      return bLatestResponse - aLatestResponse;
    });

  const getKeyEventCount = (deviceType: "mobile" | "web", eventType: string) => {
    const row = analytics.keyEvents.find((item) => item.deviceType === deviceType && item.eventType === eventType);
    return row?.count ?? 0;
  };

  const getFunnelStepCount = (deviceType: "mobile" | "web", step: string) => {
    const row = analytics.funnel.find((item) => item.deviceType === deviceType && item.step === step);
    return row?.count ?? 0;
  };

  const flowOpenMobile = getKeyEventCount("mobile", "respond_flow_opened");
  const flowOpenWeb = getKeyEventCount("web", "respond_flow_opened");
  const submitSuccessMobile = getKeyEventCount("mobile", "submit_success");
  const submitSuccessWeb = getKeyEventCount("web", "submit_success");
  const mobileDropOff = Math.max(flowOpenMobile - submitSuccessMobile, 0);
  const webDropOff = Math.max(flowOpenWeb - submitSuccessWeb, 0);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
        Loading guest tracking...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#d6ddd8] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#6a7f72]">Guest Tracking</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#2D4D3A]">RSVP and party management</h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage parties, responses, meal choices, shuttle requests, and rehearsal dinner attendance in one place.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-md bg-[#2D4D3A] px-4 py-2 text-white transition hover:bg-[#1f3528]"
          >
            Add Party
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <button onClick={() => setActiveFilter("all")} className={`rounded-lg p-4 text-center transition ${activeFilter === "all" ? "ring-2 ring-[#2D4D3A] bg-[#e8ebe9]" : "bg-[#f5f7f6] hover:bg-[#e8ebe9]"}`}>
          <p className="text-2xl font-bold text-[#2D4D3A]">{totalParties}</p>
          <p className="text-sm text-gray-600">Parties</p>
        </button>
        <button onClick={() => setActiveFilter("all")} className={`rounded-lg p-4 text-center transition ${activeFilter === "all" ? "ring-2 ring-[#2D4D3A] bg-[#e8ebe9]" : "bg-[#f5f7f6] hover:bg-[#e8ebe9]"}`}>
          <p className="text-2xl font-bold text-[#2D4D3A]">{totalGuests}</p>
          <p className="text-sm text-gray-600">Total Guests</p>
        </button>
        <button onClick={() => setActiveFilter(activeFilter === "weddingParty" ? "all" : "weddingParty")} className={`rounded-lg p-4 text-center transition ${activeFilter === "weddingParty" ? "ring-2 ring-purple-500 bg-purple-100" : "bg-purple-50 hover:bg-purple-100"}`}>
          <p className="text-2xl font-bold text-purple-700">{weddingPartyGuests}</p>
          <p className="text-sm text-gray-600">Wedding Party</p>
        </button>
        <button onClick={() => setActiveFilter(activeFilter === "responded" ? "all" : "responded")} className={`rounded-lg p-4 text-center transition ${activeFilter === "responded" ? "ring-2 ring-[#2D4D3A] bg-[#e8ebe9]" : "bg-[#f5f7f6] hover:bg-[#e8ebe9]"}`}>
          <p className="text-2xl font-bold text-[#2D4D3A]">{respondedGuests}</p>
          <p className="text-sm text-gray-600">Responded</p>
        </button>
        <button onClick={() => setActiveFilter(activeFilter === "noResponse" ? "all" : "noResponse")} className={`rounded-lg p-4 text-center transition ${activeFilter === "noResponse" ? "ring-2 ring-gray-500 bg-gray-100" : "bg-gray-50 hover:bg-gray-100"}`}>
          <p className="text-2xl font-bold text-gray-700">{noResponseGuests}</p>
          <p className="text-sm text-gray-600">Not Responded</p>
        </button>
        <button onClick={() => setActiveFilter(activeFilter === "attending" ? "all" : "attending")} className={`rounded-lg p-4 text-center transition ${activeFilter === "attending" ? "ring-2 ring-green-500 bg-green-100" : "bg-green-50 hover:bg-green-100"}`}>
          <p className="text-2xl font-bold text-green-700">{attendingGuests}</p>
          <p className="text-sm text-gray-600">Attending</p>
        </button>
        <button onClick={() => setActiveFilter(activeFilter === "notAttending" ? "all" : "notAttending")} className={`rounded-lg p-4 text-center transition ${activeFilter === "notAttending" ? "ring-2 ring-red-500 bg-red-100" : "bg-red-50 hover:bg-red-100"}`}>
          <p className="text-2xl font-bold text-red-700">{notAttendingGuests}</p>
          <p className="text-sm text-gray-600">Not Attending</p>
        </button>
        <button onClick={() => setActiveFilter(activeFilter === "needsShuttle" ? "all" : "needsShuttle")} className={`rounded-lg p-4 text-center transition ${activeFilter === "needsShuttle" ? "ring-2 ring-blue-500 bg-blue-100" : "bg-blue-50 hover:bg-blue-100"}`}>
          <p className="text-2xl font-bold text-blue-700">{needsShuttleGuests}</p>
          <p className="text-sm text-gray-600">Need Shuttle</p>
        </button>
      </div>

      <div className="rounded-2xl border border-[#d6ddd8] bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-[#2D4D3A]">RSVP Flow Analytics</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#6a7f72]">Mobile vs Web</span>
            <button
              onClick={() => setAnalyticsExpanded((value) => !value)}
              className="rounded-md border border-[#d5ddd8] px-3 py-1 text-xs font-medium text-[#2D4D3A] transition hover:bg-[#f5f7f6]"
              aria-expanded={analyticsExpanded}
            >
              {analyticsExpanded ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>

        {analyticsExpanded ? (
          <>
            <p className="mb-4 text-sm text-gray-600">
              These numbers use tracked RSVP flow sessions only. Existing RSVP records from before tracking are excluded.
            </p>

            {analyticsLoading ? <p className="text-sm text-gray-500">Loading RSVP flow analytics...</p> : null}
            {analyticsError ? <p className="text-sm text-red-600">{analyticsError}</p> : null}

            {!analyticsLoading && !analyticsError ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-[#f8faf9] p-4">
                  <p className="text-sm font-semibold text-[#2D4D3A]">Mobile</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xl font-semibold text-[#2D4D3A]">{flowOpenMobile}</p>
                      <p className="text-xs text-gray-600">Started</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-[#2D4D3A]">{submitSuccessMobile}</p>
                      <p className="text-xs text-gray-600">Submitted</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-red-700">{mobileDropOff}</p>
                      <p className="text-xs text-gray-600">Drop-off</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 text-sm text-gray-700">
                    <p>Attending step views: {getFunnelStepCount("mobile", "attending")}</p>
                    <p>Meal step views: {getFunnelStepCount("mobile", "meal")}</p>
                    <p>Shuttle step views: {getFunnelStepCount("mobile", "shuttle")}</p>
                    <p>Review step views: {getFunnelStepCount("mobile", "review")}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-[#f8faf9] p-4">
                  <p className="text-sm font-semibold text-[#2D4D3A]">Web</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xl font-semibold text-[#2D4D3A]">{flowOpenWeb}</p>
                      <p className="text-xs text-gray-600">Started</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-[#2D4D3A]">{submitSuccessWeb}</p>
                      <p className="text-xs text-gray-600">Submitted</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-red-700">{webDropOff}</p>
                      <p className="text-xs text-gray-600">Drop-off</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 text-sm text-gray-700">
                    <p>Attending step views: {getFunnelStepCount("web", "attending")}</p>
                    <p>Meal step views: {getFunnelStepCount("web", "meal")}</p>
                    <p>Shuttle step views: {getFunnelStepCount("web", "shuttle")}</p>
                    <p>Review step views: {getFunnelStepCount("web", "review")}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      {activeFilter !== "all" ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtered by:</span>
          <span className="rounded bg-gray-100 px-2 py-1 text-sm font-medium">
            {activeFilter === "weddingParty" && "Wedding Party"}
            {activeFilter === "responded" && "Responded"}
            {activeFilter === "noResponse" && "No Response"}
            {activeFilter === "attending" && "Attending"}
            {activeFilter === "notAttending" && "Not Attending"}
            {activeFilter === "needsShuttle" && "Needs Shuttle"}
          </span>
          <button onClick={() => setActiveFilter("all")} className="text-sm text-gray-500 underline hover:text-gray-700">
            Clear
          </button>
        </div>
      ) : null}

      {showAddModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#2D4D3A]">Add Party</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>

            <form onSubmit={(event) => { handleAddParty(event); setShowAddModal(false); }} className="space-y-4">
              <input
                type="text"
                placeholder="Party Name"
                value={newParty.name}
                onChange={(event) => setNewParty({ ...newParty, name: event.target.value })}
                className="w-full rounded-md border border-gray-300 px-4 py-2"
                required
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Guest Names</label>
                {newParty.guestNames.map((name, index) => (
                  <div key={index} className="mb-2 flex gap-2">
                    <input
                      type="text"
                      placeholder={`Guest ${index + 1} name`}
                      value={name}
                      onChange={(event) => {
                        const updated = [...newParty.guestNames];
                        updated[index] = event.target.value;
                        setNewParty({ ...newParty, guestNames: updated });
                      }}
                      className="flex-1 rounded-md border border-gray-300 px-4 py-2"
                    />
                    {newParty.guestNames.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => setNewParty({ ...newParty, guestNames: newParty.guestNames.filter((_, current) => current !== index) })}
                        className="px-2 text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    ) : null}
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
                className="w-full rounded-md bg-[#2D4D3A] px-6 py-2 text-white transition hover:bg-[#1f3528] disabled:opacity-50"
              >
                {addingParty ? "Adding..." : "Add Party"}
              </button>
            </form>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="mb-2 text-sm text-gray-600">Or upload a CSV file:</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={(event) => { handleCSVUpload(event); setShowAddModal(false); }}
                disabled={uploading}
                className="text-sm"
              />
              {uploading ? <span className="ml-2 text-sm text-gray-500">Uploading...</span> : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {totalParties > 0 ? (
          <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-md min-w-[200px] flex-1">
              <input
                type="text"
                placeholder="Search guests or parties..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:border-[#2D4D3A]"
              />
            </div>
          </div>
        ) : null}

        {filteredParties.map((party) => (
          <div key={party.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#f5f7f6] px-4 py-3">
              {editingPartyId === party.id ? (
                <div className="flex flex-1 flex-wrap gap-2">
                  <input
                    type="text"
                    value={editPartyForm.name}
                    onChange={(event) => setEditPartyForm({ ...editPartyForm, name: event.target.value })}
                    className="rounded border border-gray-300 px-2 py-1"
                    placeholder="Party name"
                  />
                  <button onClick={() => handleUpdateParty(party.id)} className="px-2 text-green-600 hover:text-green-800">Save</button>
                  <button onClick={() => setEditingPartyId(null)} className="px-2 text-gray-600 hover:text-gray-800">Cancel</button>
                </div>
              ) : (
                <>
                  <div>
                    <span className="font-semibold text-[#2D4D3A]">{party.name}</span>
                    <span className="ml-2 text-sm text-gray-500">({party.guests.length} guest{party.guests.length !== 1 ? "s" : ""})</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAddingGuestToPartyId(party.id)} className="text-sm text-[#2D4D3A] hover:underline">+ Add Guest</button>
                    <button onClick={() => startEditingParty(party)} className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                    <button onClick={() => handleDeleteParty(party.id, party.name)} className="text-sm text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </>
              )}
            </div>

            {addingGuestToPartyId === party.id ? (
              <div className="flex gap-2 bg-blue-50 px-4 py-3">
                <input
                  type="text"
                  value={newGuestName}
                  onChange={(event) => setNewGuestName(event.target.value)}
                  placeholder="New guest name"
                  className="flex-1 rounded border border-gray-300 px-2 py-1"
                />
                <button onClick={() => handleAddGuestToParty(party.id)} className="rounded bg-[#2D4D3A] px-4 py-1 text-white hover:bg-[#1f3528]">Add</button>
                <button onClick={() => { setAddingGuestToPartyId(null); setNewGuestName(""); }} className="px-2 text-gray-600 hover:text-gray-800">Cancel</button>
              </div>
            ) : null}

            <div className="md:hidden divide-y divide-gray-100">
              {party.guests.map((guest) => (
                <div key={guest.id} className="space-y-3 px-4 py-4">
                  {editingRsvpGuestId === guest.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editRsvpForm.name}
                        onChange={(event) => setEditRsvpForm({ ...editRsvpForm, name: event.target.value })}
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-medium"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={editRsvpForm.attending ? "yes" : "no"}
                          onChange={(event) => setEditRsvpForm({ ...editRsvpForm, attending: event.target.value === "yes" })}
                          className="rounded border border-gray-300 px-2 py-2 text-sm"
                        >
                          <option value="yes">Attending</option>
                          <option value="no">Not Attending</option>
                        </select>
                        {editRsvpForm.attending ? (
                          <select
                            value={editRsvpForm.mealChoice}
                            onChange={(event) => setEditRsvpForm({ ...editRsvpForm, mealChoice: event.target.value })}
                            className="rounded border border-gray-300 px-2 py-2 text-sm"
                          >
                            <option value="">Select meal</option>
                            <option value="CHICKEN">Lemon Chicken</option>
                            <option value="PASTA">Spinach Ravioli</option>
                            <option value="SQUASH">Stuffed Acorn Squash</option>
                          </select>
                        ) : (
                          <div className="rounded border border-gray-200 px-2 py-2 text-sm text-gray-400">Meal: -</div>
                        )}
                      </div>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={editRsvpForm.needsShuttle}
                          onChange={(event) => setEditRsvpForm({ ...editRsvpForm, needsShuttle: event.target.checked })}
                          className="accent-[#2D4D3A]"
                        />
                        Needs shuttle
                      </label>
                      <input
                        type="text"
                        value={editRsvpForm.dietaryNotes}
                        onChange={(event) => setEditRsvpForm({ ...editRsvpForm, dietaryNotes: event.target.value })}
                        placeholder="Dietary notes"
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                      />
                      <div className="flex gap-3">
                        <button onClick={() => handleUpdateRsvp(guest.id, guest.name)} className="text-sm text-green-600 hover:text-green-800">Save</button>
                        <button onClick={() => setEditingRsvpGuestId(null)} className="text-sm text-gray-600 hover:text-gray-800">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium text-[#2D4D3A]">
                          {guest.name}
                          {guest.isWeddingParty ? <span className="ml-2 rounded bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-800">WP</span> : null}
                        </div>
                        {guest.rsvp ? (
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${guest.rsvp.attending ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {guest.rsvp.attending ? "Attending" : "Not Attending"}
                          </span>
                        ) : <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">No Response</span>}
                      </div>
                      <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-600">
                        <span>Meal</span><span className="text-right">{getMealName(guest.rsvp?.mealChoice)}</span>
                        <span>Shuttle</span><span className="text-right">{guest.rsvp?.needsShuttle ? "Yes" : "-"}</span>
                        <span>Rehearsal</span><span className="text-right">{guest.isWeddingParty ? (guest.rsvp?.attendingRehearsalDinner ? "Yes" : guest.rsvp?.attendingRehearsalDinner === false ? "No" : "-") : "-"}</span>
                        <span>Notes</span><span className="text-right truncate">{guest.rsvp?.dietaryNotes || guest.rsvp?.comments || "-"}</span>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => startEditingRsvp(guest)} className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
                        <button onClick={() => handleDeleteGuest(guest.id, guest.name)} className="text-sm text-red-500 hover:text-red-700">Remove</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="hidden max-w-full overflow-x-auto md:block">
              <table className="w-full min-w-[780px] text-left">
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
                            onChange={(event) => setEditRsvpForm({ ...editRsvpForm, name: event.target.value })}
                            className="w-full max-w-[150px] rounded border border-gray-300 px-2 py-1 text-sm font-medium"
                          />
                          {guest.isWeddingParty ? <span className="ml-2 rounded bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-800">WP</span> : null}
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={editRsvpForm.attending ? "yes" : "no"}
                            onChange={(event) => setEditRsvpForm({ ...editRsvpForm, attending: event.target.value === "yes" })}
                            className="rounded border border-gray-300 px-2 py-1 text-sm"
                          >
                            <option value="yes">Attending</option>
                            <option value="no">Not Attending</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          {editRsvpForm.attending ? (
                            <select
                              value={editRsvpForm.mealChoice}
                              onChange={(event) => setEditRsvpForm({ ...editRsvpForm, mealChoice: event.target.value })}
                              className="rounded border border-gray-300 px-2 py-1 text-sm"
                            >
                              <option value="">Select meal</option>
                              <option value="CHICKEN">Lemon Chicken</option>
                              <option value="PASTA">Spinach Ravioli</option>
                              <option value="SQUASH">Stuffed Acorn Squash</option>
                            </select>
                          ) : <span className="text-gray-400">-</span>}
                        </td>
                        <td className="px-4 py-2">
                          {editRsvpForm.attending ? (
                            <input
                              type="checkbox"
                              checked={editRsvpForm.needsShuttle}
                              onChange={(event) => setEditRsvpForm({ ...editRsvpForm, needsShuttle: event.target.checked })}
                              className="accent-[#2D4D3A]"
                            />
                          ) : <span className="text-gray-400">-</span>}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {guest.isWeddingParty ? (guest.rsvp?.attendingRehearsalDinner ? "Yes" : guest.rsvp?.attendingRehearsalDinner === false ? "No" : "-") : "-"}
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={editRsvpForm.dietaryNotes}
                            onChange={(event) => setEditRsvpForm({ ...editRsvpForm, dietaryNotes: event.target.value })}
                            placeholder="Dietary notes"
                            className="w-full max-w-[120px] rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <button onClick={() => handleUpdateRsvp(guest.id, guest.name)} className="mr-2 text-sm text-green-600 hover:text-green-800">Save</button>
                          <button onClick={() => setEditingRsvpGuestId(null)} className="text-sm text-gray-600 hover:text-gray-800">Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2 font-medium">
                          {guest.name}
                          {guest.isWeddingParty ? <span className="ml-2 rounded bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-800">WP</span> : null}
                        </td>
                        <td className="px-4 py-2">
                          {guest.rsvp ? (
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${guest.rsvp.attending ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {guest.rsvp.attending ? "Attending" : "Not Attending"}
                            </span>
                          ) : <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">No Response</span>}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">{getMealName(guest.rsvp?.mealChoice)}</td>
                        <td className="px-4 py-2 text-gray-600">{guest.rsvp?.needsShuttle ? "Yes" : "-"}</td>
                        <td className="px-4 py-2 text-gray-600">
                          {guest.isWeddingParty ? (guest.rsvp?.attendingRehearsalDinner ? "Yes" : guest.rsvp?.attendingRehearsalDinner === false ? "No" : "-") : "-"}
                        </td>
                        <td className="max-w-[150px] truncate px-4 py-2 text-sm text-gray-600">{guest.rsvp?.dietaryNotes || guest.rsvp?.comments || "-"}</td>
                        <td className="px-4 py-2">
                          <button onClick={() => startEditingRsvp(guest)} className="mr-3 text-gray-400 hover:text-gray-600" title="Edit">Edit</button>
                          <button onClick={() => handleDeleteGuest(guest.id, guest.name)} className="text-gray-400 hover:text-red-500" title="Remove">Remove</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        ))}

        {parties.length === 0 ? <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">No parties yet. Add your first party above.</div> : null}
        {parties.length > 0 && filteredParties.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
            {searchQuery && activeFilter !== "all"
              ? `No guests match "${searchQuery}" with the current filter`
              : searchQuery
                ? `No guests or parties match "${searchQuery}"`
                : "No guests match the current filter"}
          </div>
        ) : null}
      </div>
    </div>
  );
}