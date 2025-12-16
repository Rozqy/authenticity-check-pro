/**
 * Seed script to add drink brands and their detection patterns
 * Run with: npx ts-node scripts/seed-drinks.ts
 * OR: npm run seed (if added to package.json)
 * 
 * This script adds:
 * - All drink brands with descriptions
 * - Genuine code patterns for each brand
 * - Fake patterns to detect counterfeits
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Brand from '../models/Brand';
import ProductCodePattern from '../models/ProductCodePattern';
import FakePattern from '../models/FakePattern';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authenticity-check-pro';

// Brand definitions with patterns
const brandsData = [
  {
    name: 'Hennessy',
    description: 'French cognac brand, part of LVMH. Known for VS, VSOP, and XO variants.',
    tags: ['Cognac', 'Premium', 'Luxury'],
    genuinePatterns: [
      { pattern: '^HN[0-9]{6,8}$', notes: 'Hennessy batch code format: HN followed by 6-8 digits' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode format' },
      { pattern: '^[A-Z]{2}[0-9]{4,6}$', notes: 'Alphanumeric batch codes' },
    ],
    fakePatterns: [
      { pattern: '^00000', notes: 'Fake: All zeros pattern', risk_level: 'high' as const },
      { pattern: '^12345', notes: 'Fake: Sequential numbers', risk_level: 'high' as const },
      { pattern: '^FAKE', notes: 'Fake: Contains FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Remy Martin',
    description: 'French cognac producer, known for premium VSOP and XO cognacs.',
    tags: ['Cognac', 'Premium', 'French'],
    genuinePatterns: [
      { pattern: '^RM[0-9]{6,8}$', notes: 'Remy Martin batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[A-Z]{1,2}[0-9]{6,10}$', notes: 'Alphanumeric codes' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^TEST', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Martell',
    description: 'Oldest of the great cognac houses, founded in 1715.',
    tags: ['Cognac', 'Premium', 'Heritage'],
    genuinePatterns: [
      { pattern: '^MT[0-9]{6,8}$', notes: 'Martell batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Jameson',
    description: 'Irish whiskey brand, one of the best-selling Irish whiskeys worldwide.',
    tags: ['Whiskey', 'Irish', 'Premium'],
    genuinePatterns: [
      { pattern: '^JM[0-9]{6,8}$', notes: 'Jameson batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[A-Z]{2}[0-9]{6,8}$', notes: 'Irish whiskey codes' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^COPY', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Jack Daniel\'s',
    description: 'American whiskey brand, known for Old No. 7 Tennessee Whiskey.',
    tags: ['Whiskey', 'American', 'Tennessee'],
    genuinePatterns: [
      { pattern: '^JD[0-9]{6,8}$', notes: 'Jack Daniel\'s batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[0-9]{8,12}$', notes: 'Numeric batch codes' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^12345', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Johnnie Walker',
    description: 'Scotch whisky brand, known for Red Label, Black Label, Gold Label, and Blue Label.',
    tags: ['Whisky', 'Scotch', 'Premium'],
    genuinePatterns: [
      { pattern: '^JW[0-9]{6,8}$', notes: 'Johnnie Walker batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[A-Z]{1,3}[0-9]{6,10}$', notes: 'Scotch whisky codes' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Chivas Regal',
    description: 'Premium blended Scotch whisky, known for 12 Year Old and 18 Year Old.',
    tags: ['Whisky', 'Scotch', 'Premium'],
    genuinePatterns: [
      { pattern: '^CR[0-9]{6,8}$', notes: 'Chivas Regal batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Baileys Irish Cream',
    description: 'Irish cream liqueur made with Irish whiskey and cream.',
    tags: ['Liqueur', 'Irish', 'Cream'],
    genuinePatterns: [
      { pattern: '^BL[0-9]{6,8}$', notes: 'Baileys batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Absolut Vodka',
    description: 'Swedish vodka brand, known for its distinctive bottle design.',
    tags: ['Vodka', 'Swedish', 'Premium'],
    genuinePatterns: [
      { pattern: '^AB[0-9]{6,8}$', notes: 'Absolut batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[0-9]{8,12}$', notes: 'Numeric codes' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^TEST', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Smirnoff Vodka',
    description: 'Russian-origin vodka brand, now produced globally.',
    tags: ['Vodka', 'Russian', 'Premium'],
    genuinePatterns: [
      { pattern: '^SM[0-9]{6,8}$', notes: 'Smirnoff batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Grey Goose',
    description: 'French premium vodka, popular in high-end clubs and bars.',
    tags: ['Vodka', 'French', 'Luxury'],
    genuinePatterns: [
      { pattern: '^GG[0-9]{6,8}$', notes: 'Grey Goose batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Cîroc',
    description: 'French vodka made from grapes, part of Diageo portfolio.',
    tags: ['Vodka', 'French', 'Premium'],
    genuinePatterns: [
      { pattern: '^CI[0-9]{6,8}$', notes: 'Cîroc batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Campari',
    description: 'Italian alcoholic liqueur, known for its bitter taste and red color.',
    tags: ['Liqueur', 'Italian', 'Bitter'],
    genuinePatterns: [
      { pattern: '^CP[0-9]{6,8}$', notes: 'Campari batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Orijin Bitters',
    description: 'Nigerian herbal bitters, popular in West Africa.',
    tags: ['Bitters', 'Herbal', 'Nigerian'],
    genuinePatterns: [
      { pattern: '^OR[0-9]{6,8}$', notes: 'Orijin batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Moët & Chandon',
    description: 'French champagne house, part of LVMH, known for Dom Pérignon.',
    tags: ['Champagne', 'French', 'Luxury'],
    genuinePatterns: [
      { pattern: '^MC[0-9]{6,8}$', notes: 'Moët & Chandon batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[A-Z]{2}[0-9]{6,10}$', notes: 'Champagne codes' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Veuve Clicquot',
    description: 'French champagne house, known for yellow label champagne.',
    tags: ['Champagne', 'French', 'Premium'],
    genuinePatterns: [
      { pattern: '^VC[0-9]{6,8}$', notes: 'Veuve Clicquot batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Dom Pérignon',
    description: 'Luxury champagne brand, prestige cuvée of Moët & Chandon.',
    tags: ['Champagne', 'French', 'Ultra-Luxury'],
    genuinePatterns: [
      { pattern: '^DP[0-9]{6,8}$', notes: 'Dom Pérignon batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[A-Z]{2}[0-9]{6,10}$', notes: 'Luxury champagne codes' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Luc Belaire',
    description: 'French sparkling wine, popular in clubs and celebrations.',
    tags: ['Sparkling Wine', 'French', 'Premium'],
    genuinePatterns: [
      { pattern: '^LB[0-9]{6,8}$', notes: 'Luc Belaire batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Ace of Spades (Armand de Brignac)',
    description: 'Ultra-luxury champagne, known for gold bottles and celebrity endorsements.',
    tags: ['Champagne', 'French', 'Ultra-Luxury'],
    genuinePatterns: [
      { pattern: '^ADB[0-9]{6,8}$', notes: 'Armand de Brignac batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[A-Z]{2,3}[0-9]{6,10}$', notes: 'Ultra-luxury codes' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
      { pattern: '^COPY', risk_level: 'high' as const },
    ],
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Brand.deleteMany({});
    // await ProductCodePattern.deleteMany({});
    // await FakePattern.deleteMany({});

    for (const brandData of brandsData) {
      console.log(`\nProcessing brand: ${brandData.name}`);

      // Create or find brand
      let brand = await Brand.findOne({ name: brandData.name });
      if (!brand) {
        brand = await Brand.create({
          name: brandData.name,
          description: brandData.description,
          tags: brandData.tags,
        });
        console.log(`  ✓ Created brand: ${brandData.name}`);
      } else {
        console.log(`  - Brand already exists: ${brandData.name}`);
      }

      // Add genuine patterns
      for (const patternData of brandData.genuinePatterns) {
        const existingPattern = await ProductCodePattern.findOne({
          brand_id: brand._id,
          pattern: patternData.pattern,
        });

        if (!existingPattern) {
          await ProductCodePattern.create({
            brand_id: brand._id,
            pattern: patternData.pattern,
            is_genuine: true,
            notes: patternData.notes,
          });
          console.log(`    ✓ Added genuine pattern: ${patternData.pattern}`);
        }
      }

      // Add fake patterns
      for (const patternData of brandData.fakePatterns) {
        const existingPattern = await FakePattern.findOne({
          brand_id: brand._id,
          pattern: patternData.pattern,
        });

        if (!existingPattern) {
          await FakePattern.create({
            brand_id: brand._id,
            pattern: patternData.pattern,
            fake_signs: ['Suspicious pattern detected'],
            risk_level: patternData.risk_level || 'high',
          });
          console.log(`    ✓ Added fake pattern: ${patternData.pattern}`);
        }
      }
    }

    console.log('\n✅ Seeding completed successfully!');
    console.log(`\nTotal brands: ${brandsData.length}`);
    
    const totalGenuine = await ProductCodePattern.countDocuments();
    const totalFake = await FakePattern.countDocuments();
    console.log(`Total genuine patterns: ${totalGenuine}`);
    console.log(`Total fake patterns: ${totalFake}`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();

