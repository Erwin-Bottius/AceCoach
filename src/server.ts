import app from './app';
const port = process.env.PORT || 3000;
import { config } from 'dotenv'
import helloRoutes from './routes/helloRoutes';
import {connectToDB, disconnectFromDB} from './config/db';
config()
connectToDB()

app.use("test", helloRoutes)


const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error("Uncaught exception:", err);
  server.close(async () => {
    await disconnectFromDB();
    process.exit(1);
  });
});

// handle unhandled promise exception
process.on('unhandledRejection', async (err) => {
  console.error("Uncaught exception:", err);
    await disconnectFromDB();
    process.exit(1);
});




// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
server.close(async () => {
    await disconnectFromDB();
    console.log('Closed out remaining connections');
    process.exit(0);
  }) });