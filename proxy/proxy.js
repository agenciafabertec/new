import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

app.get('/api/search', async (req, res) => {
  const { cpf } = req.query;

  if (!cpf) {
    return res.status(400).json({ error: 'CPF não informado' });
  }

  try {
    const response = await fetch(`http://185.101.104.231:3001/search?cpf=${cpf}`);
    const text = await response.text(); // ⚠️ <- aqui o formato correto da resposta!

    // A API retorna uma string no formato: "CPF|NOME|SEXO|DATA%"
    const [cpfRetorno, nome, sexo, nascimento] = text.replace("%", "").split("|");

    return res.json({
      cpf: cpfRetorno,
      nome,
      sexo,
      nascimento,
    });
  } catch (err) {
    console.error("Erro no fetch da API externa:", err);
    return res.status(500).json({ error: 'Erro ao buscar dados na API externa' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy rodando em http://localhost:${PORT}`);
});
