import express from 'express';
import axios from 'axios';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));


const upload = multer({
  dest: path.join(__dirname, '..', 'temp'), // Temporary directory for storing uploaded files
});

app.get('/download-glb', async (req, res) => {
  console.log("hi")
  try {
    const glbUrl = req.query.glbUrl;
    console.log(glbUrl)
    const response = await axios.get(glbUrl, { responseType: 'arraybuffer' });

    console.log(response.data);

    res.setHeader('Content-Type', 'model/gltf-binary');

    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error downloading GLB:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/save-glb', upload.single('glbFile'), (req, res) => {
  try {
    const glbFile = req.file;

    fs.renameSync(glbFile.path, path.join(__dirname, '..', 'public', 'model.glb'));

    res.status(200).send({ filename: glbFile.originalname }); 
  } catch (error) {
    console.error("Error saving GLB file:", error);
    res.status(500).send('Error saving GLB file.');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
