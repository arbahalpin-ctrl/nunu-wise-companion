// Generate minimal food cutting guide images using DALL-E
// Run with: node scripts/generate-food-images.cjs

const fs = require('fs');
const path = require('path');
const https = require('https');

// Get API key from env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Please set OPENAI_API_KEY environment variable');
  process.exit(1);
}

// Top first foods to generate (starting small)
const FOODS = [
  { id: 'banana', name: 'banana' },
  { id: 'avocado', name: 'avocado' },
  { id: 'sweet-potato', name: 'sweet potato wedges' },
  { id: 'broccoli', name: 'broccoli floret' },
  { id: 'strawberry', name: 'strawberry' },
  { id: 'egg', name: 'scrambled egg' },
];

// Age-specific cutting descriptions
const AGE_CUTS = {
  '6': 'as long thick strips/spears for baby to grip, or mashed',
  '7-8': 'in soft small chunks',
  '9-12': 'in small bite-sized pieces',
  '12plus': 'in regular small pieces'
};

async function generateImage(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      style: 'natural',
      quality: 'standard'
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.error) {
            reject(new Error(json.error.message));
          } else {
            resolve(json.data[0].url);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function main() {
  const outputDir = path.join(__dirname, '..', 'public', 'food-guides');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🍌 Generating food cutting guide images...\n');

  for (const food of FOODS) {
    for (const [age, cutDesc] of Object.entries(AGE_CUTS)) {
      const filename = `${food.id}-${age}.png`;
      const filepath = path.join(outputDir, filename);

      // Skip if already exists
      if (fs.existsSync(filepath)) {
        console.log(`⏭️  Skipping ${filename} (exists)`);
        continue;
      }

      const prompt = `Simple minimal illustration of ${food.name} cut ${cutDesc} for baby weaning. Clean white background, soft muted colors, flat illustration style, food arranged on small white plate, top-down view, cute minimal aesthetic, no text, no people, just the food on plate.`;

      console.log(`🎨 Generating ${filename}...`);
      
      try {
        const imageUrl = await generateImage(prompt);
        await downloadImage(imageUrl, filepath);
        console.log(`✅ Saved ${filename}`);
        
        // Wait between requests
        await new Promise(r => setTimeout(r, 1500));
      } catch (error) {
        console.error(`❌ Failed ${filename}: ${error.message}`);
      }
    }
  }

  console.log('\n✨ Done!');
}

main();
