require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo-app';

const PRIORITIES = ['low', 'medium', 'high'];

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Databázové schéma a model
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  priority: { type: String, enum: PRIORITIES, default: 'medium' },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', taskSchema);

// GET /api/tasks – vrátí všechny úkoly (nejnovější první)
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nepodařilo se načíst úkoly.' });
  }
});

// POST /api/tasks – ověří vstup a uloží nový úkol
app.post('/api/tasks', async (req, res) => {
  try {
    const title =
      typeof req.body.title === 'string' ? req.body.title.trim() : '';
    const priority = req.body.priority;

    if (!title) {
      return res.status(400).json({ error: 'Název úkolu nesmí být prázdný.' });
    }
    if (title.length > 200) {
      return res
        .status(400)
        .json({ error: 'Název úkolu může mít maximálně 200 znaků.' });
    }
    if (!PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: 'Neplatná priorita.' });
    }

    const task = await Task.create({ title, priority });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nepodařilo se uložit úkol.' });
  }
});

// Připojení k databázi a spuštění serveru
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Připojeno k MongoDB');
    app.listen(PORT, () => {
      console.log(`Server běží na http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Chyba připojení k MongoDB:', err.message);
    process.exit(1);
  });
