const scrapeSite = require("./scraper");
const db = require("../models");

export default app => {
    app.get("/articles/scrape", (request, response) => {
        scrapeSite(response);
    })

    app.get("/", (request, response) => {
        db.Article.find()
            .populate("notes")
            .sort({ '_id': -1 })
            .then(foundArticles => {
                const handlebarsObject = {
                    home: true,
                    articles: foundArticles
                }
                response.render("index", handlebarsObject);
            })
            .catch(error => response.json(error));
    })

    app.get("/articles/saved", (request, response) => {
        db.Article.find({ saved: true })
            .populate("notes")
            .sort({ '_id': -1 })
            .then(foundArticles => {
                const handlebarsObject = {
                    home: false,
                    articles: foundArticles
                }
                response.render("index", handlebarsObject);
            })
            .catch(error => response.json(error));
    })

    app.put("/articles/save/:articleId", (request, response) => {
        db.Article.findOneAndUpdate({ _id: request.params.articleId }, { saved: request.body.save }, { new: true })
            .then(updatedArticle => response.send("Save status updated."))
            .catch(error => response.json(error))
    })

    app.post("/notes/submit", (request, response) => {
        db.Note.create({ body: request.body.note })
            .then(createdNote => {
                db.Article.findOneAndUpdate({ _id: request.body.articleId }, { $push: { notes: createdNote._id } }, { new: true })
                    .then(updatedArticle => response.send("Note added."))
                    .catch(error => response.json(error));
            })
    })

    app.delete("/notes/delete/:noteId", (request, response) => {
        db.Note.deleteOne({ _id: request.params.noteId })
            .then(deletedNote => response.send("Note deleted."))
            .catch(error => response.json(error));
    })
}