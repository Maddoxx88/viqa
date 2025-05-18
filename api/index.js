// server/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Mock quote endpoint
app.post('/get-quote', (req, res) => {
  const {
    name,
    age,
    carModel,
    zipCode,
    drivingYears,
    accidents,
    insuranceType
  } = req.body;

  // Basic validation fallback
  const ageNum = parseInt(age) || 30;
  const drivingYearsNum = parseInt(drivingYears) || 5;
  const hasAccidents = (accidents || '').toLowerCase().includes('yes');
  const isFull = (insuranceType || '').toLowerCase().includes('full');

  // Mock quote logic
  let quote = 500;
  quote += ageNum < 25 ? 150 : 50;
  quote += carModel.toLowerCase().includes('sports') ? 300 : 100;
  quote += zipCode.startsWith('9') ? 50 : 25; // fake regional charge
  quote -= drivingYearsNum * 5; // safe driver discount
  quote += hasAccidents ? 200 : 0;
  quote += isFull ? 250 : 100;

  res.json({
    message: `Quote generated for ${name}`,
    quote: `$${quote.toFixed(2)}`,
    details: {
      name,
      age,
      carModel,
      zipCode,
      drivingYears,
      accidents,
      insuranceType
    }
  });
});

app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});
