import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PredictionResponse {
  predictions: string[];
}

export const NextWordPredictor = () => {
  const [inputText, setInputText] = useState('');
  const [predictions, setPredictions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const API_KEY = 'AIzaSyAXAgVvnY6pVc-2QMvCxVHjz5jlN9NXs-s';

  const getPredictions = async (text: string) => {
    if (!text.trim()) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Use Google's latest Gemini model for real predictions
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Complete this text with the most likely next word only. Text: "${text}". Respond with just one word that would naturally follow.`
            }]
          }],
          generationConfig: {
            maxOutputTokens: 10,
            temperature: 0.1,
            candidateCount: 1
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get predictions');
      }

      const data = await response.json();
      const predictionText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (predictionText) {
        const cleanedPrediction = predictionText.trim().toLowerCase().replace(/[.,!?;]$/, '');
        const smartPredictions = generateSmartPredictions(text);
        // Combine AI prediction with smart predictions
        const allPredictions = [cleanedPrediction, ...smartPredictions].filter(word => word);
        setPredictions([...new Set(allPredictions)].slice(0, 5)); // Remove duplicates and limit to 5
      } else {
        setPredictions(generateSmartPredictions(text));
      }
    } catch (error) {
      console.error('Error getting predictions:', error);
      // Fallback to smart predictions
      setPredictions(generateSmartPredictions(text));
    } finally {
      setIsLoading(false);
    }
  };

  const generateSmartPredictions = (text: string): string[] => {
    const words = text.toLowerCase().trim().split(/\s+/);
    const lastWord = words[words.length - 1];
    const lastTwoWords = words.slice(-2).join(' ');
    const lastThreeWords = words.slice(-3).join(' ');
    
    // Advanced contextual patterns
    const advancedPatterns: { [key: string]: string[] } = {
      // Complete sentences and common phrases
      'i am': ['going', 'feeling', 'thinking', 'working', 'studying'],
      'i will': ['be', 'go', 'make', 'call', 'send'],
      'you are': ['going', 'welcome', 'right', 'amazing', 'invited'],
      'this is': ['a', 'the', 'my', 'our', 'very'],
      'that was': ['amazing', 'great', 'wonderful', 'terrible', 'unexpected'],
      'how are': ['you', 'things', 'they', 'we', 'the'],
      'what is': ['the', 'your', 'this', 'that', 'happening'],
      'where is': ['the', 'my', 'your', 'he', 'she'],
      'when will': ['you', 'we', 'they', 'it', 'the'],
      'good morning': ['everyone', 'sir', 'madam', 'to', 'and'],
      'thank you': ['very', 'so', 'for', 'again', 'all'],
      'how do': ['you', 'I', 'we', 'they', 'people'],
      'what do': ['you', 'I', 'we', 'they', 'people'],
      'i want': ['to', 'a', 'the', 'you', 'some'],
      'i need': ['to', 'a', 'the', 'you', 'some'],
      'i have': ['a', 'the', 'to', 'been', 'never'],
      'we are': ['going', 'working', 'learning', 'building', 'creating'],
      'they are': ['going', 'working', 'learning', 'building', 'coming'],
      'it is': ['a', 'the', 'very', 'really', 'not'],
      'there are': ['many', 'some', 'a', 'no', 'several'],
      'there is': ['a', 'the', 'no', 'something', 'nothing'],
      'in the': ['morning', 'afternoon', 'evening', 'future', 'past'],
      'on the': ['table', 'ground', 'way', 'other', 'phone'],
      'at the': ['same', 'end', 'beginning', 'moment', 'time'],
      'for the': ['first', 'last', 'next', 'same', 'best'],
      'with the': ['help', 'same', 'new', 'old', 'right'],
      'of the': ['world', 'year', 'day', 'time', 'people'],
      'to the': ['right', 'left', 'top', 'bottom', 'end'],
      'from the': ['beginning', 'start', 'end', 'top', 'bottom'],
    };

    // Check for multi-word context patterns
    if (advancedPatterns[lastThreeWords]) {
      return advancedPatterns[lastThreeWords];
    }
    if (advancedPatterns[lastTwoWords]) {
      return advancedPatterns[lastTwoWords];
    }

    // Enhanced single word predictions with better context awareness
    const enhancedSingleWords: { [key: string]: string[] } = {
      'the': ['best', 'first', 'last', 'next', 'most'],
      'a': ['great', 'good', 'new', 'big', 'small'],
      'an': ['amazing', 'excellent', 'important', 'interesting', 'incredible'],
      'i': ['am', 'will', 'can', 'want', 'think'],
      'you': ['are', 'can', 'will', 'should', 'might'],
      'we': ['are', 'will', 'can', 'should', 'have'],
      'they': ['are', 'will', 'can', 'have', 'were'],
      'he': ['is', 'was', 'will', 'can', 'has'],
      'she': ['is', 'was', 'will', 'can', 'has'],
      'it': ['is', 'was', 'will', 'can', 'has'],
      'and': ['the', 'I', 'we', 'they', 'it'],
      'or': ['the', 'a', 'maybe', 'perhaps', 'not'],
      'but': ['I', 'we', 'they', 'it', 'the'],
      'so': ['I', 'we', 'they', 'it', 'the'],
      'if': ['you', 'I', 'we', 'they', 'it'],
      'when': ['I', 'you', 'we', 'they', 'it'],
      'where': ['I', 'you', 'we', 'they', 'it'],
      'why': ['I', 'you', 'we', 'they', 'it'],
      'how': ['I', 'you', 'we', 'they', 'it'],
      'what': ['I', 'you', 'we', 'they', 'it'],
      'who': ['I', 'you', 'we', 'they', 'it'],
      'to': ['the', 'be', 'go', 'see', 'make'],
      'in': ['the', 'a', 'my', 'this', 'order'],
      'for': ['the', 'a', 'me', 'you', 'us'],
      'with': ['the', 'a', 'my', 'you', 'me'],
      'on': ['the', 'a', 'my', 'this', 'top'],
      'at': ['the', 'a', 'my', 'this', 'least'],
      'by': ['the', 'a', 'my', 'this', 'me'],
      'from': ['the', 'a', 'my', 'this', 'here'],
      'up': ['to', 'the', 'and', 'with', 'on'],
      'out': ['of', 'to', 'and', 'with', 'on'],
      'down': ['to', 'the', 'and', 'with', 'on'],
      'off': ['to', 'the', 'and', 'with', 'of'],
      'over': ['the', 'and', 'to', 'here', 'there'],
      'under': ['the', 'and', 'to', 'here', 'there'],
      'again': ['and', 'to', 'for', 'with', 'in'],
      'further': ['and', 'to', 'for', 'with', 'in'],
      'then': ['I', 'you', 'we', 'they', 'it'],
      'once': ['I', 'you', 'we', 'they', 'it'],
      'here': ['is', 'are', 'and', 'to', 'with'],
      'there': ['is', 'are', 'and', 'to', 'with'],
      'now': ['I', 'you', 'we', 'they', 'it'],
      'very': ['good', 'bad', 'important', 'interesting', 'nice'],
      'really': ['good', 'bad', 'important', 'interesting', 'nice'],
      'quite': ['good', 'bad', 'important', 'interesting', 'nice'],
      'just': ['a', 'the', 'like', 'about', 'now'],
      'only': ['a', 'the', 'one', 'two', 'few'],
      'also': ['a', 'the', 'very', 'really', 'quite'],
      'still': ['a', 'the', 'very', 'really', 'quite'],
      'more': ['than', 'and', 'or', 'of', 'to'],
      'most': ['of', 'people', 'important', 'likely', 'recent'],
      'good': ['morning', 'evening', 'night', 'day', 'luck'],
      'bad': ['news', 'weather', 'day', 'luck', 'idea'],
      'great': ['job', 'day', 'idea', 'news', 'work'],
      'small': ['business', 'house', 'car', 'dog', 'town'],
      'big': ['house', 'car', 'dog', 'city', 'problem'],
      'new': ['car', 'house', 'job', 'idea', 'project'],
      'old': ['car', 'house', 'man', 'woman', 'friend'],
      'first': ['time', 'day', 'step', 'thing', 'person'],
      'last': ['time', 'day', 'week', 'month', 'year'],
      'next': ['time', 'day', 'week', 'month', 'year'],
      'right': ['now', 'here', 'there', 'way', 'time'],
      'wrong': ['way', 'time', 'place', 'person', 'answer'],
      'best': ['way', 'time', 'place', 'person', 'thing'],
      'worst': ['way', 'time', 'place', 'person', 'thing'],
    };

    if (lastWord && enhancedSingleWords[lastWord]) {
      return enhancedSingleWords[lastWord];
    }

    // Context-aware predictions based on sentence structure
    const sentenceLength = words.length;
    const hasQuestion = text.includes('?') || words.some(w => ['what', 'where', 'when', 'why', 'how', 'who'].includes(w));
    
    if (hasQuestion) {
      return ['is', 'are', 'do', 'does', 'will'];
    }
    
    if (sentenceLength === 1) {
      return ['am', 'will', 'can', 'want', 'think'];
    } else if (sentenceLength < 4) {
      return ['the', 'a', 'an', 'my', 'your'];
    } else if (sentenceLength < 8) {
      return ['and', 'but', 'so', 'then', 'now'];
    } else {
      return ['that', 'which', 'where', 'when', 'because'];
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getPredictions(inputText);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputText]);

  const handlePredictionClick = (prediction: string) => {
    const words = inputText.split(' ');
    words[words.length - 1] = prediction;
    const newText = words.join(' ') + ' ';
    setInputText(newText);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Smart Typing Assistant
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Type faster and more efficiently with intelligent word suggestions. Built to help you write with confidence and speed.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card border-border shadow-card backdrop-blur-sm">
        <div className="space-y-4">
          <div className="relative">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Start typing to get word suggestions..."
              className="text-lg py-4 px-6 bg-input border-border focus:ring-primary focus:border-primary transition-smooth"
              autoFocus
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Loader className="w-5 h-5 animate-spin text-primary" />
              </div>
            )}
          </div>

          {predictions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Word suggestions:
              </h3>
              <div className="flex flex-wrap gap-2">
                {predictions.map((prediction, index) => (
                  <Button
                    key={`${prediction}-${index}`}
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePredictionClick(prediction)}
                    className="animate-fade-in-up hover:shadow-glow transition-smooth"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {prediction}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {inputText && predictions.length === 0 && !isLoading && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Continue typing to see more suggestions...
            </p>
          )}
        </div>
      </Card>

      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p>Intelligent typing assistance for better productivity</p>
        <p className="text-xs">Created by Abdullah Mohamed Mohey</p>
      </div>
    </div>
  );
};
