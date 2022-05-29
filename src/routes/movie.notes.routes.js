const { Router } = require("express");
const MovieNotesController = require("../controllers/MovieNotesController");

const movieNotesRouters = Router();

const movieNotesController = new MovieNotesController();

movieNotesRouters.get("/", movieNotesController.list);
movieNotesRouters.post("/:user_id", movieNotesController.create);
movieNotesRouters.get("/:id", movieNotesController.show);
movieNotesRouters.delete("/:id", movieNotesController.delete);

module.exports = movieNotesRouters;
