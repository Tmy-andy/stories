const mongoose = require('mongoose');
require('dotenv').config();
const Story = require('./models/Story');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const story = await Story.findOne().select('title slug _id');
    console.log('Story:', story);
    process.exit(0);
  })
  .catch(err => {
    console.log('Error:', err.message);
    process.exit(1);
  });
