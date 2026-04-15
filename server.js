const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app      = express();
const PORT     = process.env.PORT || 3000;
const DATA_FILE = process.env.DATA_PATH || path.join(__dirname, 'data.json');

// ── init data file ──────────────────────────────────────────────────────────
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ notes: [], tasks: [] }));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ── middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── NOTES ────────────────────────────────────────────────────────────────────
app.get('/api/notes', (req, res) => {
  res.json(readData().notes);
});

app.post('/api/notes', (req, res) => {
  const { text, responsible, worker, author } = req.body;
  if (!text || !author) return res.status(400).json({ error: 'missing fields' });

  const data = readData();
  const note = {
    id:          Date.now().toString(),
    text,
    responsible: responsible || '',
    worker:      worker || '',
    author,
    created:     new Date().toISOString(),
    colorIdx:    data.notes.length % 6
  };
  data.notes.push(note);
  writeData(data);
  res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  const data = readData();
  data.notes = data.notes.filter(n => n.id !== req.params.id);
  writeData(data);
  res.json({ ok: true });
});

// ── TASKS ────────────────────────────────────────────────────────────────────
app.get('/api/tasks', (req, res) => {
  res.json(readData().tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title, desc, assignee, status, createdBy } = req.body;
  if (!title || !assignee || !createdBy) return res.status(400).json({ error: 'missing fields' });

  const data = readData();
  const task = {
    id:        Date.now().toString(),
    title,
    desc:      desc || '',
    assignee,
    status:    status || 'todo',
    createdBy,
    created:   new Date().toISOString()
  };
  data.tasks.push(task);
  writeData(data);
  res.json(task);
});

app.patch('/api/tasks/:id', (req, res) => {
  const data = readData();
  const task = data.tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'not found' });
  if (req.body.status) task.status = req.body.status;
  writeData(data);
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const data = readData();
  data.tasks = data.tasks.filter(t => t.id !== req.params.id);
  writeData(data);
  res.json({ ok: true });
});

// ── fallback ─────────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
