import "dotenv/config";

import app from "./app.js";


const PORT = process.env.PORT || 5000;

// ✅ Only run server locally
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
