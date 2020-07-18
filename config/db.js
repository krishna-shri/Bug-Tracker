const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'MongoDB DataBase URL',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );

    console.log('MongoDB Connected');
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

module.exports = connectDB;
