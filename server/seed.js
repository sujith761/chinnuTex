require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const Admin = require('./models/Admin');
const User = require('./models/User');
const SizingPrice = require('./models/SizingPrice');
const WeavingPrice = require('./models/WeavingPrice');

(async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB || 'chinnutex' });

    // Sizing Prices
    const sizingPrices = [
      { yarnType: 'Cotton', slug: 'cotton', pricePerKg: 450, description: 'High-quality cotton yarn sizing' },
      { yarnType: 'Polyester', slug: 'polyester', pricePerKg: 520, description: 'Durable polyester yarn sizing' },
      { yarnType: 'Viscose', slug: 'viscose', pricePerKg: 480, description: 'Smooth viscose (rayon) yarn sizing' },
      { yarnType: 'PC Blend', slug: 'pc-blend', pricePerKg: 510, description: 'Polyester-Cotton blended yarn sizing' },
      { yarnType: 'PV Blend', slug: 'pv-blend', pricePerKg: 490, description: 'Polyester-Viscose blended yarn sizing' },
      { yarnType: 'Nylon', slug: 'nylon', pricePerKg: 550, description: 'Strong nylon yarn sizing' },
      { yarnType: 'Acrylic', slug: 'acrylic', pricePerKg: 470, description: 'Premium acrylic yarn sizing' }
    ];

    // Weaving Prices
    const weavingPrices = [
      { fabricType: 'Cotton', slug: 'cotton', pricePerMetre: 280, description: 'Classic cotton fabric weaving' },
      { fabricType: 'Rayon', slug: 'rayon', pricePerMetre: 320, description: 'Smooth rayon fabric weaving' },
      { fabricType: 'Polyester', slug: 'polyester', pricePerMetre: 250, description: 'Durable polyester fabric weaving' },
      { fabricType: 'Silk', slug: 'silk', pricePerMetre: 450, description: 'Luxurious silk fabric weaving' },
      { fabricType: 'Woollen', slug: 'woollen', pricePerMetre: 380, description: 'Warm woollen fabric weaving' },
      { fabricType: 'Linen', slug: 'linen', pricePerMetre: 400, description: 'Premium linen fabric weaving' },
      { fabricType: 'Nylon', slug: 'nylon', pricePerMetre: 240, description: 'Strong nylon fabric weaving' },
      { fabricType: 'Acrylic', slug: 'acrylic', pricePerMetre: 0, description: 'Premium acrylic fabric (custom pricing)' }
    ];

    await SizingPrice.deleteMany({});
    await WeavingPrice.deleteMany({});
    await SizingPrice.insertMany(sizingPrices);
    await WeavingPrice.insertMany(weavingPrices);

    const products = [
      { name: 'Starch Sizing', description: 'Traditional cost-effective sizing for cotton', ratePerMeter: 18, processType: 'sizing' },
      { name: 'Mo✅ Seed complete - Pricing data loaded Sizing', description: 'Improved starch for better adhesion', ratePerMeter: 22, processType: 'sizing' },
      { name: 'Synthetic (PVA) Sizing', description: 'High-performance PVA for all fibers', ratePerMeter: 32, processType: 'sizing' },
      { name: 'Blended Sizing', description: 'Starch + PVA balanced solution', ratePerMeter: 26, processType: 'sizing' },
      { name: 'Eco-Friendly Bio-Sizing', description: 'Sustainable bio-polymer sizing', ratePerMeter: 35, processType: 'sizing' },
      { name: 'Plain Weaving', description: 'Basic plain weave for cotton fabrics', ratePerMeter: 28, processType: 'weaving' },
      { name: 'Twill Weaving', description: 'Diagonal twill pattern weaving', ratePerMeter: 32, processType: 'weaving' },
      { name: 'Jacquard Weaving', description: 'Complex pattern weaving service', ratePerMeter: 45, processType: 'weaving' },
      { name: 'Dobby Weaving', description: 'Small pattern dobby weaving', ratePerMeter: 36, processType: 'weaving' }
    ];

    await Product.deleteMany({});
    await Product.insertMany(products);

    const adminEmail = 'mailtosujithcs@gmail.com';
    const adminPass = await bcrypt.hash('sujithcs09', 10);
    const adminExists = await Admin.findOne({ email: adminEmail });
    if (!adminExists) {
      await Admin.create({ name: 'Sujith CS', email: adminEmail, password: adminPass, role: 'admin' });
    }

    // Ensure a demo user exists for quick testing
    const demoEmail = 'demo@chinnutex.com';
    const demoExists = await User.findOne({ email: demoEmail });
    if (!demoExists) {
      const demoPass = await bcrypt.hash('Demo@123', 10);
      await User.create({ name: 'Demo User', email: demoEmail, password: demoPass, company: 'Demo Co', role: 'user' });
    }

    console.log('Seed complete');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
