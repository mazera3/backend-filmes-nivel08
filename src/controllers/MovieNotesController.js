const knex = require("../database/knex");

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, movieTags } = request.body;
    const { user_id } = request.params;

    const note_id = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    const movieTagsInsert = movieTags.map((name) => {
      return {
        note_id,
        user_id,
        name,
      };
    });
    await knex("movie_tags").insert(movieTagsInsert);

    response.json("Note successfully registered!");
  }
  async show(request, response) {
    const { id } = request.params;

    const movieNotes = await knex("movie_notes").where({ id }).first();
    const movieTags = await knex("movie_tags")
      .where({ note_id: id })
      .orderBy("name");

    return response.json({
      ...movieNotes,
      movieTags,
    });
  }
  async delete(request, response) {
    const { id } = request.params;
    // criado por min
    const movieNote = await knex("movie_notes").where({ id }).first();
    //
    if (movieNote) {
      await knex("movie_notes").where({ id }).delete();
      return response.json("Note successfully deleted!");
    } else {
      return response.json("MovieNote not found!");
    }
  }
  async list(request, response) {
    const { text, user_id, movieTags } = request.query;
    let notes;
    if (movieTags) {
      const filterTags = movieTags.split(",").map((tag) => tag.trim());
      // console.log(filterTags);
      notes = await knex("movie_tags")
        .select(["movie_notes.id", "movie_notes.title", "movie_notes.user_id"])
        .where("movie_notes.user_id", user_id)
        .whereLike("movie_notes.title", `%${text}%`)
        .whereIn("name", filterTags)
        .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
        .orderBy("movie_notes.title");
    } else {
      notes = await knex("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${text}%`)
        .orderBy("title");
    }

    const userTags = await knex("movie_tags").where({ user_id });
    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id);
      return {
        ...note,
        movie_tags: noteTags,
      };
    });

    return response.json(notesWithTags);
  }
}

module.exports = MovieNotesController;
