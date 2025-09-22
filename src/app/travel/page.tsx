// src/app/travel/page.tsx
import Image from 'next/image';

// Array of hotel data with added description field
const hotels = [
  {
    id: 1,
    name: 'Holiday Inn, Saint Albans',
    imageSrc: '/holiday3.jpg',
    link: 'https://www.ihg.com/holidayinnexpress/hotels/us/en/st-albans-city/btvsa/hoteldetail',
    address: '1205 Airport Road, Saint Albans, VT 05478',
    price: '$$$',
    description: 'This is the most convenient option, located under 15 minutes from our venue. This hotel is also pet friendly and has a daily hot breakfast buffet! It even includes a fitness center and a pool.',
  },
  {
    id: 2,
    name: 'Hampton Inn, Saint Albans',
    imageSrc: '/hampton.jpg',
    link: 'https://www.hilton.com/en/hotels/btvsahx-hampton-st-albans/',
    address: '4616 Airport Road, Saint Albans, VT 05478',
    price: '$$$',
    description: 'A great option with modern amenities, also a short drive from the festivities. Pet friendly but includes a pet fee. Has EV charging next door.',
  },
  {
    id: 3,
    name: 'Hampton Inn, Colchester',
    imageSrc: '/HamptonColchester.jpeg',
    link: 'https://www.hilton.com/en/hotels/btvmvhx-hampton-colchester/',
    address: '1205 Airport Road, Saint Albans, VT 05478',
    price: '$$$',
    description: 'A third option located slightly further away, but still within a 25-minute drive. This hotel offers a different experience with its Colchester location. It includes free breakfast, free parking, a fitness center and a pool.',
  },
];

export default function Page() {
  return (
    // Add border and padding to the main container
    // Use `p-6` for some spacing inside the border
    <div className="w-full max-w-[1100px] mx-auto rounded-lg">
      <div className="text-center md:pb-10">
        <br></br>
        <p className="text-sm md:text-base">We are doing a hotel room block at three different hotels all within 25 minutes of the venue.</p>
        <p className="text-sm md:text-base">To get our hotel block rate, please give the hotel a call, and let them know you are attending the Hendricks Okrant wedding.</p>
        <p className="text-sm md:text-base">Outside of these options, guests may be interested in exploring accommodations on Airbnb and VRBO.</p>
      </div>

      {/* Container for all accommodations */}
      <div className="flex flex-col gap-8 items-center">
        {hotels.map((hotel) => (
          // Add border, padding, and a subtle shadow to each hotel option
          <div key={hotel.id} className="flex flex-col md:flex-row items-center gap-4 group rounded-lg transition-colors duration-200 border border-gray-300 p-4 w-full shadow-sm">
            {/* Link wraps only the image. */}
              <Image 
                  alt={hotel.name} 
                  src={hotel.imageSrc}
                  width={700} 
                  height={700} 
                  className="w-full md:w-1/3 rounded-lg overflow-hidden max-h-[250px] md:max-h-[300px] transition-transform duration-200"
              />
  

            {/* Container for hotel details. Takes 50% width on medium screens and up. */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-1">
              <h1 className="text-lg md:text-xl font-semibold hover:underline"><a href={hotel.link}>{hotel.name}</a></h1>
              <p className="text-sm md:text-base">{hotel.description}</p>
              <div className="space-y-0.5 mt-2">
                <p className="text-xs md:text-sm"><b>Address:</b> {hotel.address}</p>
                <p className="text-xs md:text-sm"><b>Price:</b> {hotel.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
