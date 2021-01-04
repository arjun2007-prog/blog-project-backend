const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash")
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const posts = [];
const app = express();

mongoose.connect("mongodb://localhost:27017/blogDB" , { useNewUrlParser : true , useUnifiedTopology : true });

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//creating a schema for our collection present in blogDB
const blogSchema =  {
  blogName:String,
  blogContent:String
}

const BlogData = mongoose.model("BlogData", blogSchema);

app.get("/",(req,res)=>{

  BlogData.find((err,dataFound)=>{
    res.render("home.ejs",{
      homeHeading:homeStartingContent,
      postsDisplay:dataFound,
    });
  })
 
});

app.get("/posts/:blogName",(req,res)=>{
 //here we are using a parameter in the url the user can put any keyword they want
  let blogParameter = lodash.lowerCase(req.params.blogName);
  blogParameter =lodash.capitalize(blogParameter);
  //here we are taking the parameter what the user entered 
  //and that dtring the user entered in is converted to lower case and this also ignores the "-" in the name.
  BlogData.findOne({blogName:blogParameter},(err,dataFound)=>{;
    res.render("postsBlog",{ blogPageTitle : dataFound.blogName , blogPageBody : dataFound.blogContent });
  })

})

app.get("/about",(req,res)=>{
  res.render("about.ejs",{
    contentAbout:aboutContent,
  });
});

app.get("/contact",(req,res)=>{
  res.render("contact.ejs",{
    contentContact:contactContent,
  });
});

app.get("/compose",(req,res)=>{
  res.render("compose.ejs");
});

app.post("/compose",(req,res)=>{
  
  const newBlogName = lodash.capitalize(req.body.newTitle);
  
  let post = new BlogData({
     blogName : newBlogName,
     blogContent : req.body.newBlog,
  });
  post.save(()=>{
    res.redirect("/");
  });
  
  
});

app.post("/postBlog",(req,res)=>{
  if (req.body.postbutton == "goback") {
    res.redirect("/");
  }
  else{
    BlogData.deleteOne({ blogName : req.body.postbutton },(err)=>{
      res.redirect("/");
    });
      
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

