// client/src/App.jsx
import { useState } from 'react';

const VoiceInput = () => {
  const [step, setStep] = useState(0);
const [formData, setFormData] = useState({
  name: 'Adam',
  age: '27',
  carModel: 'sports',
  zipCode: '90210',
  drivingYears: '5',
  accidents: 'no',
  insuranceType: 'full',
});
  const [quote, setQuote] = useState(null);
  const [listening, setListening] = useState(false);

const questions = [
  { key: 'name', question: "What is your full name?" },
  { key: 'age', question: "How old are you?" },
  { key: 'carModel', question: "What is your car's make and model?" },
  { key: 'zipCode', question: "What is your zip code?" },
  { key: 'drivingYears', question: "How many years have you been driving?" },
  { key: 'accidents', question: "Have you had any accidents in the last 5 years?" },
  { key: 'insuranceType', question: "What type of insurance do you need? Basic or Full?" },
];


const startListening = () => {
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  let transcript = '';
  setListening(true);

  recognition.onresult = (event) => {
    transcript = event.results[0][0].transcript;
    console.log('Captured:', transcript);
  };

  recognition.onerror = (err) => {
    console.error('Speech error:', err);
  };

  recognition.start();

  // Wait for 5 seconds, then stop and continue
  setTimeout(() => {
    recognition.stop();

    const key = questions[step].key;
    // setFormData((prev) => ({
    //   ...prev,
    //   [key]: transcript || '(No response)',
    // }));

    setStep((prev) => prev + 1);
    setListening(false);
  }, 1000);
};

  if (step >= questions.length) {
    if (!quote) {
      fetch('http://localhost:5000/get-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then(data => setQuote(data.quote));
    }

    return (
      <div>
        <h2>Your Quote:</h2>
        <p>{quote || 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>{questions[step].question}</h2>
      <button onClick={startListening} disabled={listening}>
        {listening ? 'Listening...' : 'Answer by Voice'}
      </button>
    </div>
  );

}

export default VoiceInput;
