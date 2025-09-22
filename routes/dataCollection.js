const express = require('express');
const router = express.Router();
const dataCollectionController = require('../controllers/dataCollectionController');
// const auth = require('../middleware/auth'); // Member 1's auth middleware

// Collection routes
router.post('/trigger', dataCollectionController.triggerCollection);
router.post('/scrape/:username', dataCollectionController.scrapeAccount);
router.get('/stats', dataCollectionController.getCollectionStats);
router.get('/credits', dataCollectionController.getCreditsStatus);

module.exports = router;
