import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Update with your frontend origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.options('*', (req, res) => {
  res.sendStatus(200); // Respond to preflight requests
});

app.post('/submit-glb-url', async (req, res) => {
  try {
    const glbUrl = req.body.glbUrl;
    
    // Fetch the GLB model from the provided URL
    const response = await fetch(glbUrl);
    const glbBuffer = await response.arrayBuffer();
    const glbData = Buffer.from(glbBuffer);

    // Send the GLB model data to the frontend
    res.status(200).send(glbData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
