import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title: String,
    description: String,
    author: String,
    author_id: String,
    state: String,
    read_count: Number,
    reading_time: String,
    body: String,
    tags: {
        type:[], default: undefined
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }    
         //   date: { type: Date, default: Date.now },
  });
  
  const ArticleModel = mongoose.model("articles", articleSchema);
  export default ArticleModel;