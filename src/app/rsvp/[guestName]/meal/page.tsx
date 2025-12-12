"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Playfair_Display } from "next/font/google";

const meals = [
  {
    id: "chicken",
    name: "Airline Chicken",
    description: "Lemon herb white wine sauce",
  },
  {
    id: "pasta",
    name: "Spinach Ravioli",
    description: "With a basil cream sauce",
  },
  {
    id: "squash",
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
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
 
  const handleNext = () => {
    router.push(`/rsvp/${guestName}/comments?meal=${selectedMeal}`);
  };

  return (
      // <div className="flex items-center justify-center w-full px-6 py-12 bg-[#E9F0EC]">
      <div className="flex items-center justify-center w-full px-6 py-12">

        <div className="bg-white shadow-md rounded-lg p-10 w-full max-w-2xl flex flex-col items-center">
        <h1 className={`${playfair.className} text-2xl font-semibold mb-4`}>Select your meal</h1>
        <p className="mb-4 text-gray-600">
          All meals come with broiled asparagus, dinner rolls with butter, and salad.
        </p>

        <div className="space-y-3">
          {meals.map(meal => (
            <label
              key={meal.id}
              className={`block border p-4 rounded-xl cursor-pointer transition
                ${selectedMeal === meal.id
                  ? "border-[#2D4D3A] bg-[#E9F0EC]"
                  : "border-gray-200 bg-white"}
              `}
            >
              <input
                type="radio"
                name="meal"
                value={meal.id}
                checked={selectedMeal === meal.id}
                onChange={() => setSelectedMeal(meal.id)}
                className="mr-2 accent-[#2D4D3A]"
              />
              <span className="font-medium text-[#2D4D3A]">{meal.name}</span>
              <p className="text-sm text-gray-500 ml-6">{meal.description}</p>
            </label>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={!selectedMeal}
          className={`mt-6 border border-[#2D4D3A] text-[#2D4D3A] px-8 py-3 rounded-md font-medium tracking-wide transition
            ${selectedMeal
              ? "bg-transparent hover:bg-[#E9F0EC] cursor-pointer"
              : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"}
          mx-auto`}
        >
          Continue
        </button>
        </div>
    </div>
  );
}
