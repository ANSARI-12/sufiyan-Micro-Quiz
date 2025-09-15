const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, '../frontend')));


const quizPath = path.join(__dirname, '../database/quiz.json');
const usersPath = path.join(__dirname, '../database/users.json');
const resultsPath = path.join(__dirname, '../database/results.json');


const readJSON = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return [];
  }
};


const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};


app.get('/api/quiz', (req, res) => {
  const quiz = readJSON(quizPath);
  res.json(quiz);
});


app.post('/api/register', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  const users = readJSON(usersPath);
  const newUser = { id: Date.now(), name };
  users.push(newUser);
  writeJSON(usersPath, users);
  res.json(newUser);
});


app.post('/api/results', (req, res) => {
  const { userId, score } = req.body;
  if (!userId || score === undefined) return res.status(400).json({ error: 'userId and score required' });

  const results = readJSON(resultsPath);
  const newResult = { userId, score, date: new Date().toISOString() };
  results.push(newResult);
  writeJSON(resultsPath, results);
  res.json(newResult);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
