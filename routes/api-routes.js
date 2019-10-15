// const scrapeSite = require("./scraper");
const axios = require("axios")
const db = require("../models");
const cheerio = require("cheerio");

module.exports = (app) => {
    app.get("/articles/scrape", (request, response) => {
        const url = "https://www.huffpost.com/news/politics/"
        // Making a request via axios for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
        axios.get(url).then(function (response) {
            var $ = cheerio.load(response.data);
            $("div.card.card--standard").each(function (i, element) {
                let link = $(element).children("a").attr("href");
                let title = $(element).children(".card__text").children(".card__headlines").text()
                let author = $(element).children(".card__text").children(".card__byline").children(".author-list").children(".card__byline__author").text()
                let blurb = $(element).children(".card__text").children(".card__description").text()
                // console.log(element)

                let article = {
                    title: title,
                    link: link,
                    author: author,
                    description: blurb
                }
                // console.log(article);

                db.Article.find({ link: article.link }, function (err, inserted) {
                    if (err) {
                        console.log(err)
                        res.send("oops" + err)
                    } else {
                        res.send("good job! scrape complete")
                        console.log(inserted)
                    }
                })
                    .then(foundArticle => {
                        if (!foundArticle.length) {
                            db.Article.create(article)
                                .catch(error => serverResponse.json(error));
                        }
                    })
                    .catch(error => serverResponse.json(error));
            });
            console.log("Scrape complete.");
        })
    })

    app.get("/", (request, response) => {
        db.Article.find()
            .sort({ '_id': -1 })
            .then(foundArticles => {
                const handlebarsObject = {
                    home: true,
                    articles: foundArticles
                }
                response.render("home", handlebarsObject);
            })
            .catch(error => response.json(error));
    })

    app.get("/articles/saved", (request, response) => {
        db.Article.find({ saved: true })
            .sort({ '_id': -1 })
            .then(foundArticles => {
                const handlebarsObject = {
                    home: false,
                    articles: foundArticles
                }
                response.render("home", handlebarsObject);
            })
            .catch(error => response.json(error));
    })

    app.get("/articles/:articleId", (request, response) => {
        db.Article.findOne({ _id: request.params.articleId })
            .then(foundArticles => {
                response.render("article", foundArticles);
            })
            .catch(error => response.json(error))
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