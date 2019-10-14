const request = require("request");
const db = require("../models");
const cheerio = require("cheerio");

const scrapeSite = (serverResponse) => {
    request("https://www.huffpost.com/news/politics", (error, response, html) => {
        const $ = cheerio.load(html);

        $(".card.card--standard").each((i, element) => {
            const link = $(element).children("a").attr("href");
            const title = $(element).children(".card__text").children(".card__headlines").text()
            const author = $(element).children(".card__text").children(".card__byline").text()
            const blurb = $(element).children(".card__text").children(".card__description").text()
            if (author) {
                const article = {
                    title: title,
                    link: link,
                    author: author,
                    description: blurb
                }

                db.Article.find({ link: article.link })
                    .then(foundArticle => {
                        if (!foundArticle.length) {
                            db.Article.create(article)
                                .catch(error => serverResponse.json(error));
                        }
                    })
                    .catch(error => {
                        serverResponse.json(error);
                        res.sendStatus(500)
                    })
            }
        })

        serverResponse.send("Scrape complete.");
    })
}

module.exports = scrapeSite;