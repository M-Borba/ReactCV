# QnA Model Files

This directory should contain the QnA model files to bundle them locally instead of fetching from CDN.

## How to Download the Model Files

1. Start your development server: `npm start`
2. Open your browser and navigate to the chat component
3. Open Browser DevTools (F12) and go to the **Network** tab
4. Filter by "model.json" or "tfhub"
5. Reload the page - you should see requests to:
   - `https://tfhub.dev/tensorflow/tfjs-model/mobilebert/1/model.json`
   - Weight files (`.bin` files) from `storage.googleapis.com` or `tfhub.dev`
6. Right-click on each file and select "Save As" or "Copy as cURL" then download
7. Save `model.json` and all `.bin` weight files to this directory (`public/qna_model/`)

## Alternative: Using Browser Console

You can also run this in the browser console while on the chat page:

```javascript
// This will attempt to download the model files
(async () => {
  const modelUrl = 'https://tfhub.dev/tensorflow/tfjs-model/mobilebert/1';
  const response = await fetch(`${modelUrl}/model.json`);
  const modelJson = await response.json();
  
  // Download model.json
  const blob = new Blob([JSON.stringify(modelJson, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'model.json';
  a.click();
  
  console.log('Downloaded model.json. Check the Network tab for weight files to download.');
})();
```

## File Structure

After downloading, you should have:
```
public/qna_model/
  ├── model.json
  ├── group1-shard1ofX.bin
  ├── group1-shard2ofX.bin
  └── ... (other weight files)
```

## Important: Update model.json Paths

After downloading `model.json`, you may need to update the weight file paths to be relative instead of absolute URLs. Open `model.json` and look for paths like:

```json
{
  "weightsManifest": [{
    "paths": [
      "https://storage.googleapis.com/.../group1-shard1of2.bin"
    ]
  }]
}
```

Change them to relative paths:

```json
{
  "weightsManifest": [{
    "paths": [
      "group1-shard1of2.bin"
    ]
  }]
}
```

The code will automatically load from this directory if the files exist, otherwise it will fall back to the CDN.
