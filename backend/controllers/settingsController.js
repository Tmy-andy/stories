const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting settings',
      error: error.message
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const {
      siteTitle,
      tagline,
      siteDescription,
      contactEmail,
      bannerTitle,
      bannerSubtitle,
      bannerButtonText,
      maintenanceMode,
      requireEmailVerification,
      maxStoriesPerUser,
      maxChaptersPerStory,
      enableComments,
      enableFavorites,
      enableReadingHistory
    } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    // Update fields if provided
    if (siteTitle !== undefined) settings.siteTitle = siteTitle;
    if (tagline !== undefined) settings.tagline = tagline;
    if (siteDescription !== undefined) settings.siteDescription = siteDescription;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (bannerTitle !== undefined) settings.bannerTitle = bannerTitle;
    if (bannerSubtitle !== undefined) settings.bannerSubtitle = bannerSubtitle;
    if (bannerButtonText !== undefined) settings.bannerButtonText = bannerButtonText;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (requireEmailVerification !== undefined) settings.requireEmailVerification = requireEmailVerification;
    if (maxStoriesPerUser !== undefined) settings.maxStoriesPerUser = maxStoriesPerUser;
    if (maxChaptersPerStory !== undefined) settings.maxChaptersPerStory = maxChaptersPerStory;
    if (enableComments !== undefined) settings.enableComments = enableComments;
    if (enableFavorites !== undefined) settings.enableFavorites = enableFavorites;
    if (enableReadingHistory !== undefined) settings.enableReadingHistory = enableReadingHistory;

    settings.updatedAt = new Date();

    await settings.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

exports.uploadBannerImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    // Store the image filename or path
    settings.bannerImage = `/uploads/banner/${req.file.filename}`;
    await settings.save();

    res.json({
      success: true,
      message: 'Banner image uploaded successfully',
      bannerImage: settings.bannerImage
    });
  } catch (error) {
    console.error('Error uploading banner image:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading banner image',
      error: error.message
    });
  }
};
