import express from "express";
import { quotes } from "./db";
import cors from "cors";
import { Quote } from "./db";
import Database from "better-sqlite3";

const app = express();
const PORT = 4000;

const db = new Database("./data.db", {
  verbose: console.log,
});

app.use(cors({ origin: "*" }));
app.get("/", (req, res) => {
  res.send(`
    <h1 style="color: red;">Welcome to our quotes API!</h1>
    <p>Here are some endpoints you can use:</p>
    <ul>
      <li><a href="/quotes">{quotes}</a></li>
      <li><a href="/randomQuote">/randomQuote</a></li>
    </ul>
   `);
});

app.get(`/quotes`, (req, res) => {
  res.send(`/quotes`);
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

app.post("/quotes", (req, res) => {
  // const { quote, firstName, lastName, age, image } = req.body;
  const firstName = req.body.firstName;

  const lastName = req.body.lastName;
  const image = req.body.image;
  const quote = req.body.quote;

  const age = req.body.age;

  const errors = [];

  if (typeof firstName !== "string") {
    errors.push("Name missing or not a string");
  }
  if (typeof lastName !== "string") {
    errors.push("lastname missing or not a string");
  }

  if (typeof image !== "string") {
    errors.push("image missing or not a string");
  }
  if (typeof quote !== "string") {
    errors.push("quote missing or not a string");
  }
  if (typeof age !== "number" && age < 0) {
    errors.push("Age must be a number and bigger than 0!");
  }

  if (errors.length === 0) {
    const newQuote: Quote = {
      id: Math.random(),
      quote: quote,
      firstName: firstName,
      lastName: lastName,
      age: age,
      image: image,
    };
    quotes.push(newQuote);
    res.status(201).send(newQuote);
  } else {
    res.status(400).send({ errors: errors });
  }
});

app.delete("/quotes/:id", (req, res) => {
  const id = Number(req.params.id);

  const match = quotes.find((quote) => quote.id === id);
  if (match) {
    const quoted = quotes.filter((quote) => quote.id !== id);
    res.send("Quote deleted");
  } else {
    res.status(404).send({ error: "Quote not found" });
  }
});

app.patch("/quotes/:id", (req, res) => {
  const id = Number(req.params.id);
  const quoteToUpdate = quotes.find((quote) => quote.id === id);

  if (quoteToUpdate) {
    if (typeof req.body.quote === "string")
      quoteToUpdate.quote = req.body.quote;
    if (typeof req.body.firstName === "string")
      quoteToUpdate.firstName = req.body.firstName;
    if (typeof req.body.lastName === "string")
      quoteToUpdate.lastName = req.body.lastName;
    if (typeof req.body.age === "number") quoteToUpdate.age = req.body.age;
    if (typeof req.body.image === "string")
      quoteToUpdate.image = req.body.image;
    res.send(quoteToUpdate);
  } else {
    res.status(404).send({ error: "Quote not found." });
  }
});

app.listen(PORT, () => {
  console.log(`Server up on:http://localhost:${PORT} 
  `);
});

const deleteTable = db.prepare(`
DELETE FROM quotes;
`);
deleteTable.run();

const createTableOfQuotes = db.prepare(`
CREATE TABLE IF NOT EXISTS quotes (
  id INTEGER,
quote TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  age INTEGER NOT NULL,
  image TEXT NOT NULL,
  PRIMARY KEY (id)
);
`);
createTableOfQuotes.run();

const createQuoteValues = db.prepare(`
INSERT INTO quotes (quote, firstName, lastName, age, image ) VALUES (?, ?, ? ,? ,? );
`);
for (const quote of quotes) {
  createQuoteValues.run(
    quote.quote,
    quote.firstName,
    quote.lastName,
    quote.age,
    quote.image
  );
}

const getAllQuotes = db.prepare(`
SELECT * FROM quotes;
`);
