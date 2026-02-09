import { Home, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-sm">
        {/* Emoji */}
        <div className="text-6xl mb-6">🐨</div>
        
        {/* Message */}
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Oops! Page not found
        </h1>
        <p className="text-slate-500 mb-8">
          Looks like this page wandered off. Let's get you back on track.
        </p>
        
        {/* Actions */}
        <div className="space-y-3">
          <a href="/" className="block">
            <Button className="w-full bg-slate-800 hover:bg-slate-700">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </a>
          <a href="/" className="block">
            <Button variant="outline" className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Talk to Nunu
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
