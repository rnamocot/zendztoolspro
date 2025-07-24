export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-custom rounded-2xl mb-6 mx-auto animate-pulse">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl animate-spin">
            <div className="w-full h-full rounded-xl border-2 border-white/30 border-t-white"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-white mb-4">
          Loading Zendz Tools
        </h2>
        
        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce delay-200"></div>
        </div>
        
        {/* Loading Bar */}
        <div className="w-64 h-2 bg-white/20 rounded-full mt-6 mx-auto overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}