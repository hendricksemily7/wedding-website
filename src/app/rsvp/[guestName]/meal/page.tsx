"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";

export const meals = [
  {
    id: "CHICKEN",
    name: "Airline Chicken",
    description: "Lemon herb white wine sauce",
  },
  {
    id: "PASTA",
    name: "Spinach Ravioli",
    description: "With a basil cream sauce",
  },
  {
    id: "SQUASH",
    name: "Stuffed Acorn Squash",
    description: "Maple seasoned rice and vegetables",
  },
];

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});


export default function MealSelectionPage() {
  const router = useRouter();
  const { guestName } = useParams();
  const [partySize, setPartySize] = useState(1);
  const [selectedMeals, setSelectedMeals] = useState<(string | null)[]>([null]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGuest() {
      try {
        const res = await fetch(`/api/rsvp/${encodeURIComponent(guestName as string)}`);
        if (res.ok) {
          const data = await res.json();
          const size = data.guest.partySize || 1;
          setPartySize(size);
          setSelectedMeals(new Array(size).fill(null));
        }
      } catch (err) {
        console.error("Failed to fetch guest:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGuest();
  }, [guestName]);

  const handleMealSelect = (index: number, mealId: string) => {
    const newMeals = [...selectedMeals];
    newMeals[index] = mealId;
    setSelectedMeals(newMeals);
  };

  const allMealsSelected = selectedMeals.every(meal => meal !== null);
 
  const handleNext = () => {
    const mealsParam = encodeURIComponent(JSON.stringify(selectedMeals));
    router.push(`/rsvp/${guestName}/comments?meals=${mealsParam}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full">
        <div className="bg-white shadow-md rounded-lg p-5 w-full max-w-2xl">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg p-5 w-full max-w-2xl flex flex-col">
        <h1 className={`${playfair.className} text-left text-3xl font-semibold mb-4`}>
          Select {partySize > 1 ? "your meals" : "your meal"}
        </h1>
        <p className="text-xl mb-4 text-gray-600">
          All meals come with broiled asparagus, dinner rolls with butter, and salad.
        </p>

        {Array.from({ length: partySize }).map((_, guestIndex) => (
          <div key={guestIndex} className="mb-6">
            {partySize > 1 && (
              <h2 className="text-lg font-medium text-[#2D4D3A] mb-3">
                Guest {guestIndex + 1}
              </h2>
            )}
            <div className="text-lg space-y-3">
              {meals.map(meal => (
                <label
                  key={`${guestIndex}-${meal.id}`}
                  className={`block border p-4 rounded-xl cursor-pointer transition
                    ${selectedMeals[guestIndex] === meal.id
                      ? "border-[#2D4D3A] bg-[#95a6a0]"
                      : "border-gray-200 bg-white"}
                  `}
                >
                  <input
                    type="radio"
                    name={`meal-${guestIndex}`}
                    value={meal.id}
                    checked={selectedMeals[guestIndex] === meal.id}
                    onChange={() => handleMealSelect(guestIndex, meal.id)}
                    className="mr-2 accent-[#2D4D3A]"
                  />
                  <span className="font-medium text-[#2D4D3A]">{meal.name}</span>
                  <p className="text-lg text-gray-500 space-y-2">{meal.description}</p>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleNext}
          disabled={!allMealsSelected}
          className={`mt-6 border border-[#2D4D3A] text-[#2D4D3A] px-8 py-3 rounded-md font-medium tracking-wide transition
            ${allMealsSelected
              ? "bg-transparent hover:bg-[#95a6a0] cursor-pointer"
              : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"}
          mx-auto`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
