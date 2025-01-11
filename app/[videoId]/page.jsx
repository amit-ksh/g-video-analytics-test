import VideoPlayer from "@/components/VideoPlayer";

export default function HomePage() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="h-full flex flex-col justify-between max-w-4xl mx-auto">
        <VideoPlayer />
        <div className="text-center py-4 text-sm text-gray-500">
          Powered by <span className="font-semibold">SynthLabs</span>
        </div>
      </div>
    </div>
  );
}
