let express        = require("express"),
	bodyParser 	   = require("body-parser"),
	mongoose   	   = require("mongoose"),
	methodOverride = require("method-override"),
	app		       = express();

//App Config	
mongoose.connect(
	"mongodb://localhost:27017/restful_app",
	{ useNewUrlParser: true }
);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
mongoose.set('useFindAndModify',false);

var blogSchema = new mongoose.Schema({
	title : String,
	image : String,
	description : String, 
	created:{
		type: Date, 
		default: Date.now()}
});

var Blog = mongoose.model("Blog",blogSchema);

/*Blog.create({
	title: "Test Blog",
	image : "https://www.paperspecs.com/wp-content/uploads/2015/08/adult-swim-brochure-design4.jpg",
	description: "This is a test. This is a test. This is a test. This is a test.This is a test."
});*/

//Index
app.get("/blog",function(req, res){
	Blog.find({},function(err, blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{blogs:blogs});
		}
	});
});

//New
app.get("/blog/new",function(req, res){
	res.render("new");
});

//Create
app.post("/blog",function(req, res){
	console.log(req.body);
	Blog.create(req.body.blog,function(err, newBlog){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blog");
        }
    });
});

//Show
app.get("/blog/:id",function(req, res){
	Blog.findById(req.params.id,function(err, blog){
		if(err){
			res.redirect("/blog");
		}
		else{
			res.render("show",{blog,blog});
		}
	});
});

//Edit
app.get("/blog/:id/edit",function(req, res){
	Blog.findById(req.params.id,function(err, blog){
		if(err){
			res.redirect("/blog");
		}else{
			res.render("edit",{blog:blog});
		}
	});
});

//Update
app.put("/blog/:id",function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blog");
		}
		else{
			res.redirect("/blog/"+req.params.id);
		}
	});
});

//Delete
app.delete("/blog/:id",function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blog");
		}
		else{
			res.redirect("/blog");
		}
	});
});

app.listen(3000,function(req, res){
	console.log("Server Connected!");
});