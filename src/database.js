const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

  mongoose.connection.on('connected', () => {
    console.log(`Mongo DB connection open to ${process.env.MONGO_DB_URL}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection failed: ${err}`);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.error('Mongo DB server shutdown the connection');
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.info('Closing Mongo DB connection because of application termination');
      process.exit(0);
    });
  });
}