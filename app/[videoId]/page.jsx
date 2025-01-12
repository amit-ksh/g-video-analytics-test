"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import VideoPlayer from "@/components/VideoPlayer";

export default function HomePage() {
  return (
    <>
      <VideoPlayer />;
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </>
  );
}
