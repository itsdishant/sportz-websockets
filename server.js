import express from 'express';

const app = express();

// ponytail: native express json middleware, no config
app.use(express.json());

app.get('/', (req, res) => res.send('sportz-backend running'));

app.listen(8000, () => console.log('http://localhost:8000'));
