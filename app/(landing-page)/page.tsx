"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button onClick={() => router.push("/dashboard")} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Go To Dashboard
      </button>
    </div>
  );
}
