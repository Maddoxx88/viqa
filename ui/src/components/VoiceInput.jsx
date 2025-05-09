import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceInput = () => {
  const [quote, setQuote] = useState(null);
  const [step, setStep] = useState(1); // Track conversation step
  const [age, setAge] = useState('');
  const [carType, setCarType] = useState('');
  const [coverageAmount, setCoverageAmount] = useState('');
  const [healthCondition, setHealthCondition] = useState('');
  const { transcript, resetTranscript } = useSpeechRecognition();

  const [isListening, setIsListening] = useState(false);  // Track if listening is active

  // Speak a message using SpeechSynthesis
  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };

  // Start listening for speech
  const startListening = () => {
    console.log('Starting to listen...');
    SpeechRecognition.startListening({
      continuous: true,  // Continuous listening
      language: 'en-US',
      interimResults: true  // Allows the speech to be processed in real-time
    });
    setIsListening(true);  // Mark that we are now listening
  };

  // Stop listening when the user finishes speaking
  const stopListening = () => {
    console.log('Stopping listening...');
    SpeechRecognition.stopListening();
    setIsListening(false);  // Mark that we are no longer listening
  };

  // Proceed to next step
  const handleNextStep = () => {
    if (transcript.trim()) {
      console.log('Captured Input:', transcript);  // Log the transcript for debugging
      switch (step) {
        case 1:
          setAge(transcript);  // Store the age
          break;
        case 2:
          setCarType(transcript);  // Store the car type
          break;
        case 3:
          setCoverageAmount(transcript);  // Store coverage amount
          break;
        case 4:
          setHealthCondition(transcript);  // Store health condition
          break;
        default:
          break;
      }

      // Reset the transcript and move to the next step
      resetTranscript();
      setStep(step + 1);
    } else {
      speak("Please say something.");
    }
  };

  // Call backend API to get the quote after collecting all details
  const getQuote = async () => {
    const response = await fetch('http://localhost:5000/api/voice-input', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioContent: transcript,  // Sending transcript as placeholder
        age,
        carType,
        coverageAmount: parseInt(coverageAmount),
        healthCondition
      })
    });

    const data = await response.json();
    setQuote(data.quote);
    speak(`Your insurance quote is $${data.quote}`);
  };

  // Conversational messages based on the current step
  const getPrompt = () => {
    switch (step) {
      case 1:
        return 'How old are you?';
      case 2:
        return 'What type of car do you drive?';
      case 3:
        return 'What is the desired coverage amount?';
      case 4:
        return 'What is your health condition?';
      case 5:
        return 'Processing your quote now...';
      default:
        return '';
    }
  };

  // Handle the step flow and listen for answers
  useEffect(() => {
    if (step <= 4) {
      // Ask the question and start listening
      speak(getPrompt());
      startListening();  // Start listening immediately after asking a question
    } else if (step === 5) {
      // Get the quote once all steps are completed
      getQuote();
      stopListening(); // Stop listening after getting the quote
    }
  }, [step]); // Runs every time the step changes

  // Check if the input is captured, then proceed
  useEffect(() => {
    if (isListening && transcript.trim()) {
      handleNextStep(); // Automatically proceed once the input is captured
    }
  }, [transcript, isListening]);  // Trigger when transcript or listening status changes

  // Reset the entire conversation
  const handleReset = () => {
    setStep(1);
    setAge('');
    setCarType('');
    setCoverageAmount('');
    setHealthCondition('');
    setQuote(null);
    resetTranscript();
    setIsListening(false);  // Stop listening if reset
  };

  return (
    <div>
      <h2>Insurance Quote Assistant</h2>
      <p>Transcript: {transcript}</p>
      <p>Step {step}: {getPrompt()}</p>

      {/* Buttons for controlling the listening */}
      <button onClick={startListening} disabled={isListening}>Start Listening</button>
      <button onClick={stopListening} disabled={!isListening}>Stop Listening</button>

      {/* Reset Button */}
      <button onClick={handleReset}>Reset Conversation</button>

      {/* Display the final quote */}
      {quote && <p>Your insurance quote is: ${quote}</p>}
    </div>
  );
};

export default VoiceInput;
