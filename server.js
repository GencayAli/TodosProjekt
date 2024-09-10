import path from 'node:path';
//import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { router as todosRouter } from './src/routes/users.js';

const app = express();

// Middleware ermöglicht es, JSON-Daten aus dem Body von HTTP-Anfragen zu verarbeiten.
app.use(express.json());


// Best practices: Security - Remove fingerprint
app.disable('x-powered-by');

// Middlewares
app.use(morgan('tiny'));

// Routing
// Your starting point. Enjoy the ride
app.use('/api/todos', todosRouter);

// Static Files Middleware
app.use(express.static(path.join(import.meta.dirname, 'public')));
// Middleware: Custom 404
app.use((req, res) => {
  res.status(404).send(`<h2>Lost in Space: ${req.path}</h2>`);
});

// Middleware: Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`<h2>Ups: ${err.message}</h2>`);
});
// Start server
const port = 3000;
app.listen(port, () => {
  console.info(`Server started at http://localhost:${port}`);
});
