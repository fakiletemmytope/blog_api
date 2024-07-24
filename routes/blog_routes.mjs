import express from "express";
import { verifyUserToken } from "../midddlewares/customMiddlewares.mjs";
import ArticleModel from "../schemas/blog.mjs";
import { blogPostValidation } from "../midddlewares/customMiddlewares.mjs";
import { reading_time, timestamp} from "../functions/word_count.mjs";


const blogRouter = express.Router();

//get all blog post(any user)
blogRouter.get("/blogs/", async (req, res) => {
  const results = await ArticleModel.find();
  if (results) {
    const list = [];
    results.map((result) => {
      const value = {
        title: result.title,
        body: result.body,
        author: result.author,
      };
      list.push(value);
    });
    res.status(200).json({ data: list });
  } else {
    res.status(200).json({ message: "no blog post found" });
  }
});

//get all blogs of a particular user
blogRouter.get("/myblogs/", verifyUserToken, async (req, res) => {
  const query = {
    author_id: req.user.id,
  };
  const results = await ArticleModel.find(query);
  //console.log(results)
  let blogs = [];
  if (results.length >= 1) {
    if (results.length === 1) {
      const blog = {
        id: results.id,
        title: results.title,
        body: results.body,
        author: results.author,
        tags: results.tags
      };
      blogs.push(results[0]);
    } else {
      results.map((result) => {
        const blog = {
          id: result.id,
          title: result.title,
          body: result.body,
          author: result.author,
          tags: result.tags
        };
        blogs.push(blog);
      });
    }
    res.status(200).json({ data: blogs });
  } else {
    res.status(200).json({
      data: blogs,
    });
  }
});

blogRouter.post(
  "/blog/",
  blogPostValidation,
  verifyUserToken,
  async (req, res) => {
    const currentDate = new Date();
    const created_at = currentDate.toDateString();
    const updated_at = created_at;
    const read_count = 0;
    const { title, description, body, tags } = req.body;
    const read_time = await reading_time(body);
    const tag_array = []
    if(tags){
      const tags_values  = tags.split(",").trim()
      tags_values.map((value) =>{
          console.log(value)
          tag_array.push(value)
      })
    }
    
    let blog_post = {
      title: title,
      description: description,
      author: req.user.username,
      author_id: req.user.id,
      state: "draft",
      read_count: read_count,
      reading_time: `${read_time}min`,
      body: body,
      tags: tag_array,
      created_at: created_at,
      updated_at: updated_at,
    };

    const article = new ArticleModel(blog_post);
    try {
      const result = await article.save();
      //console.log(result);
      if (result) {
        res.status(200).json({
          message: "Article created",
          id: result._id,
        });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

blogRouter.put("/blog/:id", verifyUserToken, async (req, res) => {
  const { body, title, state, description } = req.body;
  const query = { _id: req.params.id };
  const article = await ArticleModel.findById(query);
  //console.log(article);
  if (article) {
    if (title) {
      article.title = title;
    }
    if (body) {
      const read_time = await reading_time(body);
      article.body = body;
      article.reading_time = `${read_time}min`;
    }
    if (description) {
      article.description = description;
    }
    if (state) {
      article.state = state;
    }

    article.updated_at(timestamp());
    article.save().then((result) => {
      res.status(200).json({ message: result });
    });
  } else {
    res.send("no update");
  }
});

blogRouter.delete("/blog/:id", verifyUserToken, async (req, res) =>{
    const article = await ArticleModel.findByIdAndDelete({_id: req.params.id})
    if(article){
      res.status(210).json({message: "Article Deleted"})
    }else{
      res.json({message: "Article does not exist"})
    }
})

export default blogRouter;
