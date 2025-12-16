/**
 * Seed script to add fragrance brands and their detection patterns
 * Run with: npx ts-node scripts/seed-fragrances.ts
 * OR: npm run seed:fragrances (if added to package.json)
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Brand from '../models/Brand';
import ProductCodePattern from '../models/ProductCodePattern';
import FakePattern from '../models/FakePattern';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authenticity-check-pro';

// Fragrance brands with patterns
const fragranceBrandsData = [
  // Luxury Fragrances
  {
    name: 'Dior Fragrance',
    description: 'French luxury fragrances, known for Sauvage, Miss Dior, and J\'adore.',
    tags: ['Luxury', 'French', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^DF[0-9]{6,8}$', notes: 'Dior Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[A-Z]{2}[0-9]{6,10}$', notes: 'Luxury fragrance codes' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Chanel Fragrance',
    description: 'French luxury fragrances, iconic No. 5, Coco Mademoiselle, Bleu de Chanel.',
    tags: ['Luxury', 'French', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^CF[0-9]{6,8}$', notes: 'Chanel Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[0-9]{4}[A-Z]{2}[0-9]{4}$', notes: 'Chanel fragrance format' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^COPY', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Tom Ford Fragrance',
    description: 'American luxury fragrances, known for Black Orchid, Oud Wood, Tobacco Vanille.',
    tags: ['Luxury', 'American', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^TFF[0-9]{6,8}$', notes: 'Tom Ford Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Creed',
    description: 'British luxury fragrance house, known for Aventus, Silver Mountain Water.',
    tags: ['Luxury', 'British', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^CR[0-9]{6,8}$', notes: 'Creed batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
      { pattern: '^COPY', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Maison Margiela',
    description: 'Belgian luxury fragrance house, known for Replica collection.',
    tags: ['Luxury', 'Belgian', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^MM[0-9]{6,8}$', notes: 'Maison Margiela batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Byredo',
    description: 'Swedish luxury fragrance brand, known for Gypsy Water, Mojave Ghost.',
    tags: ['Luxury', 'Swedish', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^BY[0-9]{6,8}$', notes: 'Byredo batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Le Labo',
    description: 'American luxury fragrance brand, known for Santal 33, Rose 31.',
    tags: ['Luxury', 'American', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^LL[0-9]{6,8}$', notes: 'Le Labo batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Diptyque',
    description: 'French luxury fragrance brand, known for candles and perfumes.',
    tags: ['Luxury', 'French', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^DP[0-9]{6,8}$', notes: 'Diptyque batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Jo Malone',
    description: 'British luxury fragrance brand, known for layering scents, part of Estée Lauder.',
    tags: ['Luxury', 'British', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^JM[0-9]{6,8}$', notes: 'Jo Malone batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Penhaligon\'s',
    description: 'British luxury fragrance house, established 1870.',
    tags: ['Luxury', 'British', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^PH[0-9]{6,8}$', notes: 'Penhaligon\'s batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Acqua di Parma',
    description: 'Italian luxury fragrance brand, known for Colonia.',
    tags: ['Luxury', 'Italian', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^ADP[0-9]{6,8}$', notes: 'Acqua di Parma batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Hermès Fragrance',
    description: 'French luxury fragrances, known for Terre d\'Hermès, Twilly.',
    tags: ['Luxury', 'French', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^HF[0-9]{6,8}$', notes: 'Hermès Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Giorgio Armani Fragrance',
    description: 'Italian luxury fragrances, known for Acqua di Gio, Code.',
    tags: ['Luxury', 'Italian', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^GA[0-9]{6,8}$', notes: 'Giorgio Armani Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Versace Fragrance',
    description: 'Italian luxury fragrances, known for Bright Crystal, Eros.',
    tags: ['Luxury', 'Italian', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^VF[0-9]{6,8}$', notes: 'Versace Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Dolce & Gabbana Fragrance',
    description: 'Italian luxury fragrances, known for Light Blue, The One.',
    tags: ['Luxury', 'Italian', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^DG[0-9]{6,8}$', notes: 'Dolce & Gabbana Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Prada Fragrance',
    description: 'Italian luxury fragrances, known for Candy, Luna Rossa.',
    tags: ['Luxury', 'Italian', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^PF[0-9]{6,8}$', notes: 'Prada Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Gucci Fragrance',
    description: 'Italian luxury fragrances, known for Bloom, Guilty, Flora.',
    tags: ['Luxury', 'Italian', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^GF[0-9]{6,8}$', notes: 'Gucci Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Burberry Fragrance',
    description: 'British luxury fragrances, known for Brit, My Burberry.',
    tags: ['Luxury', 'British', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^BF[0-9]{6,8}$', notes: 'Burberry Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Yves Saint Laurent Fragrance',
    description: 'French luxury fragrances, known for Libre, Opium, Black Opium.',
    tags: ['Luxury', 'French', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^YSLF[0-9]{6,8}$', notes: 'YSL Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Lancôme Fragrance',
    description: 'French luxury fragrances, known for La Vie Est Belle, Trésor.',
    tags: ['Luxury', 'French', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^LCF[0-9]{6,8}$', notes: 'Lancôme Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Guerlain Fragrance',
    description: 'French luxury fragrances, known for Shalimar, Mon Guerlain.',
    tags: ['Luxury', 'French', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^GLF[0-9]{6,8}$', notes: 'Guerlain Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  // Designer Fragrances
  {
    name: 'Calvin Klein Fragrance',
    description: 'American designer fragrances, known for CK One, Eternity, Obsession.',
    tags: ['Designer', 'American', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^CK[0-9]{6,8}$', notes: 'Calvin Klein Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Hugo Boss Fragrance',
    description: 'German designer fragrances, known for Boss Bottled, The Scent.',
    tags: ['Designer', 'German', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^HB[0-9]{6,8}$', notes: 'Hugo Boss Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Ralph Lauren Fragrance',
    description: 'American designer fragrances, known for Polo, Romance.',
    tags: ['Designer', 'American', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^RL[0-9]{6,8}$', notes: 'Ralph Lauren Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Diesel Fragrance',
    description: 'Italian designer fragrances, known for Only The Brave, Fuel for Life.',
    tags: ['Designer', 'Italian', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^DS[0-9]{6,8}$', notes: 'Diesel Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Montblanc Fragrance',
    description: 'German luxury fragrances, known for Legend, Explorer.',
    tags: ['Luxury', 'German', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^MB[0-9]{6,8}$', notes: 'Montblanc Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Issey Miyake Fragrance',
    description: 'Japanese designer fragrances, known for L\'Eau d\'Issey.',
    tags: ['Designer', 'Japanese', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^IM[0-9]{6,8}$', notes: 'Issey Miyake Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Kenzo Fragrance',
    description: 'French-Japanese designer fragrances, known for Flower, World.',
    tags: ['Designer', 'French', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^KZ[0-9]{6,8}$', notes: 'Kenzo Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Paco Rabanne Fragrance',
    description: 'French designer fragrances, known for 1 Million, Invictus.',
    tags: ['Designer', 'French', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^PR[0-9]{6,8}$', notes: 'Paco Rabanne Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Jean Paul Gaultier Fragrance',
    description: 'French designer fragrances, known for Le Male, Classique.',
    tags: ['Designer', 'French', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^JPG[0-9]{6,8}$', notes: 'Jean Paul Gaultier Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Thierry Mugler Fragrance',
    description: 'French designer fragrances, known for Angel, Alien.',
    tags: ['Designer', 'French', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^TM[0-9]{6,8}$', notes: 'Thierry Mugler Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Viktor & Rolf Fragrance',
    description: 'Dutch designer fragrances, known for Flowerbomb, Spicebomb.',
    tags: ['Designer', 'Dutch', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^VR[0-9]{6,8}$', notes: 'Viktor & Rolf Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Carolina Herrera Fragrance',
    description: 'Venezuelan-American designer fragrances, known for Good Girl, Bad Boy.',
    tags: ['Designer', 'American', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^CH[0-9]{6,8}$', notes: 'Carolina Herrera Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Marc Jacobs Fragrance',
    description: 'American designer fragrances, known for Daisy, Perfect.',
    tags: ['Designer', 'American', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^MJ[0-9]{6,8}$', notes: 'Marc Jacobs Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Dolce & Gabbana Light Blue',
    description: 'Italian luxury fragrance, iconic Light Blue collection.',
    tags: ['Luxury', 'Italian', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^DGLB[0-9]{6,8}$', notes: 'D&G Light Blue batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Bulgari Fragrance',
    description: 'Italian luxury fragrances, known for Omnia, Man.',
    tags: ['Luxury', 'Italian', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^BG[0-9]{6,8}$', notes: 'Bulgari Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Cartier Fragrance',
    description: 'French luxury fragrances, known for Déclaration, Santos.',
    tags: ['Luxury', 'French', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^CT[0-9]{6,8}$', notes: 'Cartier Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Bvlgari Fragrance',
    description: 'Italian luxury fragrances, known for Aqva, Man Glacial Essence.',
    tags: ['Luxury', 'Italian', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^BV[0-9]{6,8}$', notes: 'Bvlgari Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Salvatore Ferragamo Fragrance',
    description: 'Italian luxury fragrances, known for Signorina, Uomo.',
    tags: ['Luxury', 'Italian', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^SF[0-9]{6,8}$', notes: 'Salvatore Ferragamo Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Valentino Fragrance',
    description: 'Italian luxury fragrances, known for Valentino Uomo, Donna.',
    tags: ['Luxury', 'Italian', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^VF[0-9]{6,8}$', notes: 'Valentino Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Givenchy Fragrance',
    description: 'French luxury fragrances, known for L\'Interdit, Gentleman.',
    tags: ['Luxury', 'French', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^GV[0-9]{6,8}$', notes: 'Givenchy Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Lancôme La Vie Est Belle',
    description: 'French luxury fragrance, iconic La Vie Est Belle.',
    tags: ['Luxury', 'French', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^LVEB[0-9]{6,8}$', notes: 'La Vie Est Belle batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Estée Lauder Fragrance',
    description: 'American luxury fragrances, known for Beautiful, Pleasures.',
    tags: ['Luxury', 'American', 'Fragrance', 'Perfume'],
    genuinePatterns: [
      { pattern: '^ELF[0-9]{6,8}$', notes: 'Estée Lauder Fragrance batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const brandData of fragranceBrandsData) {
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

    console.log('\n✅ Fragrance seeding completed successfully!');
    console.log(`\nTotal fragrance brands: ${fragranceBrandsData.length}`);
    
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

seedDatabase();

