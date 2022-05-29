const { Router } = require("express");
const MovieTagsController = require("../controllers/MovieTagsController");

const movieTagsRouters = Router();

const movieTagsController = new MovieTagsController();

movieTagsRouters.get("/:user_id", movieTagsController.list);

module.exports = movieTagsRouters;
