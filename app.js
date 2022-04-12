/* eslint-disable no-console */
const express = require('express');
const path = require('path');

const PORT = 3000;

const app = express();
app.use('/', express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Сервер запущен на порту: ${PORT}`);
});
