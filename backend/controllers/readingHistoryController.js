const ReadingHistory = require('../models/ReadingHistory');

// Save or update reading position
exports.saveReadingPosition = async (req, res) => {
  try {
    const { storyId, chapterNumber, scrollPosition } = req.body;
    const userId = req.user.id;

    console.log('saveReadingPosition:', { userId, storyId, chapterNumber, scrollPosition });

    if (!storyId || !chapterNumber) {
      return res.status(400).json({ message: 'storyId and chapterNumber are required' });
    }

    // Find and update or create
    let readingHistory = await ReadingHistory.findOneAndUpdate(
      { userId, storyId },
      {
        userId,
        storyId,
        chapterNumber,
        scrollPosition: scrollPosition || 0,
        readAt: new Date(),
      },
      { upsert: true, new: true }
    );

    console.log('saveReadingPosition - saved:', readingHistory);

    // Clean up old records - keep only 5 most recent stories
    const userReadingHistory = await ReadingHistory.find({ userId })
      .sort({ updatedAt: -1 });

    console.log('saveReadingPosition - total records after save:', userReadingHistory.length);

    // If more than 5 records, delete the oldest ones
    if (userReadingHistory.length > 5) {
      const recordsToKeep = userReadingHistory.slice(0, 5).map(rh => rh._id);
      await ReadingHistory.deleteMany({
        userId,
        _id: { $nin: recordsToKeep },
      });
      console.log('saveReadingPosition - cleaned up old records');
    }

    res.json({ message: 'Reading position saved', readingHistory });
  } catch (error) {
    console.error('Error saving reading position:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get reading history for current user (5 most recent)
exports.getReadingHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await ReadingHistory.find({ userId })
      .populate('storyId', 'title coverImage author')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json(history);
  } catch (error) {
    console.error('Error fetching reading history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all reading history (for displaying full history)
exports.getAllReadingHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('getAllReadingHistory - userId:', userId);

    let history = await ReadingHistory.find({ userId })
      .populate('storyId', 'title coverImage author')
      .sort({ updatedAt: -1 });

    // Populate chapter titles
    const Chapter = require('../models/Chapter');
    history = await Promise.all(
      history.map(async (item) => {
        const chapter = await Chapter.findOne({
          storyId: item.storyId._id,
          chapterNumber: item.chapterNumber,
        });
        return {
          ...item.toObject(),
          chapterTitle: chapter?.title || `Chương ${item.chapterNumber}`,
        };
      })
    );

    console.log('getAllReadingHistory - found records:', history.length);
    res.json(history);
  } catch (error) {
    console.error('Error fetching all reading history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get reading position for a specific story
exports.getReadingPosition = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    const reading = await ReadingHistory.findOne({ userId, storyId });

    if (!reading) {
      return res.json({
        chapterNumber: 1,
        scrollPosition: 0,
      });
    }

    res.json(reading);
  } catch (error) {
    console.error('Error fetching reading position:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete reading history for a story
exports.deleteReadingHistory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    await ReadingHistory.findOneAndDelete({ userId, storyId });

    res.json({ message: 'Reading history deleted' });
  } catch (error) {
    console.error('Error deleting reading history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear all reading history
exports.clearAllReadingHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    await ReadingHistory.deleteMany({ userId });

    res.json({ message: 'All reading history cleared' });
  } catch (error) {
    console.error('Error clearing reading history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
