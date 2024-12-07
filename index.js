const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "marcoberry2020",
    database: "todo_db",
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database!");
});

// Routes
app.get("/todos", (req, res) => {
    db.query("SELECT * FROM todos", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.post("/todos", (req, res) => {
    const { title, completed } = req.body;
    db.query("INSERT INTO todos (title, completed) VALUES (?, ?)", [title, completed], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, title, completed });
    });
});

app.delete("/todos/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM todos WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Todo deleted successfully!" });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
