import VideoPlayer from "@/components/VideoPlayer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <VideoPlayer />
      </div>
    </div>
  );
}
