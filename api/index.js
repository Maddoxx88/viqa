const express = require('express');
const cors = require('cors');
const { SpeechClient } = require('@google-cloud/speech');
require('dotenv').config(); // Optional for loading .env file

const app = express();
const port = 5000;
const speechClient = new SpeechClient();

app.use(cors());
app.use(express.json());

app.post('/api/voice-input', async (req, res) => {
  try {
    const { audioContent, coverageAmount, healthCondition } = req.body;

    if (!audioContent || !coverageAmount || !healthCondition) {
      return res.status(400).json({ message: 'Age, car type, coverage amount, and health condition are required' });
    }

    console.log('Received Transcript:', audioContent);
    console.log('Coverage Amount:', coverageAmount);
    console.log('Health Condition:', healthCondition);

    // Process the quote calculation based on the transcript and additional parameters
    const quote = getInsuranceQuote(audioContent, coverageAmount, healthCondition);

    res.json({ quote });
  } catch (error) {
    console.error('Error processing voice input:', error);
    res.status(500).json({ message: 'Error processing voice input', error: error.message });
  }
});



// Dummy function to simulate an insurance quote (can be replaced with real logic)
const getInsuranceQuote = (transcript) => {
  const ageMatch = transcript.match(/(\d+) years?/);  // Extract age (e.g., "30 years old")
  const carTypeMatch = transcript.match(/(sports|sedan|suv)/i);  // Extract car type (e.g., "sedan")

  const age = ageMatch ? parseInt(ageMatch[1], 10) : 30;  // Default age: 30
  const carType = carTypeMatch ? carTypeMatch[1].toLowerCase() : 'sedan';  // Default car type: sedan

  // Example: calculate a base price for the insurance quote
  let basePrice = 500;

  // Age-based pricing
  if (age < 25) basePrice += 200;  // Younger drivers are charged more
  if (age > 50) basePrice -= 50;   // Older drivers might get a discount

  // Car type-based pricing
  if (carType === 'sports') basePrice += 300;
  if (carType === 'suv') basePrice += 150;

  return basePrice;
};


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
