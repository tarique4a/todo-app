const express = require("express");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.static("public"));
// use to extract from the form....
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//get method
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
  });
});

// post method
app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});
// update
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdits.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);

      res.redirect("/");
    });
  });
// Delete
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
mongoose.connect(process.env.DB_CONNECT).then(() => {
  console.log("db connected");
  app.listen(3000, () => console.log("server is running"));
});
