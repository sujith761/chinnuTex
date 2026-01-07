const SizingPrice = require('../models/SizingPrice');
const WeavingPrice = require('../models/WeavingPrice');

// Get all sizing prices
exports.getAllSizingPrices = async (req, res) => {
  try {
    const prices = await SizingPrice.find({ isActive: true }).sort('pricePerKg');
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific sizing price by slug
exports.getSizingPriceBySlug = async (req, res) => {
  try {
    const price = await SizingPrice.findOne({ slug: req.params.slug, isActive: true });
    if (!price) return res.status(404).json({ error: 'Sizing price not found' });
    res.json(price);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all weaving prices
exports.getAllWeavingPrices = async (req, res) => {
  try {
    const prices = await WeavingPrice.find({ isActive: true }).sort('pricePerMetre');
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific weaving price by slug
exports.getWeavingPriceBySlug = async (req, res) => {
  try {
    const price = await WeavingPrice.findOne({ slug: req.params.slug, isActive: true });
    if (!price) return res.status(404).json({ error: 'Weaving price not found' });
    res.json(price);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate sizing cost
exports.calculateSizingCost = async (req, res) => {
  try {
    const { slug, quantity } = req.body;
    if (!slug || !quantity) {
      return res.status(400).json({ error: 'Missing slug or quantity' });
    }
    
    const price = await SizingPrice.findOne({ slug, isActive: true });
    if (!price) return res.status(404).json({ error: 'Yarn type not found' });
    
    const totalCost = price.pricePerKg * quantity;
    res.json({
      yarnType: price.yarnType,
      pricePerKg: price.pricePerKg,
      quantity,
      totalCost,
      calculation: `₹${price.pricePerKg} × ${quantity} kg = ₹${totalCost}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate weaving cost
exports.calculateWeavingCost = async (req, res) => {
  try {
    const { slug, quantity } = req.body;
    if (!slug || !quantity) {
      return res.status(400).json({ error: 'Missing slug or quantity' });
    }
    
    const price = await WeavingPrice.findOne({ slug, isActive: true });
    if (!price) return res.status(404).json({ error: 'Fabric type not found' });
    
    const totalCost = price.pricePerMetre * quantity;
    res.json({
      fabricType: price.fabricType,
      pricePerMetre: price.pricePerMetre,
      quantity,
      totalCost,
      calculation: `₹${price.pricePerMetre} × ${quantity} metres = ₹${totalCost}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Create or update sizing price
exports.createOrUpdateSizingPrice = async (req, res) => {
  try {
    const { yarnType, slug, pricePerKg, description } = req.body;
    if (!yarnType || !slug || pricePerKg === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const price = await SizingPrice.findOneAndUpdate(
      { slug },
      { yarnType, slug, pricePerKg, description },
      { upsert: true, new: true }
    );
    res.json(price);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Create or update weaving price
exports.createOrUpdateWeavingPrice = async (req, res) => {
  try {
    const { fabricType, slug, pricePerMetre, description } = req.body;
    if (!fabricType || !slug || pricePerMetre === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const price = await WeavingPrice.findOneAndUpdate(
      { slug },
      { fabricType, slug, pricePerMetre, description },
      { upsert: true, new: true }
    );
    res.json(price);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
