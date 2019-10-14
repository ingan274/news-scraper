const request = require("request");
const db = require("../models");
const cheerio = require("cheerio");

const scrapeSite = (serverResponse) => {
    request("https://www.huffpost.com/news/politics", (error, response, html) => {
        const $ = cheerio.load(html);

        $(".card.card--standard").each((i, element) => {
            const title = $(element).children().text()
                .split(/\n?\t/)
                .filter(value => value)[0];
            const uri = $(element).children().attr("href");
            const author = $(element).next().find("a").text()
                .split(/\n?\t/)
                .filter(value => value)
                .join(", ");
            const blurb = $(element).parent().next().text()
                .split(/\n?\t/)
                .filter(value => value)
                .concat("...")
                .join("");

            if (author) {
                const article = {
                    title: title,
                    uri: uri,
                    author: author,
                    blurb: blurb
                }

                db.Article.find({ uri: article.uri })
                    .then(foundArticle => {
                        if (!foundArticle.length) {
                            db.Article.create(article)
                                .catch(error => serverResponse.json(error));
                        }
                    })
                    .catch(error => serverResponse.json(error));
            }
        })

        serverResponse.send("Scrape complete.");
    })
}

export default scrapeSite;