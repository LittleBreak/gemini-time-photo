import React, { useState } from 'react';
import { AppView } from './types';
import CameraView from './components/CameraView';
import TimeTravelView from './components/TimeTravelView';
import AnalysisView from './components/AnalysisView';
import { Camera, ScanEye, Sparkles, Clock, ImagePlus, History } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setView(AppView.PREVIEW);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-chrono-dark to-[#050914] text-gray-100 flex flex-col font-sans selection:bg-chrono-gold selection:text-black">
      
      {/* Header */}
      <header className="p-6 border-b border-white/10 flex justify-between items-center backdrop-blur-md sticky top-0 z-40">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => {
            setView(AppView.HOME);
            setCapturedImage(null);
          }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-chrono-gold to-yellow-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.5)]">
            <Clock className="text-chrono-dark" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wider">
            Chrono<span className="text-chrono-gold">Snap</span>
          </h1>
        </div>
        
        <div className="text-xs text-gray-500 hidden sm:block border border-gray-800 px-3 py-1 rounded-full">
            Powered by Google Gemini 2.5 & 3.0
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        
        {view === AppView.HOME && (
          <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center animate-fade-in-up">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                Step into the <br/>
                <span className="text-chrono-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Time Machine</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-md leading-relaxed">
                Take a selfie and transport yourself to the Viking Age, the Roaring 20s, or a Cyberpunk future. Powered by the latest Gemini generative AI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => setView(AppView.CAMERA)}
                  className="flex-1 bg-chrono-gold hover:bg-yellow-500 text-chrono-dark font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                >
                  <Camera size={24} />
                  Start Camera
                </button>
                <button 
                  onClick={() => setView(AppView.ANALYSIS)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all border border-gray-700 hover:border-gray-500"
                >
                  <ScanEye size={24} />
                  Analyze Image
                </button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-chrono-gold to-chrono-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gray-900 rounded-2xl p-4 border border-gray-800 aspect-[4/3] flex flex-col items-center justify-center overflow-hidden">
                <div className="grid grid-cols-2 gap-4 w-full h-full opacity-60">
                   <div className="bg-gray-800 rounded-lg animate-pulse delay-75"></div>
                   <div className="bg-gray-800 rounded-lg animate-pulse delay-150"></div>
                   <div className="bg-gray-800 rounded-lg animate-pulse delay-300"></div>
                   <div className="bg-gray-800 rounded-lg animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                   <Sparkles className="w-16 h-16 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        )}

        {view === AppView.CAMERA && (
          <CameraView 
            onCapture={handleCapture} 
            onCancel={() => setView(AppView.HOME)} 
          />
        )}

        {/* Middleware state: Image Captured, choose action */}
        {view === AppView.PREVIEW && capturedImage && (
          <div className="max-w-4xl w-full animate-fade-in flex flex-col items-center">
            <h2 className="text-2xl font-serif text-white mb-8">Image Captured. Choose your path.</h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
               {/* Source Preview */}
               <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-gray-700 shadow-2xl">
                 <img src={capturedImage} alt="Captured" className="w-full h-full object-cover transform scale-x-[-1]" />
                 <button 
                    onClick={() => setView(AppView.CAMERA)}
                    className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
                 >
                   Retake
                 </button>
               </div>

               {/* Action Buttons */}
               <div className="grid grid-cols-1 gap-4 w-full md:w-auto">
                 <button 
                    onClick={() => setView(AppView.RESULT)}
                    className="flex items-center gap-4 p-6 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-chrono-gold rounded-xl transition-all group w-full md:w-80 text-left"
                 >
                    <div className="p-3 bg-chrono-gold/10 rounded-full text-chrono-gold group-hover:bg-chrono-gold group-hover:text-black transition-colors">
                      <History size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">Time Travel</h3>
                      <p className="text-sm text-gray-400">Insert yourself into history.</p>
                    </div>
                 </button>

                 <button 
                    onClick={() => setView(AppView.ANALYSIS)}
                    className="flex items-center gap-4 p-6 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-chrono-accent rounded-xl transition-all group w-full md:w-80 text-left"
                 >
                    <div className="p-3 bg-chrono-accent/10 rounded-full text-chrono-accent group-hover:bg-chrono-accent group-hover:text-white transition-colors">
                      <ScanEye size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">Analyze Identity</h3>
                      <p className="text-sm text-gray-400">What does Gemini see?</p>
                    </div>
                 </button>
               </div>
            </div>
          </div>
        )}

        {view === AppView.RESULT && capturedImage && (
          <TimeTravelView 
            sourceImage={capturedImage} 
            onBack={() => setView(AppView.PREVIEW)} 
          />
        )}

        {view === AppView.ANALYSIS && (
          <AnalysisView 
            initialImage={capturedImage} 
            onBack={() => capturedImage ? setView(AppView.PREVIEW) : setView(AppView.HOME)} 
          />
        )}

      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-600 text-sm border-t border-white/5">
        &copy; {new Date().getFullYear()} ChronoSnap. Time travel is experimental.
      </footer>
    </div>
  );
};

export default App;