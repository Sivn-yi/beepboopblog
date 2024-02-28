import express from "express";
import bodyParser from "body-parser";
import { Template } from "ejs";

const app = express();
const port = 3000;
var postList = [];
var currentPost = [];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Create new post

function postCreate(req,res) {
    var postBody = req.body.blogBody;
    postBody = postBody.replace(/\r\n/g, '<br>');
    const postTitle = req.body.blogTitle;
    const postPreview = req.body.blogPreview;
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth() + 1; // Month is zero-based, so add 1
    const day = currentTime.getDate();
    const postTime = `${year}-${month}-${day}`;
    const postEdit = postTime;
    currentPost = [postTitle, postBody, postPreview, postTime, postEdit];
    postList.push(currentPost);
    console.log(currentPost);
    console.log(postList);
  }

// Delete post

function postDelete(req,res) {
    var title = req.params.title;
    var index = postList.findIndex(post => post[0] === title);
    postList.splice(index, 1);
    console.log(postList);  
}

// Edit post

function postEdit(req,res) {
    currentPost[0] = req.body.blogTitle;
    var postBody = req.body.blogBody;
    postBody = postBody.replace(/\r\n/g, '<br>');
    currentPost[1] = postBody;
    currentPost[2] = req.body.blogPreview;
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth() + 1; // Month is zero-based, so add 1
    const day = currentTime.getDate();
    const postEdit = `${year}-${month}-${day}`;
    currentPost[4] = postEdit;
    console.log(currentPost);
    const index = postList.findIndex(post => post[0] === currentPost[0]);
    console.log(index);
    postList[index] = currentPost;
    console.log(postList);  
}

app.get("/", (req, res) => {
  res.render("index.ejs", {postList: postList});
});

app.get("/globs", (req, res) => {
    res.render("post.ejs");
  });

app.post("/submit", (req, res) => {
    postCreate(req,res);
    res.redirect('globs/' + encodeURIComponent(currentPost[0]));
    });

app.post("/edit/:title", (req, res) => {
    currentPost[0] = req.params.title;
    var postBodyForEditing = currentPost[1].replace(/<br>/g, '\n');
    res.render("edit.ejs", {
        originalTitle: currentPost[0],
        originalBody: postBodyForEditing,
        originalPreview: currentPost[2]});
    });

app.post("/edit", (req, res) => {
    postEdit(req,res);
    res.redirect('globs/' + encodeURIComponent(currentPost[0]));
    });

app.post("/delete/:title", (req, res) => {
    postDelete(req,res);
    res.render("index.ejs", {postList: postList});
    });

app.get("/globs/:title", (req, res) => {
    currentPost = postList.find(currentPost => currentPost[0] === req.params.title);
    if (!currentPost) {
        res.status(404).send('Post not found');
        return;
    }
    res.render("template.ejs", {currentPost: currentPost });
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });