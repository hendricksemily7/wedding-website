// src/app/accommodations/page.tsx
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { FaMapMarkerAlt, FaPhone, FaDollarSign } from "react-icons/fa";

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});

const accommodations = [
  {
    id: 1,
    name: "Hampton Inn",
    category: "Hotel",
    location: "Saint Albans",
    imageSrc: "/hampton.jpg",
    link: "https://group.hamptoninn.com/fqaj22",
    address: "43 Lake St, St Albans City, VT 05478",
    price: "$289/night",
    phone: "(802) 528-5020",
    ctaLabel: "View Website",
    description:
      "A great option with modern amenities, a short drive from the festivities. Pet friendly (fee applies). EV charging available next door.",
  },
  {
    id: 2,
    name: "Inn at Buck Hollow Farm",
    category: "Bed & Breakfast",
    location: "Fairfax",
    imageSrc: "/buckHollowInn.webp",
    link: "https://www.innatbuckhollow.com/",
    address: "2150 Buck Hollow Rd, Fairfax, VT 05454",
    price: "$211/night",
    phone: "(802) 849-2400",
    ctaLabel: "View Website",
    description:
      "A charming bed & breakfast just minutes from the venue. 4 cozy rooms available with full Vermont country breakfast included.",
  },
  {
    id: 3,
    name: "Meadow Cottage on Organic Farm with Mountain Views",
    category: "Airbnb",
    location: "Fairfield",
    imageSrc:
      "https://a0.muscache.com/im/pictures/6766d643-c571-419c-9a02-6e591eea53b1.jpg?im_w=720&width=720&quality=70&auto=webp",
    link: "https://www.airbnb.com/rooms/35615568?adults=2&check_in=2026-09-26&check_out=2026-09-27&search_mode=regular_search&source_impression_id=p3_1781053672_P3No8lXf62V1Ylcq&previous_page_section_name=1000&federated_search_id=07d28d22-c624-460c-af63-703dae2cc49a",
    address: "Fairfield, Vermont",
    price: "$217/night",
    ctaLabel: "View Airbnb",
    description:
      "Guest-favorite farm stay on a 300-acre organic dairy farm with mountain views, a full cottage setup, and access to the pond and surrounding property.",
  },
  {
    id: 4,
    name: "Firefly Meadows Farm Hobbit Hole Cabin",
    category: "Airbnb",
    location: "Fairfax",
    imageSrc:
      "https://a0.muscache.com/im/pictures/7f975e0d-8c90-44c5-999c-dbb1bf0488eb.jpg?im_w=720&width=720&quality=70&auto=webp",
    link: "https://www.airbnb.com/rooms/37852772?adults=2&check_in=2026-09-26&check_out=2026-09-27&search_mode=regular_search&source_impression_id=p3_1781053592_P3MOsKfmUlDlxEbO&previous_page_section_name=1000&federated_search_id=07d28d22-c624-460c-af63-703dae2cc49a",
    address: "Fairfax, Vermont",
    price: "$102/night",
    ctaLabel: "View Airbnb",
    description:
      "Private guesthouse room for 2 guests at Firefly Meadows Farm, with a cozy cabin feel and one of the lowest nearby nightly rates.",
  },
  {
    id: 5,
    name: "Beautiful Farmhouse Stay",
    category: "Airbnb",
    location: "Milton",
    imageSrc:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTExNTk5Njg1ODI5Njg1NjgwOA==/original/4843dd05-d819-419d-84f6-60ad81a3ffc9.jpeg?im_w=720&width=720&quality=70&auto=webp",
    link: "https://www.airbnb.com/rooms/1115996858296856808?adults=2&check_in=2026-09-26&check_out=2026-09-27&search_mode=regular_search&category_tag=Tag%3A8678&photo_id=1933191245&source_impression_id=p3_1781053625_P38WdeZHpn1kuNaa&previous_page_section_name=1000&federated_search_id=07d28d22-c624-460c-af63-703dae2cc49a",
    address: "Milton, Vermont",
    price: "$152/night",
    ctaLabel: "View Airbnb",
    description:
      "Guest-favorite farmhouse room with a private attached bathroom, self check-in, and a quiet home base about 20 to 25 minutes from Burlington.",
  },
  {
    id: 6,
    name: "The Shaded Jewel - A Hidden Getaway",
    category: "Airbnb",
    location: "Milton",
    imageSrc:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQxMjY0ODY1Mzg2NzI1NDExNA==/original/78d90e4e-aa33-49f8-86a0-e5bfd882bfed.jpeg?im_w=720&width=720&quality=70&auto=webp",
    link: "https://www.airbnb.com/rooms/1412648653867254114?adults=2&check_in=2026-09-26&check_out=2026-09-27&search_mode=regular_search&source_impression_id=p3_1781053646_P3UET_k3XfWEUdPK&previous_page_section_name=1000&federated_search_id=07d28d22-c624-460c-af63-703dae2cc49a",
    address: "Milton, Vermont",
    price: "$261/night",
    ctaLabel: "View Airbnb",
    description:
      "Off-grid tiny home on private acreage with a sauna, creekside deck, and a more secluded getaway option for guests who want a full space to themselves.",
  },
  {
    id: 7,
    name: "Retreat to this cozy and private escape",
    category: "Airbnb",
    location: "Fairfax",
    imageSrc:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1673430162842809808/original/65acfde6-c1c6-4872-a23d-fb2088e7b085.jpeg?im_w=720&width=720&quality=70&auto=webp",
    link: "https://www.airbnb.com/rooms/1673430162842809808?adults=2&check_in=2026-09-26&check_out=2026-09-27&search_mode=regular_search&source_impression_id=p3_1781053513_P35IlC66xQ2AXy6H&previous_page_section_name=1000&federated_search_id=07d28d22-c624-460c-af63-703dae2cc49a",
    address: "Fairfax, Vermont",
    price: "$159/night",
    ctaLabel: "View Airbnb",
    description:
      "Brand-new camper/RV stay for 2 guests with a private country setting, deck, fire pit, grill, and easy access to the venue area.",
  },
];

export default function Page() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      {/* Header */}
      <h1
        className={`${playfair.className} text-2xl md:text-3xl text-center mb-6`}
      >
        Accommodations
      </h1>

      {/* Intro */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <p className="text-lg text-gray-700 mb-4">
          We have room blocks at two hotels within 25 minutes of the venue, plus a few Airbnb options nearby.
        </p>
        <p className="text-gray-600">
          Call and mention the <span className="font-semibold">Hendricks-Okrant wedding</span> for our group rate.
        </p>
      </div>

      {/* Accommodation Cards */}
      <div className="flex flex-col gap-12">
        {accommodations.map((accommodation) => (
          <div
            key={accommodation.id}
            className="bg-stone-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Image */}
            {accommodation.imageSrc ? (
              <div className="relative w-full h-56 md:h-72">
                <Image
                  alt={accommodation.name}
                  src={accommodation.imageSrc}
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="text-center mb-4">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-2">
                  {accommodation.category}
                </p>
                <h2 className="text-2xl font-semibold">{accommodation.name}</h2>
                <p className="text-gray-500">{accommodation.location}</p>
              </div>

              <p className="text-gray-700 text-center mb-6">
                {accommodation.description}
              </p>

              {/* Details with icons */}
              <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 text-gray-600 mb-6">
                <div className="flex items-center gap-2 justify-center">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span className="text-sm">{accommodation.address}</span>
                </div>
                {accommodation.phone ? (
                  <div className="flex items-center gap-2 justify-center">
                    <FaPhone className="text-gray-400" />
                    <span className="text-sm">{accommodation.phone}</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-2 justify-center">
                  <FaDollarSign className="text-gray-400" />
                  <span className="text-sm">{accommodation.price}</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <a
                  href={accommodation.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-gray-700 transition-colors font-medium"
                >
                  {accommodation.ctaLabel}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
