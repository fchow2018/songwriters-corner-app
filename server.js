var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");

// Require Lyrics Post model
var db = require('./models'),
Post = db.Post;

// Configure app
app.use(express.static(__dirname + "/public"));         // Static directory
app.use(bodyParser.urlencoded({ extended: true })); // req.body

app.use(methodOverride('_method'));

// Set CORS Headers
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// HOMEPAGE ROUTE

app.get("/", function (req, res) {
  Post.find(function (err, allPosts) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      res.render("home", { posts: allPosts, user: req.user, });
    }
  });
});

app.get("/dashboard", function (req, res) {
  res.redirect("dashboard");
})

app.get("/edit_profile", function (req, res) {
  res.redirect("edit_profile");
})
// AUTH ROUTES
app.get("/signup", function (req, res) {
  res.render("signup");
});

// sign up new user, then log them in
// hashes and salts password, saves new user to db
app.post("/signup", function (req, res) {
  User.register(new User({ username: req.body.username, }), req.body.password,
      function () {
        passport.authenticate("local")(req, res, function() {
          res.redirect("/");
        });
      }
  );
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", passport.authenticate("local"), function (req, res) {
  console.log(req.user);
  // res.send("logged in!!!"); // sanity check
  res.redirect("/"); // preferred!
});

app.get("/logout", function (req, res) {
  console.log("BEFORE logout", JSON.stringify(req.user));
  req.logout();
  console.log("AFTER logout", JSON.stringify(req.user));
  res.redirect("/");
});

// SHOW PAGE ROUTE

app.get("/posts/:id", function(req, res) {
  Post.findById(req.params.id).populate("user").exec(function (err, foundPost) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      res.render("posts/show", { post: foundPost, });
    }
  });
});

app.post("/posts", function(req, res) {
  if (!req.user) {
    res.redirect("/");
  } else {
    var newPost = new Post(req.body);
    newPost.user = req.user._id;

    // save new post in db
    newPost.save(function (err) {
      if (err) {
        res.status(500).json({ error: err.message, });
      } else {
        res.redirect("/");
      }
    });
  }
});

// update post
app.put("/posts/:id", function (req, res) {
  // get post id from url params (`req.params`)
  var postId = req.params.id;

  // find post in db by id
  Post.findOne({ _id: postId, }, function (err, foundPost) {
    console.log("found post is", foundPost);
    console.log(`found post user is ${foundPost.user} with type ${typeof foundPost.user}.`);
    console.log(`req user id is ${req.user._id} with type ${typeof req.user._id}.`);
    if (err) {
      res.status(500).json({ error: err.message, });
    } else if (foundPost.user && (foundPost.user.toString() != req.user._id.toString())) {
      console.log("not saving");
      res.redirect("/");
      return;
    } else {
      console.log("saving");
      // update the posts's attributes
      foundPost.title = req.body.title || foundPost.title;
      foundPost.description = req.body.description || foundPost.description;

      // save updated post in db
      foundPost.save(function (err, savedPost) {
        if (err) {
          res.status(500).json({ error: err.message, });
        } else {
          res.redirect("/posts/" + savedPost._id);
        }
      });
    }
  });
});


// delete post
app.delete("/posts/:id", function (req, res) {
  // get post id from url params (`req.params`)
  var postId = req.params.id;

  // find post in db by id and remove
  if(!req.user) {
    res.redirect("/");
    return;
  }
  Post.findOneAndRemove({ _id: postId, user: req.user._id, }, function () {
    res.redirect("/");
  });
});


// API ROUTES

// get all posts
app.get("/api/posts", function (req, res) {
  // find all posts in db
  Post.find(function (err, allPosts) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      res.json({ posts: allPosts, });
    }
  });
});

// create new post
app.post("/api/posts", function (req, res) {
  // create new post with form data (`req.body`)
  var newPost = new Post(req.body);

  // save new post in db
  newPost.save(function (err, savedPost) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      res.json(savedPost);
    }
  });
});

// get one post
app.get("/api/posts/:id", function (req, res) {
  // get post id from url params (`req.params`)
  var postId = req.params.id;

  // find post in db by id
  Post.findOne({ _id: postId, }, function (err, foundPost) {
    if (err) {
      if (err.name === "CastError") {
        res.status(404).json({ error: "Nothing found by this ID.", });
      } else {
        res.status(500).json({ error: err.message, });
      }
    } else {
      res.json(foundPost);
    }
  });
});

// update post
app.put("/api/posts/:id", function (req, res) {
  // get post id from url params (`req.params`)
  var postId = req.params.id;

  // find post in db by id
  Post.findOne({ _id: postId, }, function (err, foundPost) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      // update the posts's attributes
      foundPost.title = req.body.title;
      foundPost.description = req.body.description;

      // save updated post in db
      foundPost.save(function (err, savedPost) {
        if (err) {
          res.status(500).json({ error: err.message, });
        } else {
          res.json(savedPost);
        }
      });
    }
  });
});

// delete post
app.delete("/api/posts/:id", function (req, res) {
  // get post id from url params (`req.params`)
  var postId = req.params.id;

  // find post in db by id and remove
  Post.findOneAndRemove({ _id: postId, }, function (err, deletedPost) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      res.json(deletedPost);
    }
  });
});

//basic root route
// app.get("/", function (req, res) {
//         res.render("home");
// });

app.get('/dashboard',function(req,res){
  res.render('dashboard');
});

app.get('/add_lyrics',function(req,res){
  res.render('add_lyrics');
});

app.get('/edit_profile',function(req,res){
  res.render('edit_profile');
});

app.get('/rated_lyrics',function(req,res){
  res.render('rated_lyrics');
});

app.get('/my_lyrics',function(req,res){
  res.render('my_lyrics');
});


app.set('view engine', 'ejs');

app.listen(process.env.PORT || 3000,function(){
  console.log('server running');
});
