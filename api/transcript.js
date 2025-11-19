const { YoutubeTranscript } = require('youtube-transcript');

// Vercel serverless function
module.exports = async (req, res) => {
  try {
    const videoUrl = req.query.videoUrl || req.query.url || '';

    if (!videoUrl) {
      return res.status(400).json({ error: 'Missing "videoUrl" query parameter.' });
    }

    // Extract video ID from common YouTube URL formats
    const idMatch = videoUrl.match(/[?&]v=([^&]+)/) || videoUrl.match(/youtu\.be\/([^?]+)/);
    const videoId = idMatch ? idMatch[1] : videoUrl;

    if (!videoId) {
      return res.status(400).json({ error: 'Could not parse video ID.' });
    }

    // Fetch transcript array: [{ text, duration, offset }, ...]
    const segments = await YoutubeTranscript.fetchTranscript(videoId);

    // Join all text segments into one big string
    const fullText = segments
      .map(s => s.text)
      .filter(Boolean)
      .join(' ');

    return res.status(200).json({
      videoId,
      segments,
      transcript: fullText
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Failed to fetch transcript.' });
  }
};
