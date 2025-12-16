# Authenticity Check Pro

A comprehensive platform for verifying the authenticity of drinks and cosmetic products through code verification and image analysis.

## Features

- **Code Verification**: Verify products using batch numbers, serial numbers, and barcodes
- **Image Analysis**: Upload product packaging photos for AI-powered authenticity checks
- **Brand Directory**: Browse partnered brands and their verification guidelines
- **Admin Dashboard**: Manage brands, patterns, and view verification logs
- **Real-time Analytics**: Track verification statistics and system alerts

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based admin authentication
- **Image Storage**: Cloudinary (configurable)

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Authenticity Check Pro"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `ADMIN_EMAIL`: Admin login email (default: admin@acp.com)
- `ADMIN_PASSWORD`: Admin login password (default: admin123)
- Cloudinary credentials (optional, for image storage)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── admin/              # Admin pages
│   │   ├── dashboard/      # Admin dashboard
│   │   ├── brands/         # Brand management
│   │   └── login/          # Admin login
│   ├── api/                # API routes
│   │   ├── verify/         # Verification endpoints
│   │   └── admin/          # Admin API endpoints
│   ├── brands/             # Public brands directory
│   ├── verify-code/        # Code verification page
│   ├── verify-image/       # Image upload page
│   └── result/             # Verification results page
├── components/             # React components
├── lib/                    # Utility functions
├── models/                 # Mongoose models
└── public/                 # Static assets
```

## API Endpoints

### Public Endpoints

- `GET /api/brands` - Get all brands
- `POST /api/verify/code` - Verify product by code
- `POST /api/verify/image` - Verify product by image

### Admin Endpoints (Requires Authentication)

- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/logs` - Get verification logs
- `GET /api/admin/brands` - Get all brands
- `POST /api/admin/brands` - Create brand
- `DELETE /api/admin/brands/[id]` - Delete brand
- `GET /api/admin/code-patterns` - Get code patterns
- `POST /api/admin/code-patterns` - Create code pattern
- `GET /api/admin/fake-patterns` - Get fake patterns
- `POST /api/admin/fake-patterns` - Create fake pattern
- `GET /api/admin/reference-images` - Get reference images
- `POST /api/admin/reference-images` - Upload reference image

## Database Models

- **Brand**: Product brand information
- **ProductCodePattern**: Genuine product code patterns
- **FakePattern**: Known fake product patterns
- **ReferenceImage**: Reference images for comparison
- **VerificationLog**: All verification attempts and results

## Default Admin Credentials

- Email: `admin@acp.com`
- Password: `admin123`

**⚠️ IMPORTANT**: Change these credentials in production!

## Development

- Run development server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`
- Lint code: `npm run lint`
- Seed drink brands and patterns: `npm run seed` (requires MongoDB connection)

## Production Deployment

### Quick Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/authenticity-check-pro.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables (see `.env.example`)
   - Deploy!

3. **Set Environment Variables in Vercel:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Strong random string
   - `ADMIN_EMAIL` - Admin email
   - `ADMIN_PASSWORD` - Admin password

4. **Seed Database:**
   - After deployment, run seed scripts to populate brands
   - Or create a seed API endpoint

See `DEPLOYMENT.md` for detailed deployment instructions.

## Security Notes

- Change default admin credentials
- Use a strong JWT_SECRET
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Regularly update dependencies

## License

This project is proprietary software.

## Product Detection

This platform includes detection patterns for **drinks**, **cosmetics**, and **fragrances**.

### Drink Brands (19 brands)

**Cognac**: Hennessy, Remy Martin, Martell  
**Whiskey**: Jameson, Jack Daniel's, Johnnie Walker, Chivas Regal  
**Vodka**: Absolut, Smirnoff, Grey Goose, Cîroc  
**Liqueurs & Bitters**: Baileys, Campari, Orijin Bitters  
**Champagne**: Moët & Chandon, Veuve Clicquot, Dom Pérignon, Luc Belaire, Ace of Spades

### Cosmetic Brands (46 brands)

**Luxury**: Dior, Chanel, YSL, Tom Ford, Guerlain, Lancôme, Estée Lauder, Clinique, MAC, Bobbi Brown, La Mer, SK-II, Shiseido, La Prairie, Sisley, Clé de Peau Beauté

**Mid-Range**: L'Oréal, Maybelline, Revlon, CoverGirl, NYX, Urban Decay, Too Faced, Benefit, NARS, Fenty Beauty, Rare Beauty

**Skincare**: Olay, Neutrogena, CeraVe, The Ordinary, Glossier, Drunk Elephant, Sunday Riley, Kiehl's

**K-Beauty**: Laneige, Innisfree, Etude House, Tony Moly, Cosrx, Sulwhasoo

**Additional**: Anastasia Beverly Hills, Tarte, Charlotte Tilbury, Pat McGrath Labs, Hourglass

### Fragrance Brands (43 brands)

**Luxury**: Dior Fragrance, Chanel Fragrance, Tom Ford Fragrance, Creed, Maison Margiela, Byredo, Le Labo, Diptyque, Jo Malone, Penhaligon's, Acqua di Parma, Hermès, Giorgio Armani, Versace, Dolce & Gabbana, Prada, Gucci, Burberry, YSL Fragrance, Lancôme Fragrance, Guerlain Fragrance

**Designer**: Calvin Klein, Hugo Boss, Ralph Lauren, Diesel, Montblanc, Issey Miyake, Kenzo, Paco Rabanne, Jean Paul Gaultier, Thierry Mugler, Viktor & Rolf, Carolina Herrera, Marc Jacobs

**Additional**: Bulgari, Cartier, Bvlgari, Salvatore Ferragamo, Valentino, Givenchy, Estée Lauder Fragrance

### Adding Product Patterns

To seed the database with all brands and their detection patterns:

```bash
npm install  # Install dependencies if needed

# Add drink brands
npm run seed

# Add cosmetic brands
npm run seed:cosmetics

# Add fragrance brands
npm run seed:fragrances

# Add all at once
npm run seed:all
```

This will add:
- All brands with descriptions and tags
- Genuine code patterns for each brand (regex-based)
- Fake patterns to detect counterfeits

See `DETECTION_PATTERNS.md` for detailed information about the detection system.

## Support

For issues and questions, please contact the development team.




