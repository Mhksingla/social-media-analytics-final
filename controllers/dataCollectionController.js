const apifyService = require('../services/apifyService');
const { InstagramAccount, InstagramPost } = require('../models');

const dataCollectionController = {
    // Manual data collection trigger
    async triggerCollection(req, res) {
        try {
            console.log('🚀 Manual data collection triggered');
            
            // Credits check karo
            const credits = await apifyService.checkCredits();
            if (credits) {
                console.log('💰 Available credits:', credits.availableCredits);
            }

            const results = await apifyService.collectAllData();
            
            res.json({
                success: true,
                message: 'Data collection completed',
                results,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Collection error:', error);
            res.status(500).json({
                success: false,
                message: 'Data collection failed',
                error: error.message
            });
        }
    },

    // Single account scrape
    async scrapeAccount(req, res) {
        try {
            const { username } = req.params;
            
            if (!username) {
                return res.status(400).json({
                    success: false,
                    message: 'Username is required'
                });
            }

            const data = await apifyService.scrapeInstagramAccount(username);
            
            res.json({
                success: true,
                message: `Successfully scraped ${username}`,
                count: data.length,
                data: data.slice(0, 5) // First 5 posts for preview
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Scraping failed',
                error: error.message
            });
        }
    },

    // Collection status check
    async getCollectionStats(req, res) {
        try {
            const accountCount = await InstagramAccount.countDocuments();
            const postCount = await InstagramPost.countDocuments();
            const recentPosts = await InstagramPost.countDocuments({
                collection_date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            });

            res.json({
                success: true,
                stats: {
                    total_accounts: accountCount,
                    total_posts: postCount,
                    posts_last_24h: recentPosts,
                    last_updated: new Date()
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    // Credits status
    async getCreditsStatus(req, res) {
        try {
            const credits = await apifyService.checkCredits();
            res.json({
                success: true,
                credits
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
};

module.exports = dataCollectionController;
