import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, X } from 'lucide-react';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera. Please ensure permissions are granted.');
      console.error(err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Flip horizontally for mirror effect if needed, but for processing usually better raw.
        // We will draw it normally here.
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageData);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div className="relative w-full max-w-2xl aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-chrono-gold/30">
        {!error ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover transform scale-x-[-1]" // Mirror the preview
          />
        ) : (
          <div className="flex items-center justify-center h-full text-red-400 p-6 text-center">
            {error}
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />

        {/* Overlays */}
        <div className="absolute top-4 right-4">
          <button 
            onClick={onCancel}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8">
           <button 
            onClick={() => { stopCamera(); startCamera(); }}
            className="p-3 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full backdrop-blur-sm"
            title="Switch Camera / Restart"
           >
             <RefreshCw size={20} />
           </button>
           
           <button
            onClick={handleCapture}
            className="p-1 rounded-full border-4 border-white/30 hover:border-white/60 transition-all"
           >
             <div className="w-16 h-16 bg-white rounded-full hover:scale-95 transition-transform flex items-center justify-center">
                <Camera className="text-gray-900" size={32} />
             </div>
           </button>
           
           <div className="w-12" /> {/* Spacer for balance */}
        </div>
      </div>
      <p className="mt-4 text-gray-400 font-sans text-sm">Align your face in the center</p>
    </div>
  );
};

export default CameraView;