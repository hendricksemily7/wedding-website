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
		description:
			'This is the most convenient option, located under 15 minutes from our venue. This hotel is also pet friendly and has a daily hot breakfast buffet! It even includes a fitness center and a pool.',
	},
	{
		id: 2,
		name: 'Hampton Inn, Saint Albans',
		imageSrc: '/hampton.jpg',
		link: 'https://www.hilton.com/en/hotels/btvsahx-hampton-st-albans/',
		address: '4616 Airport Road, Saint Albans, VT 05478',
		price: '$289/night',
		description:
			'A great option with modern amenities, also a short drive from the festivities. Pet friendly but includes a pet fee. Has EV charging next door.',
	},
	{
		id: 3,
		name: 'Inn at Buckhollow Farm, Fairfax',
		imageSrc: '/buckHollowInn.webp',
		link: 'https://www.innatbuckhollow.com/',
		address: '2150 Buck Hollow Rd, Fairfax, VT 05454',
		price: '$211/night',
		description:
			'Located in close proximity of the venue, this adorable bed & breakfast offers 4 bedrooms (3 queens, 1 king). Includes full Vermont country breakfast.',
	},
];

export default function Page() {
	return (
		// Add border and padding to the main container
		// Use `p-6` for some spacing inside the border
		<div className="w-full max-w-[1100px] mx-auto rounded-lg">
			<div className="text-center pb-10">
				<p className="text-sm md:text-base">
					We are doing a hotel room block at three different hotels all within 25
					minutes of the venue.
				</p>
				<p className="text-sm md:text-base">
					To get our hotel block rate, please give the hotel a call, and let them
					know you are attending the Hendricks Okrant wedding.
				</p>
				<p className="text-sm md:text-base">
					Outside of these options, guests may be interested in exploring
					accommodations on Airbnb and VRBO.
				</p>
			</div>

			{/* Container for all accommodations */}
			<div className="flex flex-col gap-8 items-center">
				{hotels.map((hotel) => (
					<a
						key={hotel.id}
						href={hotel.link}
						target="_blank"
						rel="noopener noreferrer"
						className="w-full"
					>
						<div className="bg-white flex flex-col md:flex-row items-center gap-4 group rounded-lg transition-all duration-200 border border-gray-300 p-4 w-full shadow-sm md:h-[250px] overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-1">
							{/* Hotel image: always visible, not a link anymore */}
							<div className="hidden md:block">
								<Image
									alt={hotel.name}
									src={hotel.imageSrc}
									width={180}
									height={180}
									className="md:w-[180px] md:h-[180px] md:rounded-lg md:mb-0 object-cover"
								/>
							</div>
							<div className="block md:hidden">
								<Image
									alt={hotel.name}
									src={hotel.imageSrc}
									width={80}
									height={80}
									className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
								/>
							</div>

							{/* Hotel details */}
							<div className="w-full md:w-1/2 flex flex-col items-start text-left gap-1">
								<h1 className="text-lg md:text-xl font-semibold">
									{hotel.name}
								</h1>
								<p className="text-sm md:text-base">
									{hotel.description}
								</p>
								<div className="flex flex-wrap gap-4 mt-2 text-xs md:text-sm">
									<span>
										<b>Address:</b> {hotel.address}
									</span>
									<span>
										<b>Price:</b> {hotel.price}
									</span>
								</div>
								{/* Website link: show only on mobile */}
								<span className="mt-2 text-[#2D4D3A] underline font-medium text-xs md:text-sm block md:hidden">
									Website
								</span>
							</div>
						</div>
					</a>
				))}
			</div>
		</div>
	);
}
