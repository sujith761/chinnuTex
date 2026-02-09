const Product = require('../models/Product');

exports.list = async (req, res) => {
  try {
    const { processType } = req.query;
    const filter = processType ? { processType } : {};
    const items = await Product.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, ratePerMeter, processType, imageUrl } = req.body;
    const p = await Product.create({ name, description, ratePerMeter, processType, imageUrl });
    res.status(201).json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const p = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
