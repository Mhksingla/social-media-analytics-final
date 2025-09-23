const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// ===== BASIC ANALYTICS ROUTES =====

// Individual account analytics
router.get('/engagement/:username', analyticsController.getEngagementRate);
router.get('/summary/:username', analyticsController.getAccountSummary);
router.get('/performance/:username', analyticsController.getContentPerformance);

// ===== ADVANCED ANALYTICS ROUTES =====

// Growth and trend analysis
router.get('/growth/:username', analyticsController.getGrowthTrend);

// Hashtag analysis
router.get('/hashtags/:username', analyticsController.getHashtagPerformance);

// Timing analysis
router.get('/timing/:username', analyticsController.getOptimalPostingTimes);

// Complete content strategy
router.get('/strategy/:username', analyticsController.getContentStrategy);

// ===== COMPARISON & BATCH ROUTES =====

// Compare multiple accounts
router.get('/compare', analyticsController.compareAccounts);

// Batch analytics for multiple accounts
router.get('/batch', analyticsController.getBatchAnalytics);

// ===== DASHBOARD ROUTES =====

// Complete dashboard summary
router.get('/dashboard/:username', analyticsController.getDashboardSummary);

// ===== UTILITY ROUTES =====

// Service health check
router.get('/health', analyticsController.getAnalyticsHealth);

// Get available accounts
router.get('/accounts', analyticsController.getAvailableAccounts);


module.exports = router;
