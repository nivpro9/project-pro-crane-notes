const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app      = express();
const PORT     = process.env.PORT || 3000;
const DATA_FILE = process.env.DATA_PATH || path.join(__dirname, 'data.json');

// ── init data file ──────────────────────────────────────────────────────────
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ notes: [] }));
  }
  const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  if (!raw.notes) raw.notes = [];
  return raw;
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
  const { text, responsible, customResp, worker, tags, author } = req.body;
  if (!text) return res.status(400).json({ error: 'missing text' });

  const data = readData();
  const note = {
    id:          Date.now().toString(),
    text,
    responsible: responsible || '',
    customResp:  customResp  || '',
    worker:      worker      || '',
    tags:        tags        || [],
    author:      author      || '',
    done:        false,
    created:     new Date().toISOString(),
    colorIdx:    data.notes.length % 6
  };
  data.notes.push(note);
  writeData(data);
  res.json(note);
});

app.patch('/api/notes/:id', (req, res) => {
  const data = readData();
  const note = data.notes.find(n => n.id === req.params.id);
  if (!note) return res.status(404).json({ error: 'not found' });
  if (req.body.done !== undefined) note.done = req.body.done;
  writeData(data);
  res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  const data = readData();
  data.notes = data.notes.filter(n => n.id !== req.params.id);
  writeData(data);
  res.json({ ok: true });
});

// ── fallback ─────────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
