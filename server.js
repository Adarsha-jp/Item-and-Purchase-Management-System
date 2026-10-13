require('dotenv').config();
const path = require('path');
const express = require('express');
const { HttpError } = require('./utils');

const app = express();
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/item-types', require('./routes/itemTypes'));
app.use('/api/items', require('./routes/items'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/stock', require('./routes/stock'));

// Purchases are historical: make the rule explicit with a clear answer (405) instead of a vague 404.
app.all('/api/purchases/:id', (req, res, next) => {
  if (req.method === 'DELETE') {
    return res.status(405).set('Allow', 'GET, PUT').json({ error: 'Purchases cannot be deleted' });
  }
  next();
});

// Unknown API route
app.use('/api', (req, res) => res.status(404).json({ error: 'Route not found' }));

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, ...err.extra });
  }
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed JSON in request body' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request body too large' });
  // Never leak SQL / stack details to the client
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'Something went wrong on the server. Please try again later.' });
});

const PORT = Number(process.env.PORT) || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

module.exports = app;
