import express, { Express, Router } from 'express';
import serverless from 'serverless-http';
import session from 'express-session';
import { setupAuth } from '../../server/auth';
import { storage } from '../../server/storage';
import cors from 'cors';
import { json } from 'body-parser';

// Import routes setup
import { registerRoutes } from '../../server/routes';

const app: Express = express();
app.use(cors());
app.use(json());

// Session setup
const sessionSettings: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || 'job-tracker-secret',
  resave: false,
  saveUninitialized: false,
  store: storage.sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  }
};

app.use(session(sessionSettings));

// Setup auth
setupAuth(app);

// Setup routes
registerRoutes(app);

// Export the serverless function
export const handler = serverless(app);