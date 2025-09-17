import './accommodations.css'
import Image from 'next/image';

// I want to make it so thase go down in a row - are clickable and more
export default function Page() {
  return (
    <div className="grid grid-rows-[1fr_auto] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 bg-[#d5dad47f]">
      {/* 
        The main container now holds two separate flex items, one for each hotel.
        To maintain vertical layout for these rows, use flex-col on the main element.
      */}
      <main className="flex flex-col gap-[32px] row-start-1 items-center sm:items-start">
        {/* Row 1: Holiday Inn */}
        <div className="flex items-center gap-4">
          <h1>Holiday Inn, Saint Albans</h1>
          <Image 
              alt="Holiday Inn, Saint Albans" 
              src="/holiday.jpg"
              className="hotel-image"
              width={500} 
              height={300} 
          />
        </div>
        
        {/* Row 2: Hampton Inn */}
        <div className="flex items-center gap-4">
          <h1>Hampton Inn, Saint Albans</h1>
          <Image 
              alt="Hampton Inn, Saint Albans" 
              src="/hampton.jpg"
              className="hotel-image"
              width={500} 
              height={300} 
          />
        </div>
      </main>
    </div>
  );
}
