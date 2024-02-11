# api-rest-rtc
API REST with mongoDB, express and node in RTC course

### Initialising project
Command line with `npm init -y` and `git init`.

### Editing package.json
You can edit the "scripts" object for launch the project with a better following: 
~~~
"scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
}
~~~

### Creating .gitignore and .env files

*.gitignore*
~~~
node_modules
.env
~~~

*.env*
Later, we will fill it with some environment variables.

### Installing libraries
Command line with
- mongoose: `npm i mongoose`
- express: `npm i express`
- nodemon: `npm i -D nodemon` (dev instalation)
- mongodb: `npm i mongodb` (we can install this library in the user of our PC, to reuse it in more projects)

### Initialising server

~~~
// index.js
const express = require("express");
cont PORT = 3000

// save the execution in the variable "server"
const server = express();

// 
server.use(express.json());
server.use(express.urlencoded({extended: false}));

// A controller of lost routes 
server.use('*', (res, req, next) => {
    const err = new Error('Route not found');
    err.status = 404;
    next(err)
})

/* An express errors control. Warning: may be to call the error
"res.status() is not a function", in that case, you can comment this function */
server.use( (err, res, req, next) => {
    return res.status(err.status || 500).json(err.message || 'Unexpected error')
})

/* We use our server to listen with its method. The first parameter must be the Port,
the second, a callback with the function when it is already listening. */
server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})
~~~

### Creating the BBDD (in our case, with [Mongo Atlas](https://account.mongodb.com/account/login?nds=true&_ga=2.64777519.1202875272.1695112680-542478626.1695112677&_gac=1.61548510.1695137732.CjwKCAjwjaWoBhAmEiwAXz8DBQ04EXmypU4Rhk5ztjIy2sy0G6teRxpnU3qmEN61SKxcbL0Wb-lsQRoCMgIQAvD_BwE))

#### 1. Create our project
Click in "Projects" > click in "New project"

<img width="200" alt="image" src="https://github.com/Let0oro/api-rest-rtc/assets/101608989/3b855b21-4c3d-41d2-b02c-0394effc0210">

Name the project, in our case: "first_bbdd"

<img width="250" alt="image" src="https://github.com/Let0oro/api-rest-rtc/assets/101608989/c67294d7-08c8-4c74-b593-a9cd0fd77a03">

Click "Next"
In the following screen, click "Create Project"

#### 2. Create a deployment
Click "+ Create"

<img width="250" alt="image" src="https://github.com/Let0oro/api-rest-rtc/assets/101608989/d1dfda0e-03a4-4712-bf33-bc8b09f5bea0">

Choose the free M0 cluster, the aws provider (or the one you want) and your nearest region > click "Create".

![image](https://github.com/Let0oro/api-rest-rtc/assets/101608989/3dc3a420-e84e-4a0f-9da0-7cc81d59fb54)

#### 3. Create your user and complete others settings
Follow the instructions to create your user, its important to **copy the password**. Click in "Create User".

We prefer, for the moment, the option "Local environment", and it is necessary to click, in the first contact and local projects, "Add my current IP".

#### 4. Connecting with our BBDD from MongoDB
At the following screen, we will click in "CONNECT" and select the "Drivers" option.

We will **copy the URL** to connect.

![image](https://github.com/Let0oro/api-rest-rtc/assets/101608989/9a7cab53-5694-44db-b607-45b9e75b261d)

In our .env file, we can write "DB_URL=" and paste right after the copied URL, changing "<password>" to the copied password. 
If you cannot access the password in your clipboard, click on "Database Access" in the sidebar and in the "Security" part; then, after clicking on "EDIT" in your user, in the "Password" part, click on the "Edit Password" button, change the password (or auto generate one), copy the new one and click on "Update User".

#### 5. Connecting with our BBDD from code
Create a folder called "src", and, into this, create another two called "api" and "utils". 
At the moment, in "utils" folder, create a file called "db.js".

~~~
// db.js

// import the library mongoose and the dotenv library configuration 
const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() { // in an async function
  try {
    // connect to the url through "process.env.DB_URL" which will get the environment variable we had created with the URL
    await mongoose.connect(process.env.DB_URL);
    console.log("Succesfully connected to DDBB");
  } catch (err) {
    console.log("An error occurred while connecting to DDBB ->", err);
  }
}

// export the function to connect
module.exports = connectDB;
~~~

Finally, in "index.js", import the function and call it.
~~~
const connectDB = require('./utils/db.js');
connectDB();
~~~
**Remember**: the *server.listen* method must **always** be at the end of the code.

### Creation of user and product schemas
In the "api" folder, we will create the folders "controllers", "models" and "routes"

Into the "models" folder, we will create our model. Usually, we will call the file **"note.model.js"** or "Note.js" for our Note model.

~~~
// note.model.js

// importing the library
const mongoose = require('mongoose');

// rename the Schema mongoose class
const Schema = mongoose.Schema;

// call the constructor of the Schema class, the first parameter is an object with the characteristics of our Note
const noteSchema = new Schema(
    {
        title: {type: String, required: true},
        content: {type: String}, 
        mood: {type: String, required: true}, 
        collection: {type: String}, 
        genre: {type: String, required: true}, 
        positiveRate: {type: Number, required: true}
    },
    // The second parameter is the options for each creation or edition of each Note, in this case, the timestamps will record that date and time.
    {
        timestamps: true
    }
)

/* To obtain the final Note, we will need to create a model of it, calling the .model method,
with the name in the first parameter and the schema created in the second. */
const Note = mongoose.model('Note', noteSchema);

// export the Note
module.exports = Note; 
~~~

### Creation of CRUD routes
¿Remember the "routes" folder? we will import this Note and create its routes in a file that we can call "note.routes.js"
But before, we will create the CRUD operations in another folder: "controllers", into a "note.controller.js" file.

~~~
// note.controller.js

// import the Note
const Note = require('../models/note.model');

// For CRUD operations, we will need a simple model:
/*
// async function with request, response and next parameters
const nameCrudFunction = async (req, res, next) => {
  // unstructure or not the body, id, or other parameter of the URL or part of the request for the following query
  // trycatch
  try {
    // mongoDB operation to get a value
    // return res.status(200: read, update and delete, 201: create).json(value)
  } catch (err) {
    return next(err);
  }
}
*/
const getAllNotes = async(req, res, next) => {
    try {
        const notes = await Note.find();
        return res.status(200).json(notes);
    } catch (err) {
        return next(err)
    }
}
const getNoteByID = async(req, res, next) => {
        const { id } = req.params;
    try {
        const note = await Note.findById(id);
        return res.status(200).json(note);
    } catch (err) {
        return next(err)
    }
}
const editNoteByID = async(req, res, next) => {
    const { id } = req.params;
    try {
        const noteModify = new Note(req.body);
        noteModify._id = id;
        const noteUpdated = await Note.findByIdAndUpdate(id, noteModify);
        return res.status(200).json('The note has been updated: ' + noteUpdated);
    } catch (err) {
        return next(err)
    }
}
const createNote = async(req, res, next) => {
    try {
        const newNote = await Note.create({
            title: req.body.title,
            content: req.body.content,
            mood: req.body.mood,
            collection: req.body.collection,
            genre: req.body.genre,
            positiveRate: req.body.positiveRate,
        });
        const createdNote = await newNote.save();
        return res.status(201).json('The note has been created: ' + createdNote)
    } catch (err) {
        return next(err)
    }
}
const deleteNoteByID = async(req, res, next) => {
    const { id } = req.params;
    try {
        await Note.findByIdAndDelete(id);
        return res.status(200).json('The note has been deleted');
    } catch (err) {
        return next(err)
    }
}

// Export the CRUD operations
module.exports = { 
    getAllNotes,
    getNoteByID,
    editNoteByID,
    createNote,
    deleteNoteByID,
}
~~~

Then, into our note.routes.js: 

~~~
// note.routes.js

const express = require("express");
const server = express()

// create the route with express.Router() for routes deeper than the main URL
const route = express.Router();

// import the CRUD operations
const {
  getAllNotes,
  getNoteByID,
  editNoteByID,
  createNote,
  deleteNoteByID,
} = require("../controllers/note.controller");

// associate each URL path (endpoint) with the desired CRUD operation
route.get("/", getAllNotes);
route.get("/:id", getNoteByID);
route.put("/edit/:id", editNoteByID);
route.post("/new", createNote);
route.delete("/delete/:id", deleteNoteByID);

// export the route
module.exports = route;
~~~

Import the path in "index.js" with the URL where the calls to each endpoint will originate from.

~~~
const noteRoutes = require('./api/routes/note.routes.js');

server.use('/notes', noteRoutes);
~~~

From here, we can connect to Insomnia or Postman, create a new project, assign each enpoint to each call and test, we will also see how in the Mongo Atlas database will be reflected if we create and then modify or delete a document.

For example, to get all the notes: 
- The URL will be "http://localhost:3000/notes":
    -> If you notice, the first part is the one we created in "index.js".
    -> The second part is the mapping with "router" of our "index.js" file, which is equal to "express.Router()" and its endpoint is "/notes".
    -> Yes, there is a third part, "/" which is automatically created right after "/notes" and is the path in our "notes.routes.js" file that we associate with the            getAllNotes function for reading.
