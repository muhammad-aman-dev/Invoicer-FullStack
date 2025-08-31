"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(10);

  // helper function for timeout
  async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function countdown() {
    let i = 10;
    while (i > 0) {
      await delay(1000);
      setSeconds(i - 1);
      i--;
    }
  }

  useEffect(() => {
    countdown();
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      router.push("/");
    }
  }, [seconds, router]);

  return (
    <div className="flex flex-col text-gray-800 items-center justify-center h-screen gap-6">
      <span className="font-bold text-4xl text-center">
        Sorry, Can&apos;t Find Your Page!
      </span>
      <Link
        href="/"
        className=" text-gray-800 border-2 hover:border-violet-700 rounded-3xl p-5 hover:bg-violet-700 hover:text-white duration-1000 transition-all"
      >
        Go Back To Home Page
      </Link>
      <span className="font-bold text-2xl">
        Redirecting in {seconds} seconds
      </span>
    </div>
  );
}
