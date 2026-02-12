// src/app/accommodations/page.tsx
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { FaMapMarkerAlt, FaPhone, FaDollarSign } from "react-icons/fa";

const playfair = Playfair_Display({
  weight: "400",
  subsets: ["latin"],
});

const hotels = [
  {
    id: 1,
    name: "Hampton Inn",
    location: "Saint Albans",
    imageSrc: "/hampton.jpg",
    link: "https://www.hilton.com/en/hotels/btvsahx-hampton-st-albans/",
    address: "43 Lake St, St Albans City, VT 05478",
    price: "$289/night",
    phone: "(802) 528-5020",
    description:
      "A great option with modern amenities, a short drive from the festivities. Pet friendly (fee applies). EV charging available next door.",
  },
  {
    id: 2,
    name: "Inn at Buck Hollow Farm",
    location: "Fairfax",
    imageSrc: "/buckHollowInn.webp",
    link: "https://www.innatbuckhollow.com/",
    address: "2150 Buck Hollow Rd, Fairfax, VT 05454",
    price: "$211/night",
    phone: "(802) 849-2400",
    description:
      "A charming bed & breakfast just minutes from the venue. 4 cozy rooms available with full Vermont country breakfast included.",
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
          We have room blocks at two hotels within 25 minutes of the venue.
        </p>
        <p className="text-gray-600">
          Call and mention the <span className="font-semibold">Hendricks-Okrant wedding</span> for our group rate.
        </p>
      </div>

      {/* Hotel Cards */}
      <div className="flex flex-col gap-12">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-stone-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="relative w-full h-56 md:h-72">
              <Image
                alt={hotel.name}
                src={hotel.imageSrc}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-semibold">{hotel.name}</h2>
                <p className="text-gray-500">{hotel.location}</p>
              </div>

              <p className="text-gray-700 text-center mb-6">{hotel.description}</p>

              {/* Details with icons */}
              <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 text-gray-600 mb-6">
                <div className="flex items-center gap-2 justify-center">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span className="text-sm">{hotel.address}</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <FaPhone className="text-gray-400" />
                  <span className="text-sm">{hotel.phone}</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <FaDollarSign className="text-gray-400" />
                  <span className="text-sm">{hotel.price}</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <a
                  href={hotel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-gray-700 transition-colors font-medium"
                >
                  View Website
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-gray-500 mt-12 text-sm">
        You may also explore options on Airbnb and VRBO.
      </p>
    </div>
  );
}
