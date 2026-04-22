import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_BASE_URL = 'https://tfhub.dev/tensorflow/tfjs-model/mobilebert/1';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'qna_model');

async function downloadFile(url, outputPath, isBinary = false) {
  return new Promise((resolve, reject) => {
    const tempPath = `${outputPath}.part`;
    const file = fs.createWriteStream(tempPath);
    const request = https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlink(tempPath, () => {});
        return downloadFile(response.headers.location, outputPath, isBinary)
          .then(resolve)
          .catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(tempPath, () => {});
        reject(new Error(`Failed to download ${url}: ${response.statusCode} ${response.statusMessage}`));
        return;
      }
      
      if (isBinary) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          fs.renameSync(tempPath, outputPath);
          resolve();
        });
      } else {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        response.on('end', () => {
          if (data.trim().startsWith('<!DOCTYPE') || data.trim().startsWith('<html')) {
            file.close();
            fs.unlink(tempPath, () => {});
            reject(new Error(`Received HTML instead of JSON from ${url}. The URL may be incorrect.`));
            return;
          }
          fs.writeFileSync(tempPath, data);
          fs.renameSync(tempPath, outputPath);
          resolve();
        });
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(tempPath, () => {});
      reject(err);
    });
    
    request.setTimeout(60000, () => {
      request.destroy();
      file.close();
      fs.unlink(tempPath, () => {});
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function downloadModel() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const modelJsonPath = path.join(OUTPUT_DIR, 'model.json');

  if (fs.existsSync(modelJsonPath)) {
    console.log('✓ model.json already exists, reusing local copy');
  } else {
    console.log('Downloading model.json...');
    const modelJsonUrl = `${MODEL_BASE_URL}/model.json?tfjs-format=file`;

    try {
      await downloadFile(modelJsonUrl, modelJsonPath);
      console.log('✓ Downloaded model.json');
    } catch (error) {
      console.error('Error downloading model.json:', error.message);
      console.log('Trying alternative URL format...');
      const altUrl = `${MODEL_BASE_URL}/default/1/model.json`;
      try {
        await downloadFile(altUrl, modelJsonPath);
        console.log('✓ Downloaded model.json from alternative URL');
      } catch (altError) {
        console.error('Alternative URL also failed:', altError.message);
        throw error;
      }
    }
  }

  console.log('Reading model.json to find weight files...');
  const modelJson = JSON.parse(fs.readFileSync(modelJsonPath, 'utf8'));
  
  const weightFiles = [];
  if (modelJson.weightsManifest) {
    modelJson.weightsManifest.forEach((manifest) => {
      if (manifest.paths) {
        manifest.paths.forEach((weightPath) => {
          weightFiles.push(weightPath);
        });
      }
    });
  }

  console.log(`Found ${weightFiles.length} weight file(s) to download`);

  for (let i = 0; i < weightFiles.length; i++) {
    const weightPath = weightFiles[i];
    let weightUrl;
    
    if (weightPath.startsWith('http')) {
      weightUrl = weightPath;
    } else {
      weightUrl = `${MODEL_BASE_URL}/${weightPath}?tfjs-format=file`;
    }
    
    const fileName = path.basename(weightPath);
    const outputPath = path.join(OUTPUT_DIR, fileName);
    if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
      console.log(`✓ Skipping ${fileName}, already exists`);
      continue;
    }
    
    console.log(`Downloading ${fileName} (${i + 1}/${weightFiles.length})...`);
    
    try {
      await downloadFile(weightUrl, outputPath, true);
      const stats = fs.statSync(outputPath);
      console.log(`✓ Downloaded ${fileName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    } catch (error) {
      console.error(`Error downloading ${fileName}:`, error.message);
      if (i === 0 && !weightPath.startsWith('http')) {
        console.log('Trying alternative URL format...');
        const altUrl = `${MODEL_BASE_URL}/default/1/${weightPath}`;
        try {
          await downloadFile(altUrl, outputPath, true);
          const stats = fs.statSync(outputPath);
          console.log(`✓ Downloaded ${fileName} from alternative URL (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        } catch (altError) {
          console.error('Alternative URL also failed:', altError.message);
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  console.log('Updating model.json to use relative paths...');
  if (modelJson.weightsManifest) {
    modelJson.weightsManifest.forEach((manifest) => {
      if (manifest.paths) {
        manifest.paths = manifest.paths.map((weightPath) => path.basename(weightPath));
      }
    });
  }

  fs.writeFileSync(modelJsonPath, JSON.stringify(modelJson, null, 2));
  console.log('✓ Updated model.json with relative paths');
  
  console.log('\n✓ Model download complete!');
  console.log(`Files saved to: ${OUTPUT_DIR}`);
}

downloadModel().catch((error) => {
  console.error('Download failed:', error);
  process.exit(1);
});
