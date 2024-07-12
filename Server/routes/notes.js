const express = require('express');
const router = express.Router();
const notes = require('../models/Notes');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');

//Route 1: fetch all notes of user on get "/api/notes/fetchallnotes" . Login required
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    console.log(req.user.id);
    const note = await notes.find({ User: req.user.id });
    res.json(note);
})

//Route 2: add a new note on post "/api/notes/addNote" . Login required
router.post('/addNote', fetchUser, [
    body('title', 'Please enter a title').isLength({ min: 0 }),
    body('Description', 'minimum length of description should be 5').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        const { title, Tags, Description } = req.body;
        const Note = new notes({
            title, Tags, Description, User: req.user.id
        })
        const savedNote = await Note.save();
        res.json(savedNote);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("some internal error occured");
    }
});

//Route 3: Update an exsisting note using put request "/api/notes/" . Login required
router.put('/updateNote/:id', fetchUser, [
    body('title', 'Please enter a title').isLength({ min: 0 }),
    body('Description', 'minimum length of description should be 5').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // same thing can be done with post request also but put is used for updation 
    try {
        const { title, Tag, Description } = req.body;
        // Create a newNote object
        const newNote = {};
        if (title) {
            newNote.title = title;
        }
        if (Description) {
            newNote.Description = Description;
        }
        if (Tag) {
            newNote.Tag = Tag;
        }

        var Note = await notes.findById(req.params.id);
        if (!Note) {
            return res.status(404).json("Not FOund");
        }

        if (Note.User.toString() !== req.user.id) {
            return res.status(401).json("Not Allowed");
        }

        Note = await notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ Note });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("some internal error occured");
    }

});

//Route 4: delete a node using delete request "/api/notes/deleteNote" . Login required
router.delete('/deleteNote/:id', fetchUser, async (req, res) => {
    try {
        var Note = await notes.findById(req.params.id);
        if(!Note)
        {
            return res.status(404).json("Not Found");
        }

        if(Note.User.toString() !== req.user.id)
        {
            return res.status(401).json("Not Allowed");
        }
        console.log(req.user.id);
        console.log(Note);
        Note = await notes.findByIdAndDelete(req.params.id);
        console.log(Note);
        return res.status(200).json({"success":"Note has been deleted ",Note:Note});
        
    }catch (error) {
        console.log(error.message);
        return res.status(500).send("some internal error occured");
    }

})
module.exports = router