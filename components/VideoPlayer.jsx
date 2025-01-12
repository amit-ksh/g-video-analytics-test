"use client";

import { useState, useRef } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useVideoAnalytics } from "@/app/hooks/use-video-analytics";
import { useParams } from "next/navigation";

const VideoPlayer = () => {
  const { videoId } = useParams();
  const videoRef = useRef(null);
  useVideoAnalytics(videoRef, videoId);

  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [detailedFeedback, setDetailedFeedback] = useState({
    usefulness: 0,
    watchMore: 0,
    openFeedback: "",
  });

  const moods = [
    {
      icon: (
        <svg viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="8" cy="9" r="1.5" fill="currentColor" />
          <circle cx="16" cy="9" r="1.5" fill="currentColor" />
          <path
            d="M6.5 17.5C6.5 17.5 9 14 12 14C15 14 17.5 17.5 17.5 17.5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      ),
      label: "Very Sad",
      value: 1,
      color: "text-red-500",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="8" cy="9" r="1.5" fill="currentColor" />
          <circle cx="16" cy="9" r="1.5" fill="currentColor" />
          <path
            d="M7 16.5C7 16.5 9 14.5 12 14.5C15 14.5 17 16.5 17 16.5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      ),
      label: "Sad",
      value: 2,
      color: "text-orange-400",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="8" cy="9" r="1.5" fill="currentColor" />
          <circle cx="16" cy="9" r="1.5" fill="currentColor" />
          <line
            x1="7"
            y1="15"
            x2="17"
            y2="15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      label: "Neutral",
      value: 3,
      color: "text-gray-400",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="8" cy="9" r="1.5" fill="currentColor" />
          <circle cx="16" cy="9" r="1.5" fill="currentColor" />
          <path
            d="M7 14.5C7 14.5 9 16.5 12 16.5C15 16.5 17 14.5 17 14.5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      ),
      label: "Happy",
      value: 4,
      color: "text-green-400",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="8" cy="9" r="1.5" fill="currentColor" />
          <circle cx="16" cy="9" r="1.5" fill="currentColor" />
          <path
            d="M6.5 13.5C6.5 13.5 9 17 12 17C15 17 17.5 13.5 17.5 13.5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      ),
      label: "Very Happy",
      value: 5,
      color: "text-emerald-400",
    },
  ];

  const ratingOptions = [1, 2, 3, 4, 5];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setShowFeedbackDialog(true);
  };

  const handleSubmitFeedback = () => {
    console.log({
      mood: selectedMood,
      detailedFeedback,
    });
    setShowFeedbackDialog(false);
  };

  return (
    <div className="h-full max-w-lg mx-auto flex flex-col justify-between gap-4">
      {/* Filler to center the video element */}
      <div></div>

      {/* Video Player */}
      <div className="bg-black mx-4 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          controls
          className="aspect-square w-full h-auto rounded-lg shadow-lg"
        >
          <source src="/test.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="p-4 mx-4">
        <div className="mt-auto text-center mb-2">
          <h2 className="text-gray-700">How was your experience?</h2>
        </div>

        <div className="grid grid-cols-5 gap-3 md:gap-4">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood)}
              className={cn(
                "flex flex-col justify-center items-center aspect-square size-16 p-2 hover:bg-opacity-80 rounded-lg transition-colors group",
                mood.color,
                selectedMood?.value === mood.value && "ring-2 ring-current"
              )}
            >
              <div className="transition-colors size-6 md:size-7">
                {mood.icon}
              </div>
              <span className="text-xs md:text-sm mt-1 text-nowrap">
                {mood.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-sm font-medium text-gray-400">
          Powered by <span className="font-semibold">SynthLabs</span>
        </div>
        {/* Detailed Feedback Dialog */}
        <AlertDialog
          open={showFeedbackDialog}
          onOpenChange={setShowFeedbackDialog}
        >
          <AlertDialogContent className="max-w-md w-[95%] rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Additional Feedback</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How did you find this information useful?
                    </label>
                    <div className="flex gap-4">
                      {ratingOptions.map((rating) => (
                        <button
                          key={rating}
                          onClick={() =>
                            setDetailedFeedback((prev) => ({
                              ...prev,
                              usefulness: rating,
                            }))
                          }
                          className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                            detailedFeedback.usefulness === rating
                              ? "bg-blue-500 text-white border-blue-500"
                              : "border-gray-300 text-gray-700 hover:border-blue-500"
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How likely are you to watch more videos like this?
                    </label>
                    <div className="flex gap-4">
                      {ratingOptions.map((rating) => (
                        <button
                          key={rating}
                          onClick={() =>
                            setDetailedFeedback((prev) => ({
                              ...prev,
                              watchMore: rating,
                            }))
                          }
                          className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                            detailedFeedback.watchMore === rating
                              ? "bg-blue-500 text-white border-blue-500"
                              : "border-gray-300 text-gray-700 hover:border-blue-500"
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Comments
                    </label>
                    <textarea
                      className="w-full p-3 border rounded-md"
                      rows="4"
                      placeholder="Share your thoughts..."
                      value={detailedFeedback.openFeedback}
                      onChange={(e) =>
                        setDetailedFeedback((prev) => ({
                          ...prev,
                          openFeedback: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitFeedback}>
                Submit Feedback
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default VideoPlayer;
