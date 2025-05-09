// React component example (VoiceInput.jsx)
import { useState } from 'react';

export default function VoiceInputTest() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [quote, setQuote] = useState(null);

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];
    
    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };
    
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks);
      await sendToBackend(audioBlob);
    };
    
    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
      setIsRecording(false);
    }, 5000); // Stop after 5 seconds
  };

  const sendToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.mp3');
    
    try {
      // 1. Send for transcription
      const transcribeRes = await fetch('http://localhost:8000/transcribe', {
        method: 'POST',
        body: formData
      });
      const { text } = await transcribeRes.json();
      setTranscript(text);
      
      // 2. Extract parameters and get quote (simplified)
      const quoteRes = await fetch(`http://localhost:8000/quote?age=35&coverage_amount=500000`);
      setQuote(await quoteRes.json());
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start Recording'}
      </button>
      
      {transcript && <p>You said: {transcript}</p>}
      
      {quote && (
        <div className="quote-result">
          <h3>Your Quote</h3>
          <p>Monthly Premium: ${quote.monthly_premium}</p>
          <p>Coverage: ${quote.coverage_amount}</p>
        </div>
      )}
    </div>
  );
}