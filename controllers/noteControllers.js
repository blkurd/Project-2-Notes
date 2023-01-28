/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Note = require('../models/notes')

/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

//////////////////////////////
//// Routes               ////
//////////////////////////////
// Subdocuments are not mongoose models. That means they don't have their own collection, 
// and they don't come with the same model methods that we're used 
// to(they have some their own built in.)
// This also means, that a subdoc is never going to be viewed without 
// it's parent document. We'll never see a comment without seeing the 
// note it was commented on first.
// This also means, that when we make a subdocument, we must MUST refer 
// to the parent so that mongoose knows where in mongodb to store this subdocument

// we're going to build a seed route
// this will seed the database for us with a few starter resources
// There are two ways we will talk about seeding the database
// Note -> seed route, they work but they are not best practices
// Second -> seed script, they work and they ARE best practices

router.get("/seed", (req, res) => {
    // array of starter resources(Notes)
    const startNotes = [
      { owner: "" , title: "", text: "", color: "yellow" },
      { owner: "" , title: "", text: "", color: "purple" },
    ];
    // These two lines is to check if the schema is working on the 'localhost//notes/seed' or not
    // console.log('the starter notes', startNotes)
    // res.json({startNotes: startNotes})
  
    // then we delete every note in the database(all instances of this resource)
    //  We deletemany first so that we can go to this seed page multiple times without
    //  creating the same page over and over again.
    Note.deleteMany({}).then(() => {
      // then we'll seed(create) our starter notes
      Note.create(startNotes)
        // tell our db what to do with success and failures
        .then((data) => {
          res.json(data);
        })
        .catch((err) => console.log("The following error occurred: \n", err));
    });
  });
  
  // index route
  // Read-> finds and displays all notes
  router.get("/", (req, res) => {
    // find all the notes
    Note.find({})
      // send json if successful
      .then((notes) => {
        res.json({ notes: notes });
      })
      // catch errors if they occur
      .catch((err) => console.log("The following error occurred: \n", err));
  });
  
  
  // PUT route
  // Update -> updates a specific note
  // PUT replaces the entire document with a new document from the req.body
  // PATCH is able to update specific fields at specific times, but it requires a little more code to ensure that it works properly, so we'll use that later
  router.put('/:id', (req, res) => {
      // save the id to a variable for easy use later
      const id = req.params.id
      // save the request body to a variable for easy reference later
      const updatedNote = req.body
      // we're going to use the mongoose method:
      // findByIdAndUpdate
      // eventually we'll change how this route works, but for now, 
      // we'll do everything in one shot, with findByIdAndUpdate
      Note.findByIdAndUpdate(id, updatedNote, { new: true })
          .then(note => {
              console.log('the newly updated note', note)
              // update success message will just be a 204 - no content
              res.sendStatus(204)
          })
          .catch(err => console.log(err))
  })
  
  
  // DELETE route
  // Delete -> delete a specific note
  
  router.delete('/:id', (req, res) => {
      // get the id from the req
      const id = req.params.id
      // find and delete the note
      Note.findByIdAndRemove(id)
          // send a 204 if successful
          .then(() => {
              res.sendStatus(204)
          })
          // send an error if not
          .catch(err => console.log(err))
  })
  
  
  // SHOW route
  // Read -> finds and displays a single resource
  router.get("/:id", (req, res) => {
    // get the id -> save to a variable
    const id = req.params.id;
    // use a mongoose method to find using that id
    Note.findById(id)
      // send the note as json upon success
      .then((note) => {
        res.json({ note: note });
      })
      // catch any errors
      .catch((err) => console.log(err));
  });
  
  // CREATE route
  // Create -> receives a request body, and creates a new document in the database
  router.post("/", (req, res) => {
    // here, we'll have something called a request body
    // inside this function, that will be called req.body
    // we want to pass our req.body to the create method
    const newNote = req.body;
    Note.create(newNote)
      // send a 201 status, along with the json response of the new note
      .then((note) => {
        res.status(201).json({ note: note.toObject() });
      })
      // send an error if one occurs
      .catch((err) => console.log(err));
  });
  
 


//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router