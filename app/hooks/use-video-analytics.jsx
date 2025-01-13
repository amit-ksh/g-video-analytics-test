"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { useEffect, useRef } from "react";

export const useVideoAnalytics = (videoRef, videoId) => {
  // Store timestamp ranges for most watched sections
  const watchedSegments = useRef(new Map()); // Key: segmentStart, Value: viewCount
  const lastPosition = useRef(0);
  const segmentInterval = 5; // Track every 5 seconds segment

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoId) return;

    let startTime = Date.now();
    let playTimer;
    let lastUpdateTime = 0;

    // Initialize video view
    const initializeView = () => {
      sendGAEvent("event", "video_start", {
        event_category: "Video",
        event_label: videoId,
        video_id: videoId,
        video_duration: video.duration,
        timestamp: new Date().toISOString(),
        device_type: getDeviceType(),
        full_screen: document.fullscreenElement !== null,
      });
    };

    // Track video segments
    const updateWatchedSegment = (currentTime) => {
      const segmentStart =
        Math.floor(currentTime / segmentInterval) * segmentInterval;
      const count = watchedSegments.current.get(segmentStart) || 0;
      watchedSegments.current.set(segmentStart, count + 1);
    };

    // Get device type
    const getDeviceType = () => {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua))
        return "tablet";
      if (
        /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/.test(
          ua
        )
      )
        return "mobile";
      return "desktop";
    };

    // Event Handlers
    const handlePlay = () => {
      startTime = Date.now();
      playTimer = setInterval(() => {
        updateWatchedSegment(video.currentTime);
      }, 1000);

      sendGAEvent("event", "video_play", {
        event_category: "Video",
        event_label: videoId,
        video_id: videoId,
        current_time: video.currentTime,
        timestamp: new Date().toISOString(),
      });
    };

    const handlePause = () => {
      clearInterval(playTimer);
      const watchDuration = (Date.now() - startTime) / 1000;

      sendGAEvent("event", "video_pause", {
        event_category: "Video",
        event_label: videoId,
        video_id: videoId,
        current_time: video.currentTime,
        watch_duration: watchDuration,
        timestamp: new Date().toISOString(),
      });
    };

    const handleEnded = () => {
      clearInterval(playTimer);
      const watchDuration = (Date.now() - startTime) / 1000;

      sendGAEvent("event", "video_complete", {
        event_category: "Video",
        event_label: videoId,
        video_id: videoId,
        watch_duration: watchDuration,
        timestamp: new Date().toISOString(),
      });

      // Send most watched segments data
      const segmentData = Object.fromEntries(watchedSegments.current);
      sendGAEvent("event", "video_segments_watched", {
        event_category: "Video",
        event_label: videoId,
        video_id: videoId,
        segments: JSON.stringify(segmentData),
      });
    };

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const now = Date.now();

      // Only update every second to avoid excessive events
      if (now - lastUpdateTime >= 1000) {
        // Track retention at key points
        const progress = (currentTime / video.duration) * 100;
        if (progress >= 25 && lastPosition.current < 25) {
          trackRetention(25);
        } else if (progress >= 50 && lastPosition.current < 50) {
          trackRetention(50);
        } else if (progress >= 75 && lastPosition.current < 75) {
          trackRetention(75);
        }

        lastPosition.current = progress;
        lastUpdateTime = now;
      }
    };

    const handleSeeking = () => {
      sendGAEvent("event", "video_seek", {
        event_category: "Video",
        event_label: videoId,
        video_id: videoId,
        from_time: lastPosition.current,
        to_time: video.currentTime,
        timestamp: new Date().toISOString(),
      });
    };

    const handleRateChange = () => {
      sendGAEvent("event", "playback_rate_change", {
        event_category: "Video",
        event_label: videoId,
        video_id: videoId,
        playback_rate: video.playbackRate,
        timestamp: new Date().toISOString(),
      });
    };

    const handleVolumeChange = () => {
      sendGAEvent("event", "volume_change", {
        event_category: "Video",
        event_label: videoId,
        video_id: videoId,
        volume: video.volume,
        muted: video.muted,
        timestamp: new Date().toISOString(),
      });
    };

    const handleFullscreenChange = () => {
      sendGAEvent("event", "fullscreen_change", {
        event_category: "Video",
        event_label: videoId,
        video_id: videoId,
        is_fullscreen: document.fullscreenElement !== null,
        timestamp: new Date().toISOString(),
      });
    };

    const trackRetention = (percentage) => {
      sendGAEvent("event", "video_retention", {
        event_category: "Video",
        event_label: videoId,
        video_id: videoId,
        retention_percentage: percentage,
        timestamp: new Date().toISOString(),
      });
    };

    // Add event listeners
    video.addEventListener("loadedmetadata", initializeView);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("ratechange", handleRateChange);
    video.addEventListener("volumechange", handleVolumeChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Cleanup
    return () => {
      clearInterval(playTimer);
      video.removeEventListener("loadedmetadata", initializeView);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("ratechange", handleRateChange);
      video.removeEventListener("volumechange", handleVolumeChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [videoId, videoRef]);

  return null;
};
