import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, Mic } from 'lucide-react';

export const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AsphaltOS AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'I can help you with system management, paving calculations, and fleet operations.',
        'Would you like me to analyze your current asphalt operations?',
        'I can provide weather updates for optimal paving conditions.',
        'Let me check your system performance metrics.',
        'I can assist with route optimization for your fleet.'
      ];
      const aiMessage = { 
        role: 'assistant', 
        content: responses[Math.floor(Math.random() * responses.length)]
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInput('');
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 space-y-2 overflow-y-auto mb-3 text-xs">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <Bot className="h-4 w-4 text-primary mt-0.5" />
            )}
            <div
              className={`p-2 rounded max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-1">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          className="h-8 text-xs"
        />
        <Button
          size="sm"
          onClick={toggleVoice}
          variant={isListening ? "default" : "outline"}
          className="h-8 w-8 p-0"
        >
          <Mic className="h-3 w-3" />
        </Button>
        <Button size="sm" onClick={handleSend} className="h-8 w-8 p-0">
          <Send className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};