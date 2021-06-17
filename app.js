const Joi = require('joi');
const express = require('express');

var app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

//List of courses
var courses = [
    {id: 1, name: "course1"},
    {id: 2, name: "course2"},
    {id: 3, name: "course3"},
    {id: 4, name: "course4"},
]

//GET:all Operation
app.get("/", (req, res) => {
    res.send(courses)
})

//GET:id Operation
app.get("/courses/:id", (req, res) => {
    var ID = req.params.id;
    //Query the array to find the id
    const course = courses.find((c) => c.id === parseInt(ID))
    //If course with the given Id is not found
    if(!course) return res.status(404).send("The course with the given ID was not found");
    
    res.send(course);
})

//POST Operation
app.post("/courses", (req, res) => {
    //Validate the course, if it is invalid send a 400 - Bad request
    const { error } = validateCourses(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //Initialize content to be pushed
    const course = {
        id: courses.length + 1,
        name: req.body.name,
    }
    //Push content into the empty array
    courses.push(course);
    res.send(course);
})

//UPDATE Operation
app.put("/courses/:id", (req, res) => {
    
    let ID = req.params.id
    //Search the course, if it does not exist send a 404
    const course = courses.find((c) => c.id === parseInt(ID))
    if(!course) return res.status(404).send("The course with the given ID was not found");

    //Validate the course, if it is invalid send a 400 - Bad request
    const { error } = validateCourses(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Update the course
    course.name = req.body.name;
    res.send(course);
})

function validateCourses(course) {
    //Describe the schema
    const schema = {
    name: Joi.string().min(3).required()
    }
    //Validate the schema with Joi
    return Joi.validate(course, schema)
}

//DELETE Operation
app.delete("/courses/:id", (req, res) => {
    let ID = req.params.id
    //Search the course, if it does not exist send a 404
    const course = courses.find((c) => c.id === parseInt(ID))
    if(!course) return res.status(404).send("The course with the given ID was not found");

    //delete the course
    const courseIndex = courses.indexOf(course);
    courses.splice(courseIndex, 1);

    res.send(course);
})
app.listen(port, () => console.log(`The server is currently running on ${port}...`))