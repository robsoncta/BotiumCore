const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Botium Core está rodando no Render');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});