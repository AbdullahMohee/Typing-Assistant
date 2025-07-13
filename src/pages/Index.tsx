import { NextWordPredictor } from '@/components/NextWordPredictor';
import predictionBackground from '@/assets/prediction-background.jpg';

const Index = () => {
  return (
    <div 
      className="min-h-screen bg-gradient-background relative overflow-hidden"
      style={{
        backgroundImage: `url(${predictionBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px]" />
      
      {/* Floating words animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['typing', 'smart', 'efficient', 'keyboard', 'words', 'text', 'writing', 'productivity'].map((word, index) => (
          <div
            key={word}
            className="absolute text-primary/20 font-medium animate-float opacity-30"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              animationDelay: `${index * 0.5}s`,
              fontSize: `${Math.random() * 20 + 16}px`
            }}
          >
            {word}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <NextWordPredictor />
      </div>
    </div>
  );
};

export default Index;
