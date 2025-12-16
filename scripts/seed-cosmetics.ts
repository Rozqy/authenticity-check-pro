/**
 * Seed script to add cosmetic brands and their detection patterns
 * Run with: npx ts-node scripts/seed-cosmetics.ts
 * OR: npm run seed:cosmetics (if added to package.json)
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Brand from '../models/Brand';
import ProductCodePattern from '../models/ProductCodePattern';
import FakePattern from '../models/FakePattern';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authenticity-check-pro';

// Cosmetic brands with patterns
const cosmeticBrandsData = [
  // Luxury Cosmetics
  {
    name: 'Dior',
    description: 'French luxury cosmetics and fragrances brand, part of LVMH.',
    tags: ['Luxury', 'French', 'Makeup', 'Fragrance'],
    genuinePatterns: [
      { pattern: '^CD[0-9]{6,8}$', notes: 'Dior batch code format' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[A-Z]{2}[0-9]{6,10}$', notes: 'Luxury cosmetics codes' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Chanel',
    description: 'French luxury fashion and cosmetics house, known for No. 5 perfume.',
    tags: ['Luxury', 'French', 'Makeup', 'Fragrance'],
    genuinePatterns: [
      { pattern: '^CH[0-9]{6,8}$', notes: 'Chanel batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[0-9]{4}[A-Z]{2}[0-9]{4}$', notes: 'Chanel format' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^COPY', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Yves Saint Laurent (YSL)',
    description: 'French luxury cosmetics and fragrances, part of L\'Oréal.',
    tags: ['Luxury', 'French', 'Makeup', 'Fragrance'],
    genuinePatterns: [
      { pattern: '^YSL[0-9]{6,8}$', notes: 'YSL batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Tom Ford',
    description: 'American luxury cosmetics and fragrances brand.',
    tags: ['Luxury', 'American', 'Makeup', 'Fragrance'],
    genuinePatterns: [
      { pattern: '^TF[0-9]{6,8}$', notes: 'Tom Ford batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Guerlain',
    description: 'French luxury cosmetics and perfumes, part of LVMH.',
    tags: ['Luxury', 'French', 'Makeup', 'Fragrance'],
    genuinePatterns: [
      { pattern: '^GL[0-9]{6,8}$', notes: 'Guerlain batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Lancôme',
    description: 'French luxury cosmetics brand, part of L\'Oréal.',
    tags: ['Luxury', 'French', 'Makeup', 'Skincare'],
    genuinePatterns: [
      { pattern: '^LC[0-9]{6,8}$', notes: 'Lancôme batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Estée Lauder',
    description: 'American luxury cosmetics and skincare brand.',
    tags: ['Luxury', 'American', 'Makeup', 'Skincare'],
    genuinePatterns: [
      { pattern: '^EL[0-9]{6,8}$', notes: 'Estée Lauder batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[A-Z]{1,2}[0-9]{6,10}$', notes: 'Estée Lauder format' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Clinique',
    description: 'American skincare and cosmetics brand, part of Estée Lauder.',
    tags: ['Premium', 'American', 'Skincare', 'Makeup'],
    genuinePatterns: [
      { pattern: '^CL[0-9]{6,8}$', notes: 'Clinique batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'MAC Cosmetics',
    description: 'Professional makeup brand, part of Estée Lauder.',
    tags: ['Professional', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^MAC[0-9]{6,8}$', notes: 'MAC batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[A-Z]{3}[0-9]{6,8}$', notes: 'MAC format' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Bobbi Brown',
    description: 'Professional makeup brand, part of Estée Lauder.',
    tags: ['Professional', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^BB[0-9]{6,8}$', notes: 'Bobbi Brown batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'La Mer',
    description: 'Ultra-luxury skincare brand, part of Estée Lauder.',
    tags: ['Ultra-Luxury', 'Skincare', 'American'],
    genuinePatterns: [
      { pattern: '^LM[0-9]{6,8}$', notes: 'La Mer batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
      { pattern: '^COPY', risk_level: 'high' as const },
    ],
  },
  {
    name: 'SK-II',
    description: 'Japanese luxury skincare brand, part of Procter & Gamble.',
    tags: ['Luxury', 'Skincare', 'Japanese'],
    genuinePatterns: [
      { pattern: '^SK[0-9]{6,8}$', notes: 'SK-II batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Shiseido',
    description: 'Japanese luxury cosmetics and skincare brand.',
    tags: ['Luxury', 'Skincare', 'Makeup', 'Japanese'],
    genuinePatterns: [
      { pattern: '^SH[0-9]{6,8}$', notes: 'Shiseido batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'La Prairie',
    description: 'Swiss luxury skincare brand, known for anti-aging products.',
    tags: ['Ultra-Luxury', 'Skincare', 'Swiss'],
    genuinePatterns: [
      { pattern: '^LP[0-9]{6,8}$', notes: 'La Prairie batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Sisley',
    description: 'French luxury skincare and cosmetics brand.',
    tags: ['Luxury', 'Skincare', 'French'],
    genuinePatterns: [
      { pattern: '^SI[0-9]{6,8}$', notes: 'Sisley batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Clé de Peau Beauté',
    description: 'Japanese ultra-luxury skincare and cosmetics brand.',
    tags: ['Ultra-Luxury', 'Skincare', 'Makeup', 'Japanese'],
    genuinePatterns: [
      { pattern: '^CPB[0-9]{6,8}$', notes: 'Clé de Peau batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  // Mid-Range Cosmetics
  {
    name: 'L\'Oréal',
    description: 'French cosmetics and beauty brand, world\'s largest cosmetics company.',
    tags: ['Mid-Range', 'French', 'Makeup', 'Skincare'],
    genuinePatterns: [
      { pattern: '^LO[0-9]{6,8}$', notes: 'L\'Oréal batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
      { pattern: '^[0-9]{8,12}$', notes: 'Numeric codes' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Maybelline',
    description: 'American cosmetics brand, part of L\'Oréal.',
    tags: ['Drugstore', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^MB[0-9]{6,8}$', notes: 'Maybelline batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Revlon',
    description: 'American cosmetics brand, known for nail polish and lipstick.',
    tags: ['Drugstore', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^RV[0-9]{6,8}$', notes: 'Revlon batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'CoverGirl',
    description: 'American cosmetics brand, part of Coty.',
    tags: ['Drugstore', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^CG[0-9]{6,8}$', notes: 'CoverGirl batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'NYX Professional Makeup',
    description: 'American professional makeup brand, part of L\'Oréal.',
    tags: ['Professional', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^NYX[0-9]{6,8}$', notes: 'NYX batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Urban Decay',
    description: 'American cosmetics brand, known for bold colors, part of L\'Oréal.',
    tags: ['Professional', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^UD[0-9]{6,8}$', notes: 'Urban Decay batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Too Faced',
    description: 'American cosmetics brand, known for fun packaging, part of Estée Lauder.',
    tags: ['Professional', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^TF[0-9]{6,8}$', notes: 'Too Faced batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Benefit Cosmetics',
    description: 'American cosmetics brand, known for brow products, part of LVMH.',
    tags: ['Professional', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^BF[0-9]{6,8}$', notes: 'Benefit batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'NARS',
    description: 'French cosmetics brand, known for bold colors, part of Shiseido.',
    tags: ['Professional', 'Makeup', 'French'],
    genuinePatterns: [
      { pattern: '^NR[0-9]{6,8}$', notes: 'NARS batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Fenty Beauty',
    description: 'American cosmetics brand by Rihanna, part of LVMH.',
    tags: ['Professional', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^FB[0-9]{6,8}$', notes: 'Fenty Beauty batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Rare Beauty',
    description: 'American cosmetics brand by Selena Gomez.',
    tags: ['Professional', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^RB[0-9]{6,8}$', notes: 'Rare Beauty batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  // Skincare Brands
  {
    name: 'Olay',
    description: 'American skincare brand, part of Procter & Gamble.',
    tags: ['Drugstore', 'Skincare', 'American'],
    genuinePatterns: [
      { pattern: '^OL[0-9]{6,8}$', notes: 'Olay batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Neutrogena',
    description: 'American skincare brand, part of Johnson & Johnson.',
    tags: ['Drugstore', 'Skincare', 'American'],
    genuinePatterns: [
      { pattern: '^NT[0-9]{6,8}$', notes: 'Neutrogena batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'CeraVe',
    description: 'American skincare brand, part of L\'Oréal.',
    tags: ['Drugstore', 'Skincare', 'American'],
    genuinePatterns: [
      { pattern: '^CV[0-9]{6,8}$', notes: 'CeraVe batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'The Ordinary',
    description: 'Canadian skincare brand, part of DECIEM, known for affordable effective products.',
    tags: ['Affordable', 'Skincare', 'Canadian'],
    genuinePatterns: [
      { pattern: '^TO[0-9]{6,8}$', notes: 'The Ordinary batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Glossier',
    description: 'American beauty brand, known for minimal aesthetic.',
    tags: ['Premium', 'Makeup', 'Skincare', 'American'],
    genuinePatterns: [
      { pattern: '^GL[0-9]{6,8}$', notes: 'Glossier batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Drunk Elephant',
    description: 'American skincare brand, known for clean ingredients, part of Shiseido.',
    tags: ['Premium', 'Skincare', 'American'],
    genuinePatterns: [
      { pattern: '^DE[0-9]{6,8}$', notes: 'Drunk Elephant batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Sunday Riley',
    description: 'American skincare brand, known for active ingredients.',
    tags: ['Premium', 'Skincare', 'American'],
    genuinePatterns: [
      { pattern: '^SR[0-9]{6,8}$', notes: 'Sunday Riley batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Kiehl\'s',
    description: 'American skincare brand, part of L\'Oréal.',
    tags: ['Premium', 'Skincare', 'American'],
    genuinePatterns: [
      { pattern: '^KH[0-9]{6,8}$', notes: 'Kiehl\'s batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  // K-Beauty Brands
  {
    name: 'Laneige',
    description: 'South Korean skincare brand, part of Amorepacific.',
    tags: ['K-Beauty', 'Skincare', 'Korean'],
    genuinePatterns: [
      { pattern: '^LN[0-9]{6,8}$', notes: 'Laneige batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Innisfree',
    description: 'South Korean skincare brand, part of Amorepacific.',
    tags: ['K-Beauty', 'Skincare', 'Korean'],
    genuinePatterns: [
      { pattern: '^IF[0-9]{6,8}$', notes: 'Innisfree batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Etude House',
    description: 'South Korean cosmetics brand, part of Amorepacific.',
    tags: ['K-Beauty', 'Makeup', 'Korean'],
    genuinePatterns: [
      { pattern: '^EH[0-9]{6,8}$', notes: 'Etude House batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Tony Moly',
    description: 'South Korean cosmetics brand, known for cute packaging.',
    tags: ['K-Beauty', 'Makeup', 'Skincare', 'Korean'],
    genuinePatterns: [
      { pattern: '^TM[0-9]{6,8}$', notes: 'Tony Moly batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Cosrx',
    description: 'South Korean skincare brand, known for effective ingredients.',
    tags: ['K-Beauty', 'Skincare', 'Korean'],
    genuinePatterns: [
      { pattern: '^CX[0-9]{6,8}$', notes: 'Cosrx batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Sulwhasoo',
    description: 'South Korean luxury skincare brand, part of Amorepacific.',
    tags: ['Luxury', 'K-Beauty', 'Skincare', 'Korean'],
    genuinePatterns: [
      { pattern: '^SW[0-9]{6,8}$', notes: 'Sulwhasoo batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  // Additional Popular Brands
  {
    name: 'Anastasia Beverly Hills',
    description: 'American cosmetics brand, known for brow products.',
    tags: ['Professional', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^ABH[0-9]{6,8}$', notes: 'ABH batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Tarte Cosmetics',
    description: 'American cosmetics brand, known for natural ingredients.',
    tags: ['Professional', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^TC[0-9]{6,8}$', notes: 'Tarte batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Charlotte Tilbury',
    description: 'British luxury cosmetics brand.',
    tags: ['Luxury', 'Makeup', 'British'],
    genuinePatterns: [
      { pattern: '^CT[0-9]{6,8}$', notes: 'Charlotte Tilbury batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Pat McGrath Labs',
    description: 'American luxury cosmetics brand by makeup artist Pat McGrath.',
    tags: ['Luxury', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^PM[0-9]{6,8}$', notes: 'Pat McGrath batch code' },
      { pattern: '^[0-9]{13}$', notes: 'EAN-13 barcode' },
    ],
    fakePatterns: [
      { pattern: '^00000', risk_level: 'high' as const },
      { pattern: '^FAKE', risk_level: 'high' as const },
    ],
  },
  {
    name: 'Hourglass',
    description: 'American luxury cosmetics brand, known for ambient lighting products.',
    tags: ['Luxury', 'Makeup', 'American'],
    genuinePatterns: [
      { pattern: '^HG[0-9]{6,8}$', notes: 'Hourglass batch code' },
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

    for (const brandData of cosmeticBrandsData) {
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

    console.log('\n✅ Cosmetic seeding completed successfully!');
    console.log(`\nTotal cosmetic brands: ${cosmeticBrandsData.length}`);
    
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

