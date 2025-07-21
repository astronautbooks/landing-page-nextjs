const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const slug = event.queryStringParameters?.slug;
  if (!slug) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing slug parameter.' })
    };
  }
  try {
    const filePath = path.join(__dirname, '..', '..', 'public', 'images', slug, 'book.pdf');
    const stats = fs.statSync(filePath);
    return {
      statusCode: 200,
      body: JSON.stringify({ size: stats.size }) // bytes
    };
  } catch (err) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'PDF not found.' })
    };
  }
}; 