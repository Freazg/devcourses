const express = require("express");

const app  = express();
const PORT = 3000;

app.use(express.json());

// In-memory "база даних" студентів
let students = [
  { id: 1, name: "Іваненко Олексій",  group: "ІС-31" },
  { id: 2, name: "Петренко Марія",    group: "ІС-31" },
  { id: 3, name: "Коваленко Дмитро",  group: "ІС-32" },
];

// ----------------------------------------
// GET /  — перевірка сервера
// ----------------------------------------
app.get("/", (req, res) => {
  res.send("Hello from Node.js server");
});

// ----------------------------------------
// GET /students — список студентів
// ----------------------------------------
app.get("/students", (req, res) => {
  res.json(students);
});

// ----------------------------------------
// POST /students — додати студента
// ----------------------------------------
app.post("/students", (req, res) => {
  const { name, group } = req.body;

  if (!name || !group) {
    return res.status(400).json({ error: "Поля name та group є обов'язковими" });
  }

  const newStudent = {
    id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
    name,
    group,
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// ----------------------------------------
// PUT /students/:id — оновити студента
// ----------------------------------------
app.put("/students/:id", (req, res) => {
  const id      = parseInt(req.params.id);
  const index   = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Студента з id=${id} не знайдено` });
  }

  const { name, group } = req.body;
  if (name)  students[index].name  = name;
  if (group) students[index].group = group;

  res.json(students[index]);
});

// ----------------------------------------
// DELETE /students/:id — видалити студента
// ----------------------------------------
app.delete("/students/:id", (req, res) => {
  const id    = parseInt(req.params.id);
  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Студента з id=${id} не знайдено` });
  }

  const removed = students.splice(index, 1)[0];
  res.json({ message: "Студента видалено", student: removed });
});

// ----------------------------------------
// Запуск сервера
// ----------------------------------------
app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});
