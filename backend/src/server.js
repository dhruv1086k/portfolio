require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`\n  ✓ Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`  ✓ Listening on http://localhost:${PORT}`);
      console.log(`  ✓ API base: http://localhost:${PORT}/api\n`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
