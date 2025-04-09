const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

let versionCode = parseInt(process.env.EXPO_PUBLIC_VERSION_CODE || '1');
versionCode++;

fs.writeFileSync('.env.local', `EXPO_PUBLIC_APP_VERSION=1.0.0\nEXPO_PUBLIC_VERSION_CODE=${versionCode}`);
console.log(`Updated EXPO_PUBLIC_VERSION_CODE to ${versionCode}`);