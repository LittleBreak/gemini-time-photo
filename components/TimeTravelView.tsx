import React, { useState } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import { Loader2, ArrowLeft, Wand2, Download, RefreshCcw, History, Edit3 } from 'lucide-react';
import { TimeEra } from '../types';

interface TimeTravelViewProps {
  sourceImage: string;
  onBack: () => void;
}

const ERAS: TimeEra[] = [
  {
    id: 'vikings',
    name: 'Viking Age',
    description: 'Fierce warrior in a Nordic fjord.',
    promptModifier: 'Transform this person into a fierce Viking warrior. Wearing leather armor and fur. Background is a dramatic Norwegian fjord with dragon ships. Cinematic lighting, photorealistic, 8k.',
    icon: '⚔️'
  },
  {
    id: '1920s',
    name: 'Roaring 20s',
    description: 'A Gatsby-style party.',
    promptModifier: 'Transform this person into a 1920s flapper or gentleman. Art Deco style, wearing elegant vintage evening wear. Background is a lavish jazz party with champagne towers. Sepia tone, vintage photography style.',
    icon: '🎷'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    description: 'Neon-soaked future.',
    promptModifier: 'Transform this person into a cyberpunk character. Wearing high-tech tactical gear with glowing neon accents. Background is a rainy futuristic city street at night with holograms. Neon lighting, futuristic.',
    icon: '🤖'
  },
  {
    id: 'egypt',
    name: 'Ancient Egypt',
    description: 'Pharaohs and pyramids.',
    promptModifier: 'Transform this person into an Ancient Egyptian royalty. Wearing gold jewelry, linen robes, and a headdress. Background is the Pyramids of Giza at sunset. Golden hour lighting, epic scale.',
    icon: '🐫'
  },
  {
    id: 'victorian',
    name: 'Victorian London',
    description: 'Steampunk and fog.',
    promptModifier: 'Transform this person into a Victorian era detective or aristocrat. Wearing a top hat, coat, and suit. Background is a foggy cobblestone street in London with gas lamps. Moody atmosphere.',
    icon: '🎩'
  }
];

const TimeTravelView: React.FC<TimeTravelViewProps> = ({ sourceImage, onBack }) => {
  const [activeTab, setActiveTab] = useState<'eras' | 'custom'>('eras');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedEraId, setSelectedEraId] = useState<string | null>(null);

  const handleGenerate = async (prompt: string) => {
    setIsProcessing(true);
    setGeneratedImage(null);
    try {
      // Prepend a strong directive for the model to ensure it modifies the person in the image
      const finalPrompt = `Edit this image. ${prompt} Maintain the person's facial identity as much as possible but change the style and environment completely.`;
      
      const resultImage = await editImageWithGemini(sourceImage, finalPrompt);
      setGeneratedImage(resultImage);
    } catch (error) {
      alert("Time travel failed. The vortex is unstable. (API Error)");
    } finally {
      setIsProcessing(false);
    }
  };

  const onSelectEra = (era: TimeEra) => {
    setSelectedEraId(era.id);
    handleGenerate(era.promptModifier);
  };

  const onCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    handleGenerate(customPrompt);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 p-4 md:p-8 animate-fade-in max-w-7xl mx-auto">
      {/* Sidebar Controls */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white">
                <ArrowLeft />
            </button>
            <h2 className="text-2xl font-serif text-chrono-gold">Control Panel</h2>
        </div>

        {/* Source Thumbnail */}
        <div className="bg-chrono-surface p-3 rounded-lg border border-gray-700 flex items-center gap-4">
            <img src={sourceImage} alt="Source" className="w-16 h-16 object-cover rounded-md border border-gray-600" />
            <div className="text-sm text-gray-400">
                <p className="font-semibold text-white">Source Identity</p>
                <p>Ready for transport</p>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-900 p-1 rounded-lg">
            <button 
                onClick={() => setActiveTab('eras')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'eras' ? 'bg-chrono-surface text-chrono-gold shadow' : 'text-gray-500 hover:text-white'}`}
            >
                <History className="inline w-4 h-4 mr-2" /> Time Travel
            </button>
            <button 
                onClick={() => setActiveTab('custom')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'custom' ? 'bg-chrono-surface text-chrono-gold shadow' : 'text-gray-500 hover:text-white'}`}
            >
                <Edit3 className="inline w-4 h-4 mr-2" /> Custom Edit
            </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {activeTab === 'eras' ? (
                <div className="grid grid-cols-1 gap-3">
                    {ERAS.map((era) => (
                        <button
                            key={era.id}
                            onClick={() => onSelectEra(era)}
                            disabled={isProcessing}
                            className={`p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                                selectedEraId === era.id 
                                    ? 'border-chrono-gold bg-chrono-gold/10' 
                                    : 'border-gray-700 bg-chrono-surface hover:border-chrono-gold/50'
                            }`}
                        >
                            <span className="text-3xl">{era.icon}</span>
                            <div>
                                <h3 className="font-bold text-white">{era.name}</h3>
                                <p className="text-xs text-gray-400">{era.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="bg-chrono-surface p-6 rounded-xl border border-gray-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Wand2 className="text-chrono-accent" /> Nano Banana Editor
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">
                        Describe how you want to change the image. E.g., "Add sunglasses", "Make it a pencil sketch", "Change background to Mars".
                    </p>
                    <form onSubmit={onCustomSubmit}>
                        <textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="Enter your command..."
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-chrono-gold focus:outline-none min-h-[120px] mb-4 text-sm"
                        />
                        <button
                            type="submit"
                            disabled={isProcessing || !customPrompt.trim()}
                            className="w-full bg-chrono-accent hover:bg-blue-600 text-white py-3 rounded-lg font-bold disabled:opacity-50 transition-colors"
                        >
                            Generate Edit
                        </button>
                    </form>
                </div>
            )}
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 bg-black/40 rounded-2xl border border-gray-800 flex items-center justify-center relative overflow-hidden group">
        
        {/* Loading State */}
        {isProcessing && (
            <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <Loader2 className="w-16 h-16 text-chrono-gold animate-spin mb-4" />
                <p className="text-chrono-gold font-serif text-xl animate-pulse">Manipulating Timeline...</p>
                <p className="text-gray-500 text-sm mt-2">Using Gemini 2.5 Flash Image</p>
            </div>
        )}

        {/* Display Image */}
        {generatedImage ? (
            <img 
                src={generatedImage} 
                alt="Generated Time Travel" 
                className="max-w-full max-h-full object-contain shadow-2xl"
            />
        ) : (
            <div className="flex flex-col items-center opacity-30">
                <History size={64} className="mb-4 text-white" />
                <p className="text-xl font-serif text-white">Select a destination</p>
            </div>
        )}

        {/* Actions Overlay */}
        {generatedImage && !isProcessing && (
            <div className="absolute bottom-6 flex gap-4">
                <a 
                    href={generatedImage} 
                    download="chronosnap-result.png"
                    className="flex items-center gap-2 px-6 py-3 bg-chrono-gold text-chrono-dark font-bold rounded-full shadow-lg hover:brightness-110 transition-all transform hover:scale-105"
                >
                    <Download size={20} /> Download
                </a>
                <button 
                    onClick={() => { setGeneratedImage(null); setSelectedEraId(null); }}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-full shadow-lg hover:bg-gray-200 transition-all"
                >
                    <RefreshCcw size={20} /> Reset
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default TimeTravelView;