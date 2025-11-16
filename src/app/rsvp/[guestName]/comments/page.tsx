"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState } from "react";

export default function CommentsPage() {
  const searchParams = useSearchParams();
  const { guestName } = useParams();
  const meal = searchParams.get("meal");
  const [comments, setComments] = useState("");

  const handleSubmit = () => {
    // Save to database or send to API here
    alert(`Saved!\nGuest: ${guestName}\nMeal: ${meal}\nComments: ${comments}`);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Dietary Restrictions or Notes</h1>
      <textarea
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Let us know about any allergies or preferences..."
        className="w-full border rounded-lg p-3 min-h-[120px]"
      />
      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        Submit RSVP
      </button>
    </div>
  );
}
