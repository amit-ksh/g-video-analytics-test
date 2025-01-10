"use client";
import { useRef, useEffect } from "react";
import { trackVideoEvent } from "../lib/analytics";

export default function VideoPlayer() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const trackPlay = () => trackVideoEvent("play", "Video played");
    const trackPause = () => trackVideoEvent("pause", "Video paused");
    const trackEnded = () => trackVideoEvent("ended", "Video completed");
    const trackTimeUpdate = () => {
      const progress = Math.floor((video.currentTime / video.duration) * 100);
      if (progress === 25) trackVideoEvent("progress", "25% watched");
      if (progress === 50) trackVideoEvent("progress", "50% watched");
      if (progress === 75) trackVideoEvent("progress", "75% watched");
    };

    video.addEventListener("play", trackPlay);
    video.addEventListener("pause", trackPause);
    video.addEventListener("ended", trackEnded);
    video.addEventListener("timeupdate", trackTimeUpdate);

    return () => {
      video.removeEventListener("play", trackPlay);
      video.removeEventListener("pause", trackPause);
      video.removeEventListener("ended", trackEnded);
      video.removeEventListener("timeupdate", trackTimeUpdate);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full max-w-3xl rounded-lg shadow-lg"
    >
      <source src="/test.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
