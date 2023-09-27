const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('¡Hola Mundo desde Express!');
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
