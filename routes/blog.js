const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const { handleAddBlog } = require("../controllers/blog");
const Blog = require("../models/blog");
const Comment = require("../models/comments.js");

const route = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

route.get("/add-blog", (req, res) => {
  res.render("addBlog", {
    user: req.user,
  });
});

route.post("/", upload.single("file"), handleAddBlog);

route.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  console.log(blog);
  console.log(comments);

  res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

route.post("/comment/:blogId", async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  console.log(comment);
  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = route;
