/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require("express"); // import the express framework
const morgan = require("morgan"); // import the morgan request logger
const session = require ('express-session') // import the express-session package
const MongoStore = require ('connect-mongo') // import the connect-mongo package(for sessions)
require('dotenv').config()
const methodOverride = require('method-override')

///////////////////////////////////
//// Middleware Function         ////
/////////////////////////////////////

const middleware = (app) => {

  app.use(methodOverride('_method'))
  app.use(morgan("tiny")); 
  app.use(express.urlencoded({ extended: true })); 
  app.use(express.static("public")); // this serves static files from the 'public' folder
  app.use(express.json()); // parses incoming request payloads with JSON
  
    app.use(
      session({
          secret: process.env.SECRET,
          store: MongoStore.create({
              mongoUrl: process.env.DATABASE_URL 
          }),
          saveUninitialized: true,
          resave: false
      })
  )
};

/////////////////////////////////////
//// Export Middleware Function  ////
/////////////////////////////////////
module.exports = middleware;
