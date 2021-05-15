// #Variables
// adds express library
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 8080;

let myNotes = [];

// #Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Develop/public")));


app.get("/api/notes", function (err, res) {
	try {
		myNotes = fs.readFileSync("Develop/db/db.json", "utf8");
		myNotes = JSON.parse(myNotes);
	} catch (error) {
		throw error;
	}
	res.json(myNotes);
});

//

app.post("/api/notes", function (req, res) {
	try {
		myNotes = fs.readFileSync("./Develop/db/db.json", "utf8");
		myNotes = JSON.parse(myNotes);
		req.body.id = myNotes.length;
		myNotes.push(req.body);
		myNotes = JSON.stringify(myNotes);
		fs.writeFile("./Develop/db/db.json", myNotes, "utf8", function (err) {
			if (err) throw err;
		});
		res.json(JSON.parse(myNotes));
	} catch (error) {
		throw error;
	}
});

// Delete a note by id

app.delete("/api/notes/:id", function (req, res) {
	try {
		myNotes = fs.readFileSync("./Develop/db/db.json", "utf8");
		myNotes = JSON.parse(myNotes);
		myNotes = myNotes.filter(function (note) {
			return note.id != req.params.id;
		});
		myNotes = JSON.stringify(myNotes);
		fs.writeFile("./Develop/db/db.json", myNotes, "utf8", function (err) {
			if (err) throw err;
		});
		res.send(JSON.parse(myNotes));
	} catch (err) {
		throw err;
	}
});

// Routes

app.get("/notes", function (req, res) {
	res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
	return res.sendFile(path.json(__dirname, "Develop/db/db.json"));
});

// defaults route to home
app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

// starts the server on the specified port
app.listen(PORT, function () {
	console.log("App is listening: " + PORT);
});
