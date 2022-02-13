import express, { request, response } from "express";
import { quotes } from "./db";
const app = express();
const PORT = 4000;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.get("/", (req, res) => {
  res.send(`
    <h1 style="color: red;">Welcome to our quotes API!</h1>
    <p>Here are some endpoints you can use:</p>
    <ul>
      <li><a href="/quotes">/quotes</a></li>
      <li><a href="/randomQuote">/randomQuote</a></li>
    </ul>
   `);
});

app.get(`/quotes`, (request, response) => {
  response.send(`/quotes`);
});
console.log(quotes);

app.get("/randomQuote", (req, res) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  res.send(quote);
});

app.get("/quotes/:id", (req, res) => {
  const id = Number(req.params.id);
  const match = quotes.find((quote: { id: number }) => quote.id === id);
  if (match) {
    res.send(match);
  } else {
    res.status(404).send({ error: "Quote not found." });
  }
});

app.listen(PORT, () => {
  console.log(`Server up on:http://localhost3000:${PORT} `);
});
function cors(arg0: { origin: string }): any {
  throw new Error("Function not implemented.");
}
