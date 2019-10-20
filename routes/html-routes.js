// const scrapeSite = require("./scraper");
const axios = require("axios")
const db = require("../models/index.js");

module.exports = (app) => {
    // home (working)
    app.get("/", (request, response) => {
        db.Article.find({})
            .sort({ '_id': -1 })
            .then(foundArticles => {
                const handlebarsObject = {
                    home: true,
                    indarticle: false,
                    articles: foundArticles
                }
                response.render("home", handlebarsObject);
            })
            .catch(err => {
                console.log(err);
                response.sendStatus(500);
            });
    })

    // going to saved article (working)
    app.get("/articles/saved", (request, response) => {
        db.Article.find({ saved: true })
            .sort({ '_id': -1 })
            .then(foundArticles => {
                const handlebarsObject = {
                    home: false,
                    indarticle: false,
                    articles: foundArticles
                }
                response.render("home", handlebarsObject);
            })
            .catch(err => {
                console.log(err);
                response.sendStatus(500);
            });
    })

    // going to single article to see notes and comments
    app.get("/articles/:articleId", (request, response) => {
        db.Article.findOne({ _id: request.params.articleId })
            .populate("note")
            .then(foundArticles => {
                const handlebarsObject = {
                    home: false,
                    indarticle: true,
                    article: foundArticles
                }
                // console.log(handlebarsObject)
                response.render("article", handlebarsObject);

                console.log(handlebarsObject)

                // response.json(handlebarsObject)
                response.status(200);
            })
            .catch(err => {
                console.log(err);
                response.status(500);
            })
    })
}