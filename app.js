const express = require('express');
const path = require('path');

const app = express();

// Set the correct MIME type for CSS files
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});