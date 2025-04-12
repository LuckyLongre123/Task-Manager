const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const FILES_DIR = path.join(__dirname, "files");
if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR);
}

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.readdir(FILES_DIR, (err, files) => {
    if (err) {
      console.log(err);
      return res.render("index", { files: [] });
    }
    res.render("index", { files });
  });
});

app.post("/create", (req, res) => {
  const title = req.body.title.trim().replace(/\s+/g, "_");
  const fileName = `${title}.txt`;
  const filePath = path.join(FILES_DIR, fileName);

  fs.writeFile(filePath, req.body.details, (err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

app.get("/task/:file", (req, res) => {
  const filePath = path.join(FILES_DIR, req.params.file);
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }
    res.render("tasks", { file: req.params.file, data });
  });
});

app.get("/edit/:file", (req, res) => {
  const filePath = path.join(FILES_DIR, req.params.file);
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }
    res.render("edit", { file: req.params.file, data });
  });
});

app.get("/edit/filename/:file", (req, res) => {
  res.render("editFilename", { file: req.params.file });
});

app.post("/edit/filename", (req, res) => {
  const oldPath = path.join(FILES_DIR, req.body.filename);
  const newFileName = req.body.newName?.trim() || req.body.filename;
  const newPath = path.join(FILES_DIR, newFileName);
  const updatedData = req.body.updatedData;

  fs.writeFile(oldPath, updatedData, (err) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }

    if (req.body.newName && req.body.newName !== req.body.filename) {
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.log(err);
          return res.redirect("/");
        }
        res.redirect(`/task/${newFileName}`);
      });
    } else {
      res.redirect(`/task/${req.body.filename}`);
    }
  });
});

app.get("/delete/:file", (req, res) => {
  const filePath = path.join(FILES_DIR, req.params.file);
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
