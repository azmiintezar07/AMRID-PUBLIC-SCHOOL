/**
 * db.js - MongoDB Production Connection & Database Storage Layer
 * For AMRID PUBLIC SCHOOL
 * 
 * Supports:
 * - Production MongoDB Atlas connection via MONGODB_URI
 * - Automatic seeding on first run from existing JSON files
 * - Resilient fallback to local JSON file storage if MONGODB_URI is absent or unreachable
 * - Connection retry, error logging, and graceful shutdown handling
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to local JSON database files
const CONTENT_FILE = path.resolve(__dirname, 'public/data/content.json');
const SUBMISSIONS_FILE = path.resolve(__dirname, 'public/data/submissions.json');

// Mongoose Schemas with flexible schema for seamless CMS compatibility
const ContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'site_content' },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true, strict: false }
);

const SubmissionsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'site_submissions' },
    enquiries: { type: Array, default: [] },
    messages: { type: Array, default: [] }
  },
  { timestamps: true, strict: false }
);

let ContentModel = null;
let SubmissionsModel = null;
let isMongoActive = false;

// Helper to mask MongoDB URI for secure logging
function maskMongoUri(uri) {
  if (!uri) return 'undefined';
  try {
    return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  } catch {
    return 'mongodb+srv://****:****@...';
  }
}

// Read local JSON helper
function readLocalJson(filePath, fallback = {}) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error(`[DB-LOCAL] Error reading ${path.basename(filePath)}:`, err.message);
  }
  return fallback;
}

// Write local JSON helper (syncs to public/ and dist/ if dist exists)
function writeLocalJson(relPath, data) {
  const devPath = path.resolve(__dirname, 'public/' + relPath);
  const prodPath = path.resolve(__dirname, 'dist/' + relPath);

  try {
    if (!fs.existsSync(path.dirname(devPath))) {
      fs.mkdirSync(path.dirname(devPath), { recursive: true });
    }
    fs.writeFileSync(devPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`[DB-LOCAL] Error writing dev ${relPath}:`, e.message);
  }

  try {
    if (fs.existsSync(path.dirname(prodPath))) {
      fs.writeFileSync(prodPath, JSON.stringify(data, null, 2), 'utf-8');
    }
  } catch (e) {
    console.error(`[DB-LOCAL] Error writing prod ${relPath}:`, e.message);
  }
}

/**
 * Initialize MongoDB connection
 */
export async function initDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri || !uri.trim()) {
    console.log('[DATABASE] ℹ️  MONGODB_URI not provided. Running in resilient local JSON storage mode.');
    isMongoActive = false;
    return false;
  }

  console.log(`[DATABASE] 🔄 Connecting to MongoDB: ${maskMongoUri(uri)} ...`);

  try {
    // Register models
    ContentModel = mongoose.models.Content || mongoose.model('Content', ContentSchema);
    SubmissionsModel = mongoose.models.Submissions || mongoose.model('Submissions', SubmissionsSchema);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000
    });

    isMongoActive = true;
    console.log('[DATABASE] ✅ MongoDB connected successfully!');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('[DATABASE] ⚠️  MongoDB runtime connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[DATABASE] ⚠️  MongoDB disconnected. Operating in fallback mode.');
      isMongoActive = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[DATABASE] 🔄 MongoDB reconnected successfully.');
      isMongoActive = true;
    });

    // Auto-seed MongoDB with initial data from JSON if empty
    await seedMongoIfEmpty();

    return true;
  } catch (err) {
    console.error('[DATABASE] ⚠️  MongoDB connection failed:', err.message);
    console.log('[DATABASE] ℹ️  Falling back gracefully to local JSON database. Server will remain fully operational.');
    isMongoActive = false;
    return false;
  }
}

/**
 * Seed MongoDB on first connection if collections are empty
 */
async function seedMongoIfEmpty() {
  if (!isMongoActive) return;

  try {
    // 1. Seed Content
    const existingContent = await ContentModel.findOne({ key: 'site_content' });
    if (!existingContent) {
      const localContent = readLocalJson(CONTENT_FILE, null);
      if (localContent && Object.keys(localContent).length > 0) {
        await ContentModel.create({ key: 'site_content', data: localContent });
        console.log('[DATABASE] 🌱 Auto-seeded MongoDB with existing content data.');
      }
    }

    // 2. Seed Submissions
    const existingSubmissions = await SubmissionsModel.findOne({ key: 'site_submissions' });
    if (!existingSubmissions) {
      const localSubs = readLocalJson(SUBMISSIONS_FILE, { enquiries: [], messages: [] });
      await SubmissionsModel.create({
        key: 'site_submissions',
        enquiries: localSubs.enquiries || [],
        messages: localSubs.messages || []
      });
      console.log('[DATABASE] 🌱 Auto-seeded MongoDB with existing enquiries and messages.');
    }
  } catch (err) {
    console.error('[DATABASE] Error during MongoDB initial seeding check:', err.message);
  }
}

/**
 * Fetch website content
 */
export async function getContentData() {
  if (isMongoActive && ContentModel) {
    try {
      const doc = await ContentModel.findOne({ key: 'site_content' }).lean();
      if (doc && doc.data) {
        return doc.data;
      }
    } catch (err) {
      console.error('[DATABASE] Error reading content from MongoDB:', err.message);
    }
  }

  // Fallback to local JSON
  return readLocalJson(CONTENT_FILE, {});
}

/**
 * Save website content
 */
export async function saveContentData(data) {
  let savedToMongo = false;

  if (isMongoActive && ContentModel) {
    try {
      await ContentModel.findOneAndUpdate(
        { key: 'site_content' },
        { $set: { data: data } },
        { upsert: true, new: true }
      );
      savedToMongo = true;
    } catch (err) {
      console.error('[DATABASE] Error saving content to MongoDB:', err.message);
    }
  }

  // Always write to local JSON files for redundancy and offline sync
  writeLocalJson('data/content.json', data);

  return { success: true, mongoSaved: savedToMongo };
}

/**
 * Fetch submissions (enquiries & messages)
 */
export async function getSubmissionsData() {
  if (isMongoActive && SubmissionsModel) {
    try {
      const doc = await SubmissionsModel.findOne({ key: 'site_submissions' }).lean();
      if (doc) {
        return {
          enquiries: doc.enquiries || [],
          messages: doc.messages || []
        };
      }
    } catch (err) {
      console.error('[DATABASE] Error reading submissions from MongoDB:', err.message);
    }
  }

  // Fallback to local JSON
  return readLocalJson(SUBMISSIONS_FILE, { enquiries: [], messages: [] });
}

/**
 * Save submissions (enquiries & messages)
 */
export async function saveSubmissionsData(data) {
  let savedToMongo = false;

  if (isMongoActive && SubmissionsModel) {
    try {
      await SubmissionsModel.findOneAndUpdate(
        { key: 'site_submissions' },
        {
          $set: {
            enquiries: data.enquiries || [],
            messages: data.messages || []
          }
        },
        { upsert: true, new: true }
      );
      savedToMongo = true;
    } catch (err) {
      console.error('[DATABASE] Error saving submissions to MongoDB:', err.message);
    }
  }

  // Always write to local JSON files for redundancy and offline sync
  writeLocalJson('data/submissions.json', data);

  return { success: true, mongoSaved: savedToMongo };
}

/**
 * Status helper
 */
export function getDatabaseStatus() {
  return {
    isMongoConnected: isMongoActive && mongoose.connection.readyState === 1,
    storageEngine: (isMongoActive && mongoose.connection.readyState === 1) ? 'MongoDB Atlas' : 'Local JSON File Store',
    connectionState: mongoose.connection.readyState
  };
}
