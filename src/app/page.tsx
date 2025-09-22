// src/app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Image src="/bwkiss.jpg" alt="Wedding photo" width={500} height={300} priority className="w-full h-auto rounded-lg" />
      <Image src="/bwalk.jpg" alt="Wedding photo" width={500} height={300} priority className="w-full h-auto rounded-lg" />
      <Image src="/bwholding.jpg" alt="Wedding photo" width={500} height={300} priority className="w-full h-auto rounded-lg" />
    </div>
  );
}
