import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
          Yappyy
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Find your unique voice and express yourself authentically. Build confidence, creativity, and courage to share your thoughts and ideas with the world.
        </p>
        <div className="space-y-4 mb-12">
          <p className="text-lg text-gray-600">
            ✨ Discover your authentic voice and build confidence
          </p>
          <p className="text-lg text-gray-600">
            🎨 Express your creativity and imagination
          </p>
          <p className="text-lg text-gray-600">
            🤝 Connect with others and build friendships
          </p>
          <p className="text-lg text-gray-600">
            🚀 Share your ideas and make a difference
          </p>
        </div>
        <div className="space-y-4">
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg rounded-lg w-full max-w-sm"
          >
            Sign In with Replit
          </Button>
          <Button 
            onClick={() => window.location.href = '/api/auth/google'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg w-full max-w-sm"
          >
            Sign In with Google
          </Button>
        </div>
        <p className="mt-4 text-gray-500">
          Choose your preferred sign-in method to start your voice discovery journey
        </p>
      </div>
    </div>
  );
}