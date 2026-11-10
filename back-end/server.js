import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

let tasksTab = [];

app.get("/tasks", (req, res) => {
    res.send(tasksTab);
});

app.post("/tasks", (req, res) => {
    const tab = {};
    tab.name = req.body.name;
    tab.id = req.body.id;
    tab.isChecked = req.body.isChecked;
    console.log(req.body);
    tasksTab.push(tab);
    console.log(req.body.id);
});

app.listen(3008, () => {
    console.log("Le serveur tourne");
    console.log("http://localhost:3008/tasks");
});

app.patch("/tasks/:id", (req, res) => {
    const idRecherche = Number(req.params.id);
    const task = tasksTab.find((t) => t.id === idRecherche);
    if (!task) {
        return res.status(404).json({ error: "Tâche introuvable" });
    }
    task.isChecked = !task.isChecked;
    console.log(tasksTab);
});

app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = tasksTab.findIndex((t) => t.id === id);
    tasksTab.splice(index, 1);
});
