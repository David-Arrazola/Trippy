import app from "./app.js";
import connectDB from "./db/connect.js";

const PORT = process.env.PORT ?? 3000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
