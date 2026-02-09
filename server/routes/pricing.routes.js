const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricing.controller');

// Public routes - Get pricing
router.get('/sizing/all', pricingController.getAllSizingPrices);
router.get('/sizing/:slug', pricingController.getSizingPriceBySlug);
router.get('/weaving/all', pricingController.getAllWeavingPrices);
router.get('/weaving/:slug', pricingController.getWeavingPriceBySlug);

// Calculate costs
router.post('/calculate/sizing', pricingController.calculateSizingCost);
router.post('/calculate/weaving', pricingController.calculateWeavingCost);

// Admin routes - Create/Update pricing (Add auth middleware if needed)
router.post('/admin/sizing', pricingController.createOrUpdateSizingPrice);
router.post('/admin/weaving', pricingController.createOrUpdateWeavingPrice);

module.exports = router;
