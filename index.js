const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    console.log(files);
    res.render("index", { files: files });
  });
});
app.post("/create", (req, res) => {
  console.log(req.body);
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("_")}.txt`,
    req.body.details,
    (err) => {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        res.redirect("/");
      }
    }
  );
});

app.get("/task/:file", (req, res) => {
  fs.readFile(`./files/${req.params.file}`, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("tasks", { file: req.params.file, data: data });
    }
  });
});

app.get("/edit/:file", (req, res) => {
  fs.readFile(`./files/${req.params.file}`, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("edit", { file: req.params.file, data: data });
    }
  });
});
app.get("/edit/filename/:file", (req, res) => {
  res.render("editFilename", { file: req.params.file });
});

app.post("/edit/filename", (req, res) => {
  console.log(req.body);
  // change file data
  fs.writeFile(`./files/${req.body.filename}`, req.body.updatedData, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      // rename the file
      if (!req.body.newName) {
        res.redirect("/task/" + req.body.filename);
        return;
      }
      fs.rename(
        `./files/${req.body.filename}`,
        `./files/${req.body.newName}`,
        (err) => {
          if (err) {
            console.log(err);
            res.redirect("/");
          } else {
            // redirect to the task page with the new name
            res.redirect("/task/" + req.body.newName);
          }
        }
      );
    }
  });
});

app.get("/delete/:file", (req, res) => {
  fs.unlink(`./files/${req.params.file}`, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
