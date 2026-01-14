import cron from 'node-cron';
import db from './db/conn.mjs';
import { optimizeBase64Image, isBase64Image } from './utils/imageOptimizer.mjs';

/**
 * Scheduled task to optimize images in the database.
 * Runs daily at midnight.
 */
export function initCronJobs() {
  console.log('Initializing cron jobs...');

  // Run daily at midnight: '0 0 * * *'
  // For testing purposes, you might want to run it more frequently, 
  // e.g., every hour: '0 * * * *'
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily image optimization job...');
    await optimizeAllArticlesImages();
  });
}

/**
 * Iterates through all articles and optimizes their images if they are base64.
 */
export async function optimizeAllArticlesImages() {
  try {
    const collection = await db.collection("articles");
    const articles = await collection.find({ image: { $exists: true } }).toArray();

    console.log(`Checking ${articles.length} articles for image optimization...`);

    let optimizedCount = 0;
    for (const article of articles) {
      if (isBase64Image(article.image)) {
        const originalLength = article.image.length;
        const optimizedImage = await optimizeBase64Image(article.image);

        if (optimizedImage.length < originalLength) {
          await collection.updateOne(
            { _id: article._id },
            { $set: { image: optimizedImage, modify_date: new Date() } }
          );
          optimizedCount++;
          console.log(`Optimized image for article ${article._id}: ${originalLength} -> ${optimizedImage.length} bytes`);
        }
      }
    }

    console.log(`Image optimization job completed. Optimized ${optimizedCount} images.`);
  } catch (error) {
    console.error('Error during image optimization job:', error);
  }
}
