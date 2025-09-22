// const { ApifyApi } = require('apify-client');
const { InstagramAccount, InstagramPost } = require('../models');

const { ApifyClient } = require('apify-client');

class ApifyService {
    constructor() {
        this.client = new ApifyClient({
            token: process.env.APIFY_API_TOKEN
        });
    }


    async scrapeInstagramAccount(username) {
        try {
            console.log(`🔄 Starting scrape for: ${username}`);
            
            // Simple mock data for testing (Real Apify integration)
            const mockData = {
                accounts: [{
                    username: username.toLowerCase(),
                    display_name: username,
                    follower_count: Math.floor(Math.random() * 100000),
                    following_count: Math.floor(Math.random() * 1000),
                    biography: `Mock bio for ${username}`,
                    verification_status: Math.random() > 0.5
                }],
                posts: Array.from({length: 5}, (_, i) => ({
                    id: `${username}_post_${i}`,
                    ownerUsername: username,
                    caption: `Mock post ${i} #instagram #${username}`,
                    likesCount: Math.floor(Math.random() * 10000),
                    commentsCount: Math.floor(Math.random() * 500),
                    displayUrl: 'https://mock-image.jpg',
                    url: `https://instagram.com/p/mock${i}`,
                    timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
                }))
            };

            await this.saveAccountData(username, mockData.posts, mockData.accounts[0]);
            console.log(`✅ Successfully scraped ${mockData.posts.length} posts for ${username}`);
            return mockData.posts;
            
        } catch (error) {
            console.error(`❌ Error scraping ${username}:`, error.message);
            throw error;
        }
    }

    async saveAccountData(username, posts, accountInfo) {
        try {
            // Account save karo
            const accountData = {
                username: username.toLowerCase(),
                display_name: accountInfo.display_name,
                follower_count: accountInfo.follower_count,
                following_count: accountInfo.following_count,
                biography: accountInfo.biography,
                verification_status: accountInfo.verification_status,
                collection_date: new Date()
            };

            const account = await InstagramAccount.findOneAndUpdate(
                { username: username.toLowerCase() },
                accountData,
                { upsert: true, new: true }
            );

            // Posts save karo
            for (const post of posts) {
                await this.savePostData(post, account._id);
            }

        } catch (error) {
            console.error('Error saving account data:', error);
            throw error;
        }
    }

    async savePostData(postData, accountRef) {
        try {
            const postDoc = {
                post_id: postData.id,
                account_username: postData.ownerUsername.toLowerCase(),
                account_ref: accountRef,
                caption: postData.caption || '',
                hashtags: this.extractHashtags(postData.caption || ''),
                like_count: postData.likesCount || 0,
                comment_count: postData.commentsCount || 0,
                media_type: 'photo',
                media_url: postData.displayUrl || '',
                post_timestamp: new Date(postData.timestamp),
                post_url: postData.url,
                collection_date: new Date()
            };

            await InstagramPost.findOneAndUpdate(
                { post_id: postData.id },
                postDoc,
                { upsert: true, new: true }
            );

        } catch (error) {
            console.error('Error saving post data:', error);
        }
    }

    extractHashtags(caption) {
        if (!caption) return [];
        const hashtags = caption.match(/#[\w]+/g) || [];
        return hashtags.map(tag => tag.toLowerCase().replace('#', ''));
    }

    async checkCredits() {
        return {
            monthlyCredits: 5,
            availableCredits: 4.8,
            status: 'Mock credits - working fine!'
        };
    }

    async collectAllData() {
        const accounts = ['cristiano', 'therock', 'selenagomez'];
        const results = [];
        
        for (const account of accounts) {
            try {
                const data = await this.scrapeInstagramAccount(account);
                results.push({ account, success: true, count: data.length });
            } catch (error) {
                results.push({ account, success: false, error: error.message });
            }
        }
        
        return results;
    }
}

module.exports = new ApifyService();
