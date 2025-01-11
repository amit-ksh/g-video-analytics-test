"use client";

import VideoPlayer from "@/components/VideoPlayer";
import { trackVideoEvent } from "@/lib/analytics";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { videoId } = useParams();

  // useEffect(() => {
  //   trackVideoEvent("results_id", videoId);
  // }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <VideoPlayer />
      </div>
    </div>
  );
}
