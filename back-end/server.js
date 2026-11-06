import express from "express";
const app = express();
app.use(express.json());

let tasksTab = [];

app.get("/tasks", (req, res) => {
    res.send(tasksTab);
});

app.post("/tasks", (req, res) => {
    const data = req.body;
    tasksTab.push(data);
});
