// src/app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center">
      <Image
        src="/home3.jpg"
        alt="Wedding photo"
        width={1920}
        height={1080}
        priority
        className="w-1/2 h-auto rounded-lg"
      />
    </div>
  );
}
