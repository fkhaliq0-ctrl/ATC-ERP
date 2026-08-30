const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React build (dist is in same directory)
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
