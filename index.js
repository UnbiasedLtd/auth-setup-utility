#!/usr/bin/env node

import os from 'os';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import {
  npmrc as CI_NPMRC_CONTENT,
  yarnrc as CI_YARNRC_CONTENT
} from './sources.js';

const ROOT_NPMRC_PATH = path.join(os.homedir(), '.npmrc');
const PROJECT_NPMRC_PATH = path.join(process.cwd(), '.npmrc');
const PROJECT_YARNRC_PATH = path.join(process.cwd(), '.yarnrc.yml');

function extractAuthToken(filePath) {
  const content = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  if (!content) return null;

  const tokenLine = content.split('\n').find(line => line.includes('_authToken'));
  if (!tokenLine) {
    throw new Error('Cannot parse the token. Ensure npx google-artifactregistry-auth created it in the root directory.');
  }
  return tokenLine.slice(tokenLine.indexOf('=') + 1);
}

function createYarnrcWithSecret(secret) {
  const updatedYarnrcContent = CI_YARNRC_CONTENT.replace('TOKEN', secret);
  fs.writeFileSync(PROJECT_YARNRC_PATH, updatedYarnrcContent);
  console.log(`${PROJECT_YARNRC_PATH} has been created.`);
}

function performGoogleAuth() {
  // Authenticate with GCloud
  if (!process.argv.includes('--skip-gcloud')) {
    execCommand('gcloud auth application-default login', 'Gcloud auth failed');
    console.log('Gcloud authenticated successfully!');
  }

  // Authenticate with Google Artifacts
  execCommand('npx google-artifactregistry-auth', 'Google Artifacts auth failed');
  console.log('Google Artifacts authenticated successfully!');
}

function execCommand(command, errorMessage) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (e) {
    console.warn(`${errorMessage}: ${e}`);
  }
}

function setupProjectConfigurations() {
  // Save CI npm configuration to root .npmrc
  fs.writeFileSync(ROOT_NPMRC_PATH, CI_NPMRC_CONTENT);

  // Authenticate with services
  performGoogleAuth();

  // Save root .npmrc content to project .npmrc
  fs.writeFileSync(PROJECT_NPMRC_PATH, fs.readFileSync(ROOT_NPMRC_PATH, 'utf8'));

  // Create project yarn configuration
  createYarnrcWithSecret(extractAuthToken(ROOT_NPMRC_PATH));

  console.log('Setup complete.');
}

setupProjectConfigurations();
