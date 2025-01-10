"use client";

import { useState, useRef, useEffect } from "react";
import { trackVideoEvent } from "../lib/analytics";

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const [progressTracked, setProgressTracked] = useState({
    25: false,
    50: false,
    75: false,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const trackPlay = () => trackVideoEvent("play", "Video played");
    const trackPause = () => trackVideoEvent("pause", "Video paused");
    const trackEnded = () => trackVideoEvent("ended", "Video completed");
    const trackTimeUpdate = () => {
      const progress = Math.floor((video.currentTime / video.duration) * 100);

      [25, 50, 75].forEach((milestone) => {
        if (progress >= milestone && !progressTracked[milestone]) {
          trackVideoEvent("progress", `${milestone}% watched`);
          setProgressTracked((prev) => ({ ...prev, [milestone]: true }));
        }
      });
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
  }, [progressTracked]);

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
