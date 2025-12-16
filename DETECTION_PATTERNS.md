# Detection Patterns Documentation

## Overview

This document explains the pattern detection system used to verify the authenticity of alcoholic beverages. The system uses a combination of regex patterns, exact matching, and heuristics to identify genuine and counterfeit products.

## Detection Methods

### 1. Pattern Matching System

The verification system uses three types of pattern matching:

#### A. Regex Pattern Matching
- Patterns starting with `^` or containing regex characters (`[`, `(`, `*`, `+`, `?`) are treated as regular expressions
- Example: `^HN[0-9]{6,8}$` matches "HN" followed by 6-8 digits
- Used for flexible matching of batch codes, serial numbers, and barcodes

#### B. Exact Matching
- If a pattern doesn't contain regex characters, exact string matching is attempted
- Example: Pattern "ABC123" matches only "ABC123"

#### C. Substring Matching
- Falls back to substring matching if exact match fails
- Checks if the pattern is contained in the code or vice versa

### 2. Code Components Analyzed

The system analyzes four code components:

1. **Batch Number**: Production batch identifier (usually 4-12 characters)
2. **Serial Number**: Unique product serial (usually 6-12 characters)
3. **Barcode**: EAN-13 format (13 digits) or other formats
4. **Combined Code**: All codes combined with dashes for comprehensive matching

### 3. Verification Process

#### Step 1: Fake Pattern Detection (Priority)
- Checks fake patterns FIRST (higher priority)
- If a fake pattern matches → **Result: FAKE** (Score: 20-30)
- Common fake patterns:
  - All zeros: `^00000`
  - Sequential numbers: `^12345`
  - Contains "FAKE", "TEST", "COPY"

#### Step 2: Genuine Pattern Matching
- Only checked if NOT already marked as fake
- If genuine pattern matches → **Result: VERIFIED** (Score: 85-90)
- Brand-specific patterns are checked

#### Step 3: Heuristic Fallback
- If no patterns match:
  - Basic format validation (length checks)
  - Date validity checks
  - **Result: PENDING** (Score: 30-50)

## Brand-Specific Patterns

### Cognac Brands

#### Hennessy
- **Genuine Patterns:**
  - `^HN[0-9]{6,8}$` - Batch codes starting with "HN"
  - `^[0-9]{13}$` - EAN-13 barcode format
  - `^[A-Z]{2}[0-9]{4,6}$` - Alphanumeric codes
- **Fake Patterns:**
  - `^00000` - All zeros (high risk)
  - `^12345` - Sequential numbers (high risk)
  - `^FAKE` - Contains "FAKE" (high risk)

#### Remy Martin
- **Genuine Patterns:**
  - `^RM[0-9]{6,8}$` - Remy Martin batch codes
  - `^[0-9]{13}$` - EAN-13 barcode
- **Fake Patterns:**
  - `^00000` - All zeros
  - `^TEST` - Test codes

#### Martell
- **Genuine Patterns:**
  - `^MT[0-9]{6,8}$` - Martell batch codes
  - `^[0-9]{13}$` - EAN-13 barcode

### Whiskey Brands

#### Jameson
- **Genuine Patterns:**
  - `^JM[0-9]{6,8}$` - Jameson batch codes
  - `^[A-Z]{2}[0-9]{6,8}$` - Irish whiskey format
- **Fake Patterns:**
  - `^00000` - All zeros
  - `^COPY` - Copy indicators

#### Jack Daniel's
- **Genuine Patterns:**
  - `^JD[0-9]{6,8}$` - Jack Daniel's batch codes
  - `^[0-9]{8,12}$` - Numeric batch codes
- **Fake Patterns:**
  - `^00000` - All zeros
  - `^12345` - Sequential numbers

#### Johnnie Walker
- **Genuine Patterns:**
  - `^JW[0-9]{6,8}$` - Johnnie Walker batch codes
  - `^[A-Z]{1,3}[0-9]{6,10}$` - Scotch whisky codes
- **Fake Patterns:**
  - `^00000` - All zeros
  - `^FAKE` - Fake indicators

#### Chivas Regal
- **Genuine Patterns:**
  - `^CR[0-9]{6,8}$` - Chivas Regal batch codes
  - `^[0-9]{13}$` - EAN-13 barcode

### Vodka Brands

#### Absolut Vodka
- **Genuine Patterns:**
  - `^AB[0-9]{6,8}$` - Absolut batch codes
  - `^[0-9]{8,12}$` - Numeric codes
- **Fake Patterns:**
  - `^00000` - All zeros
  - `^TEST` - Test codes

#### Smirnoff Vodka
- **Genuine Patterns:**
  - `^SM[0-9]{6,8}$` - Smirnoff batch codes
  - `^[0-9]{13}$` - EAN-13 barcode

#### Grey Goose
- **Genuine Patterns:**
  - `^GG[0-9]{6,8}$` - Grey Goose batch codes
  - `^[0-9]{13}$` - EAN-13 barcode

#### Cîroc
- **Genuine Patterns:**
  - `^CI[0-9]{6,8}$` - Cîroc batch codes
  - `^[0-9]{13}$` - EAN-13 barcode

### Liqueur & Bitters

#### Baileys Irish Cream
- **Genuine Patterns:**
  - `^BL[0-9]{6,8}$` - Baileys batch codes
  - `^[0-9]{13}$` - EAN-13 barcode

#### Campari
- **Genuine Patterns:**
  - `^CP[0-9]{6,8}$` - Campari batch codes
  - `^[0-9]{13}$` - EAN-13 barcode

#### Orijin Bitters
- **Genuine Patterns:**
  - `^OR[0-9]{6,8}$` - Orijin batch codes
  - `^[0-9]{13}$` - EAN-13 barcode
- **Fake Patterns:**
  - `^00000` - All zeros
  - `^FAKE` - Fake indicators

### Champagne & Sparkling Wine

#### Moët & Chandon
- **Genuine Patterns:**
  - `^MC[0-9]{6,8}$` - Moët & Chandon batch codes
  - `^[A-Z]{2}[0-9]{6,10}$` - Champagne codes
- **Fake Patterns:**
  - `^00000` - All zeros

#### Veuve Clicquot
- **Genuine Patterns:**
  - `^VC[0-9]{6,8}$` - Veuve Clicquot batch codes
  - `^[0-9]{13}$` - EAN-13 barcode

#### Dom Pérignon
- **Genuine Patterns:**
  - `^DP[0-9]{6,8}$` - Dom Pérignon batch codes
  - `^[A-Z]{2,3}[0-9]{6,10}$` - Luxury champagne codes
- **Fake Patterns:**
  - `^00000` - All zeros
  - `^FAKE` - Fake indicators

#### Luc Belaire
- **Genuine Patterns:**
  - `^LB[0-9]{6,8}$` - Luc Belaire batch codes
  - `^[0-9]{13}$` - EAN-13 barcode

#### Ace of Spades (Armand de Brignac)
- **Genuine Patterns:**
  - `^ADB[0-9]{6,8}$` - Armand de Brignac batch codes
  - `^[A-Z]{2,3}[0-9]{6,10}$` - Ultra-luxury codes
- **Fake Patterns:**
  - `^00000` - All zeros
  - `^FAKE` - Fake indicators
  - `^COPY` - Copy indicators

## Common Fake Patterns Detected

1. **All Zeros**: `^00000` - Counterfeiters often use simple patterns
2. **Sequential Numbers**: `^12345` - Easy to spot fake sequences
3. **Test Codes**: Contains "TEST", "FAKE", "COPY"
4. **Invalid Formats**: Codes that don't match brand-specific patterns
5. **Missing Codes**: Empty or incomplete batch/serial numbers

## Scoring System

- **90-100**: Verified (matched genuine pattern exactly)
- **85-89**: Verified (matched genuine pattern with substring)
- **50-84**: Pending (format valid but no pattern match)
- **30-49**: Pending (format issues)
- **20-29**: Fake (matched fake pattern)

## Usage

### Running the Seed Script

To add all brands and patterns to your database:

```bash
node scripts/seed-drinks.js
```

### Adding New Patterns

1. Go to Admin Panel → Brands → Add Brand
2. Go to Admin Panel → Code Patterns → Add Pattern
3. Use regex format for flexible matching (e.g., `^BRAND[0-9]{6,8}$`)

## Pattern Format Guidelines

### Regex Patterns
- Start with `^` for beginning of string
- Use `$` for end of string
- `[0-9]{6,8}` means 6-8 digits
- `[A-Z]{2}` means 2 uppercase letters
- `[A-Z]{1,3}` means 1-3 uppercase letters

### Examples
- `^HN[0-9]{6,8}$` - Matches "HN" + 6-8 digits
- `^[0-9]{13}$` - Matches exactly 13 digits (EAN-13)
- `^[A-Z]{2}[0-9]{6,10}$` - Matches 2 letters + 6-10 digits

## Notes

- Patterns are case-sensitive
- Fake patterns are checked first (higher priority)
- Without pattern matches, products default to "PENDING"
- The system requires actual pattern matches to verify authenticity

