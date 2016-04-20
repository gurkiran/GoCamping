var express              = require('express'),
    app                  = express(),
    bodyParser           = require('body-parser'),
    flash                = require('connect-flash'),
    mongoose             = require('mongoose'),
    passport             = require('passport'),
    LocalStrategy        = require('passport-local'),
    Campground           = require('./models/campground'),
    Comment              = require('./models/comment'),
    User                 = require('./models/user'),
    seed                 = require('./seed'),
    methodOverride       = require('method-override');


//seed();

// requiring routes

var commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes      = require('./routes/index');




mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

app.use(require('express-session')({
    secret: 'God is love',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);



// For online editor like c9

// app.listen(process.env.PORT, process.env.IP,function(){
//    console.log('Server started !');
// });

// For local machine 
app.listen(3000,function(){
   console.log('Server started !');
});
