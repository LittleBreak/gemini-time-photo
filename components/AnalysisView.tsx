import React, { useState } from 'react';
import { analyzeImageWithGemini } from '../services/geminiService';
import { Loader2, ArrowLeft, Upload, ScanEye } from 'lucide-react';

interface AnalysisViewProps {
  initialImage?: string | null;
  onBack: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ initialImage, onBack }) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(''); // Clear previous results
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    setResult('');
    try {
      const analysisText = await analyzeImageWithGemini(image);
      setResult(analysisText);
    } catch (err) {
      setResult("Error analyzing image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-chrono-surface rounded-full text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-serif text-chrono-gold">Deep Image Analysis</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="space-y-6">
          <div className="bg-chrono-surface rounded-xl p-4 border border-gray-700 shadow-lg min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden group">
            {image ? (
              <img 
                src={image} 
                alt="To Analyze" 
                className="w-full h-auto max-h-[400px] object-contain rounded-lg"
              />
            ) : (
              <div className="text-center p-8">
                <ScanEye size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No image selected</p>
              </div>
            )}
            
            {!image && (
                <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-transparent">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                  <span className="mt-20 px-4 py-2 bg-chrono-accent text-white rounded-full shadow hover:bg-blue-600 transition-colors flex items-center gap-2">
                    <Upload size={16} /> Upload Photo
                  </span>
                </label>
            )}
            
            {image && (
               <label className="absolute bottom-4 right-4 cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                  <span className="p-2 bg-gray-900/80 text-white rounded-full hover:bg-black transition-colors block">
                    <Upload size={20} />
                  </span>
               </label>
            )}
          </div>

          <button
            onClick={runAnalysis}
            disabled={!image || isAnalyzing}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
              !image || isAnalyzing 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-chrono-gold text-chrono-dark hover:brightness-110 shadow-chrono-gold/20 shadow-lg'
            }`}
          >
            {isAnalyzing ? (
              <><Loader2 className="animate-spin" /> Neural Processing...</>
            ) : (
              <><ScanEye /> Analyze with Gemini 3 Pro</>
            )}
          </button>
        </div>

        {/* Result Column */}
        <div className="bg-chrono-surface rounded-xl p-6 border border-gray-700 shadow-lg h-full min-h-[400px]">
          <h3 className="text-xl font-serif text-white mb-4 border-b border-gray-700 pb-2">Analysis Report</h3>
          
          {isAnalyzing ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
            </div>
          ) : result ? (
            <div className="prose prose-invert prose-sm max-w-none overflow-y-auto max-h-[500px] text-gray-300">
               <div className="whitespace-pre-wrap">{result}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-600 italic text-center">
              <p>Analysis results will appear here.</p>
              <p className="text-xs mt-2">Powered by Gemini 3 Pro Preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;