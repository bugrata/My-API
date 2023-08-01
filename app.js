//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

/////////////////////////////Request All Articles/////////////////////////////

app.route("/articles")

.get(function(req, res){
    Article.find().then(function(foundArticles){
        res.send(foundArticles);
    })
    .catch(function(err){
        console.log(err);
    });
})

.post((req, res) => {
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save().then(()=>{
        console.log("new document created successfully !");
        res.send(newArticle);
    }).catch(err => {
        console.log(err);
    });
})

.delete(function(req,res){
    Article.deleteMany({}).then(() => {
      res.send("Done 👍")
      })
      .catch(function (err)  {
        res.send(err);
      });
  });

/////////////////////////////Request A Specific Articles/////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}).then(function(foundArticle){
        res.send(foundArticle);
    }).catch(function(err){
        console.log(err);
    })
})

.put(function (req, res) {
    Article.findOneAndUpdate(
        {
          title: req.params.articleTitle,
        },
        { title: req.body.title, content: req.body.content },
        { overwrite: true }
      )
      .then((updatedArticle) => {
        if (updatedArticle) {
          console.log("Document updated successfully!");
        } else {
          console.log("Can't update!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  })

  .patch(async (req, res) => {
    try {
      await Article.updateOne(
        { title: req.params.articleTitle },
        { $set: req.body },
      );
      res.send("Successfully updated article.")
    } catch (error) {
      res.send(error);
    }
  })

  .delete(async (req, res) => {
    try {
      await Article.deleteOne({ title: req.params.articleTitle});
      res.send("Successfully deleted article.")
    } catch (error) {
      res.send(error);
    }
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});