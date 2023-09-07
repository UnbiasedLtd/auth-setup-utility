#!/usr/bin/env node

const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log(process.argv);
console.log(`Executed in: ${path.resolve(process.cwd())}`);
process.exit(0);

const CI_NPMRC_PATH = './ci/npmrc';
const CI_YARNRC_PATH = './ci/yarnrc';
const ROOT_NPMRC_PATH = path.join(os.homedir(), '.npmrc');
const PROJECT_NPMRC_PATH = './.npmrc';
const PROJECT_YARNRC_PATH = './.yarnrc.yml';

function getFileContent(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, 'utf8');
}

function extractSecretFromContent(filePath) {
  const content = getFileContent(filePath);
  const lines = content.split('\n');
  const tokenLine = lines.find(el => el.includes('_authToken'));
  if (!tokenLine) {
    throw new Error('Can not parse the token . Be sure npx google-artifactregistry-auth created it into the home directory');
  }
  return tokenLine.slice(tokenLine.indexOf('=') + 1);
}

function createProjectNpmrc() {
  const ciNpmrcContent = getFileContent(CI_NPMRC_PATH);
  // const rootNpmrcContent = getFileContent(ROOT_NPMRC_PATH);

  fs.writeFileSync(ROOT_NPMRC_PATH, ciNpmrcContent);

  // Create the project npmrc
  fs.writeFileSync(PROJECT_NPMRC_PATH, getFileContent(ROOT_NPMRC_PATH));

  console.log(`${PROJECT_NPMRC_PATH} has been created.`);
}

function createProjectYarnrc(secret) {
  const updatedYarnrcContent = getFileContent(CI_YARNRC_PATH).replace('TOKEN', secret);
  fs.writeFileSync(PROJECT_YARNRC_PATH, updatedYarnrcContent);
  console.log(`${PROJECT_YARNRC_PATH} has been created.`);
}

function runGoogleAuth() {
  // Auth to GCloud
  if (!process.argv.includes('--skip-gcloud')) {
    try {
      execSync('gcloud auth application-default login', { stdio: 'inherit' });
    } catch (e) {
      throw new Error('Gcloud Auth failed:' + e);
    }
    console.log('Gcloud auth done!');
  }
  // Auth to Google Artifacts, so the token updated
  try {
    execSync('npx google-artifactregistry-auth', { stdio: 'inherit' });
  } catch (e) {
    throw new Error('Google Artifacts Auth failed:' + e);
  }
  console.log('Google Artifacts Auth done!');
}

function main() {
  runGoogleAuth();
  createProjectNpmrc();
  createProjectYarnrc(extractSecretFromContent(PROJECT_NPMRC_PATH));
  console.log('Setup complete.');
}

main();
