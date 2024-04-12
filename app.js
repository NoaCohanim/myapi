
const express = require('express');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize the YouTube Data API
const youtube = google.youtube({
    version: 'v3',
    auth: 'AIzaSyC25_ipUey6BG_Q3-olu_oU9pFiAcOOVcE' //the key I used
});

// Function to fetch video details including snippet, contentDetails, and statistics
async function fetchVideoDetails() {
    try {
        // Make a request to search for videos related to Autodesk
        const searchResponse = await youtube.search.list({
            part: 'snippet',
            q: 'Autodesk',
            type: 'video',
            maxResults: 10
        });

        // Extract video IDs from the search response
        const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

        // Make separate requests to fetch contentDetails and statistics for each video
        const contentDetailsResponse = await youtube.videos.list({
            part: 'contentDetails',
            id: videoIds
        });

        const statisticsResponse = await youtube.videos.list({
            part: 'statistics',
            id: videoIds
        });

        // Combine snippet, contentDetails, and statistics data for each video
        const videos = searchResponse.data.items.map((item, index) => {
            const contentDetailsItem = contentDetailsResponse.data.items[index];
            const statisticsItem = statisticsResponse.data.items[index];

            return {
                title: item.snippet.title,
                length: contentDetailsItem ? convertDuration(contentDetailsItem.contentDetails.duration) : 'N/A',
                views: statisticsItem ? statisticsItem.statistics.viewCount : 'N/A'
            };
        });

        return videos;
    } catch (error) {
        console.error('Error fetching video details:', error.message);
        throw error;
    }
}

// Function to convert duration format from PT1M47S to human-readable format
function convertDuration(duration) {
    // Match the duration format using regular expression
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    // Extract hours, minutes, and seconds from the matched groups
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    // Construct the human-readable duration string
    let durationString = '';
    if (hours > 0) {
        durationString += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
        durationString += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }
    if (seconds > 0) {
        durationString += `${seconds} second${seconds > 1 ? 's' : ''}`;
    }

    return durationString.trim();
}

// Endpoint to fetch videos from YouTube API
app.get('/videos', async (req, res) => {
    try {
        const videos = await fetchVideoDetails();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint for health check
app.get('/health', (req, res) => {
    // Retrieve system information for health check
    const os = process.platform; // Operating system name
    const nodeVersion = process.version; // Node.js version
    const memoryUsage = process.memoryUsage(); // Memory usage of the Node.js process
    const cpuUsage = process.cpuUsage(); // CPU usage of the Node.js process

    // Send the system information as a JSON response
    res.json({
        os,
        nodeVersion,
        memoryUsage,
        cpuUsage
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
