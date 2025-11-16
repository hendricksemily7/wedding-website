"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

const meals = [
  {
    id: "chicken",
    name: "Airline Chicken",
    description: "Lemon herb white wine sauce",
  },
  {
    id: "pasta",
    name: "Pasta Primavera",
    description: "Fresh vegetables, olive oil, and herbs",
  },
  {
    id: "squash",
    name: "Stuffed Acorn Squash",
    description: "Maple seasoned rice and vegetables",
  },
];

export default function MealSelectionPage() {
  const router = useRouter();
  const { guestName } = useParams();
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
 
  const handleNext = () => {
    if (!selectedMeal) return alert("Please select a meal!");
    router.push(`/rsvp/${guestName}/comments?meal=${selectedMeal}`);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Meal Selection</h1>
      <p className="mb-4 text-gray-600">
        All meals come with broiled asparagus, dinner rolls with butter, and salad.
      </p>

      <div className="space-y-3">
        {meals.map(meal => (
          <label
            key={meal.id}
            className={`block border p-4 rounded-xl cursor-pointer ${
              selectedMeal === meal.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              name="meal"
              value={meal.id}
              checked={selectedMeal === meal.id}
              onChange={() => setSelectedMeal(meal.id)}
              className="mr-2"
            />
            <span className="font-medium">{meal.name}</span>
            <p className="text-sm text-gray-500 ml-6">{meal.description}</p>
          </label>
        ))}
      </div>

      <button
        onClick={handleNext}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Continue
      </button>
    </div>
  );
}
