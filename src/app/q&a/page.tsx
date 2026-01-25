// src/app/page.tsx
import Image from "next/image";

export default function Page() {
  return (
    // Outer container for the page content
    // We add max-w-[1400px] and mx-auto to center the content and not stretch it to the edge
    <div className="w-full max-w-5xl mx-auto">
      
      <p>Can I bring a plus one?</p>
      <p>Is this wedding kid-friendly?</p>
      <p>Will there be parking at the venue?</p>
      <p>Is there a shuttle?</p>
      <p>What is the dress code?</p>

    </div>
  );
}
