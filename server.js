const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Post Schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model('Post', postSchema);

// Routes
app.get('/posts', (req, res) => {
    Post.find({}, (err, posts) => {
        if (!err) {
            res.json({ posts });
        } else {
            res.status(500).json({ error: err.message });
        }
    });
});

app.post('/posts', (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content
    });

    newPost.save()
        .then(() => res.json({ success: true }))
        .catch(err => res.json({ success: false, error: err.message }));
});

app.get('/post/:id', (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (!err) {
            res.render('post', { post });
        } else {
            res.status(500).json({ error: err.message });
        }
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
