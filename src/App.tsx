import React, { useState } from 'react';
import { Search, AlertCircle, Clock, Heart, User, Stethoscope, Activity } from 'lucide-react';
import { ErrorBoundary } from './utils/errorBoundary';
import { DebugPanel } from './components/DebugPanel';
import { CMSPanel } from './components/CMSPanel';
import { logger } from './utils/logger';

interface MedicalCondition {
  name: string;
  description: string;
  causes: string;
  precautions: string;
  advice: string;
  urgency: 'immediate' | 'moderate' | 'monitor';
}

function App() {
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<MedicalCondition[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showCMSPanel, setShowCMSPanel] = useState(false);

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    
    logger.info('Starting symptom analysis', { symptomsLength: symptoms.length });
    
    setIsAnalyzing(true);
    setHasAnalyzed(true);
    
    try {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock medical analysis based on common symptoms
    const mockAnalysis = generateMockAnalysis(symptoms.toLowerCase());
      
      logger.info('Symptom analysis completed', { 
        conditionsFound: mockAnalysis.length,
        conditions: mockAnalysis.map(c => c.name)
      });
      
    setResults(mockAnalysis);
    } catch (error) {
      logger.error('Error during symptom analysis', { error: error instanceof Error ? error.message : 'Unknown error' }, error instanceof Error ? error : undefined);
      setResults([]);
    } finally {
    setIsAnalyzing(false);
    }
  };

  const generateMockAnalysis = (symptomsText: string): MedicalCondition[] => {
    logger.debug('Generating mock analysis', { symptomsText });
    
    if (symptomsText.length < 3) {
      logger.warn('Symptoms text too short for analysis', { length: symptomsText.length });
      return [];
    }

    // Common symptom patterns and their associated conditions
    const conditions: MedicalCondition[] = [];

    if (symptomsText.includes('fever') || symptomsText.includes('headache') || symptomsText.includes('tired')) {
      logger.debug('Detected cold-like symptoms');
      conditions.push({
        name: "Common Cold",
        description: "A viral infection of the upper respiratory tract causing mild to moderate symptoms.",
        causes: "Viral infection, usually rhinovirus or coronavirus, spread through droplets or contact.",
        precautions: "Rest, stay hydrated, wash hands frequently, avoid close contact with others.",
        advice: "Monitor at home. See a doctor if symptoms worsen or persist beyond 10 days.",
        urgency: "monitor"
      });
    }

    if (symptomsText.includes('cough') || symptomsText.includes('throat') || symptomsText.includes('congestion')) {
      logger.debug('Detected respiratory symptoms');
      conditions.push({
        name: "Upper Respiratory Infection",
        description: "Infection affecting the nose, throat, and upper airways causing inflammation.",
        causes: "Bacterial or viral pathogens, allergens, or environmental irritants.",
        precautions: "Rest your voice, drink warm liquids, use a humidifier, avoid smoking.",
        advice: "Usually resolves in 7-10 days. Consult a doctor if fever exceeds 102°F.",
        urgency: "monitor"
      });
    }

    if (symptomsText.includes('stomach') || symptomsText.includes('nausea') || symptomsText.includes('vomit')) {
      logger.debug('Detected gastrointestinal symptoms');
      conditions.push({
        name: "Gastroenteritis",
        description: "Inflammation of the stomach and intestines causing digestive symptoms.",
        causes: "Viral or bacterial infection, food poisoning, contaminated water, stress.",
        precautions: "Stay hydrated with clear fluids, eat bland foods, rest, maintain hygiene.",
        advice: "Usually improves in 2-3 days. Seek immediate care if severely dehydrated.",
        urgency: "moderate"
      });
    }

    if (symptomsText.includes('chest pain') || symptomsText.includes('heart') || symptomsText.includes('breathing')) {
      logger.debug('Detected cardiac/anxiety symptoms');
      conditions.push({
        name: "Anxiety or Panic Attack",
        description: "Sudden onset of intense fear or discomfort with physical symptoms.",
        causes: "Stress, anxiety disorders, caffeine, medical conditions, or unknown triggers.",
        precautions: "Practice deep breathing, find a calm environment, avoid stimulants.",
        advice: "If first occurrence or severe symptoms, see a doctor to rule out cardiac issues.",
        urgency: "moderate"
      });
    }

    if (symptomsText.includes('headache') || symptomsText.includes('head') || symptomsText.includes('migraine')) {
      logger.debug('Detected headache symptoms');
      conditions.push({
        name: "Tension Headache",
        description: "The most common type of headache, often related to stress or muscle tension.",
        causes: "Stress, dehydration, poor posture, lack of sleep, eye strain.",
        precautions: "Rest in a dark room, stay hydrated, apply cold/warm compress, manage stress.",
        advice: "Monitor symptoms. See a doctor for frequent, severe, or sudden-onset headaches.",
        urgency: "monitor"
      });
    }

    // If no specific patterns match, provide general guidance
    if (conditions.length === 0) {
      logger.warn('No specific symptom patterns matched');
      conditions.push({
        name: "General Health Assessment Needed",
        description: "Your symptoms require professional medical evaluation for accurate diagnosis.",
        causes: "Various factors could contribute to your symptoms.",
        precautions: "Monitor symptoms, rest, stay hydrated, maintain good hygiene.",
        advice: "Consult with a healthcare provider for proper evaluation and guidance.",
        urgency: "moderate"
      });
    }

    return conditions.slice(0, 4); // Limit to 4 conditions
  };

  // Add keyboard shortcut for debug panel
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowDebugPanel(!showDebugPanel);
        logger.info('Debug panel toggled', { visible: !showDebugPanel });
      }
    };
    
    const handleCMSKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        setShowCMSPanel(!showCMSPanel);
        logger.info('CMS panel toggled', { visible: !showCMSPanel });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keydown', handleCMSKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keydown', handleCMSKeyPress);
    };
  }, [showDebugPanel, showCMSPanel]);

  // Log component mount
  React.useEffect(() => {
    logger.info('Disease Prevention application started');
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'bg-red-50 border-red-200 text-red-800';
      case 'moderate': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'monitor': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return <AlertCircle className="w-4 h-4" />;
      case 'moderate': return <Clock className="w-4 h-4" />;
      case 'monitor': return <Activity className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Disease Prevention</h1>
              <p className="text-sm text-gray-600">Proactive Health Monitoring & Early Detection</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-amber-800">
              <p className="font-medium text-sm">Medical Disclaimer</p>
              <p className="text-sm mt-1">This tool provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your doctor for medical concerns.</p>
            </div>
          </div>
        </div>

        {/* Symptom Input */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Describe Your Symptoms</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
                Tell us about your symptoms in detail
              </label>
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">💡 Example symptoms to try:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-800">
                  <button
                    onClick={() => setSymptoms("I have been experiencing a persistent headache for 3 days, along with fatigue and difficulty concentrating. The pain is mostly on the right side of my head.")}
                    className="text-left p-2 bg-white rounded border hover:bg-blue-50 transition-colors"
                  >
                    🧠 Headache with fatigue
                  </button>
                  <button
                    onClick={() => setSymptoms("I've had a dry cough for about a week, mild sore throat, and feeling tired. No fever but some congestion in the morning.")}
                    className="text-left p-2 bg-white rounded border hover:bg-blue-50 transition-colors"
                  >
                    🤧 Respiratory symptoms
                  </button>
                  <button
                    onClick={() => setSymptoms("Experiencing stomach discomfort, nausea, and loss of appetite for 2 days. Had some mild cramping after eating yesterday.")}
                    className="text-left p-2 bg-white rounded border hover:bg-blue-50 transition-colors"
                  >
                    🤢 Digestive issues
                  </button>
                  <button
                    onClick={() => setSymptoms("Feeling anxious with occasional chest tightness, rapid heartbeat, and difficulty sleeping for the past few nights. Stress at work has increased recently.")}
                    className="text-left p-2 bg-white rounded border hover:bg-blue-50 transition-colors"
                  >
                    💓 Anxiety symptoms
                  </button>
                </div>
              </div>
              <textarea
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Describe your symptoms in detail... Include duration, severity, and any related factors you've noticed."
              />
            </div>
            
            <button
              onClick={analyzeSymptoms}
              disabled={!symptoms.trim() || isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing Symptoms...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Analyze Symptoms</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {hasAnalyzed && (
          <div className="space-y-6">
            {results.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">More Information Needed</h3>
                <p className="text-gray-600">Please provide more specific symptoms to help identify your condition accurately.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Prevention & Early Detection</h3>
                  <p className="text-gray-600">Based on your symptoms, here are potential health concerns and prevention strategies:</p>
                </div>

                <div className="grid gap-6">
                  {results.map((condition, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl font-semibold text-gray-900">{condition.name}</h4>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getUrgencyColor(condition.urgency)}`}>
                          {getUrgencyIcon(condition.urgency)}
                          <span className="capitalize">{condition.urgency === 'monitor' ? 'Monitor' : condition.urgency}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Description</h5>
                          <p className="text-gray-700 text-sm">{condition.description}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Common Causes</h5>
                          <p className="text-gray-700 text-sm">{condition.causes}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Precautions</h5>
                          <p className="text-gray-700 text-sm">{condition.precautions}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Medical Advice</h5>
                          <p className="text-gray-700 text-sm">{condition.advice}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                  <h4 className="font-semibold text-blue-900 mb-2">Important Reminders</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• This analysis is for informational purposes only</li>
                    <li>• Always consult a healthcare professional for proper diagnosis</li>
                    <li>• Seek immediate medical attention for severe or worsening symptoms</li>
                    <li>• Call emergency services if experiencing life-threatening symptoms</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Debug Panel */}
      <DebugPanel 
        isVisible={showDebugPanel} 
        onToggle={() => setShowDebugPanel(!showDebugPanel)} 
      />
      
      {/* CMS Panel */}
      <CMSPanel 
        isVisible={showCMSPanel} 
        onToggle={() => setShowCMSPanel(!showCMSPanel)} 
      />
      </div>
    </ErrorBoundary>
  );
}

export default App;