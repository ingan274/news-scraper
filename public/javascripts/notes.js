$(document).ready(function () {

    $("#scrapeNews").on("click", function (event) {
        event.preventDefault();
        $.ajax("/articles/scrape", {
            type: "GET"
        }).then(data => window.location.href = window.location.href)
            .catch(err => console.log(err));
    })

    $(".bookmark").on("click", function (event) {
        event.preventDefault();
        const articleId = $(this).data("article-id");
        const saved = $(this).attr("data-save")
        // alert("article: " + articleId + " " + "saved: " + saved)

        $.ajax(`/articles/save/${articleId}`, {
            type: "PUT",
            data: {
                saved: saved
            }
        }).then(data => window.location.href = window.location.href)
            .catch(err => console.log(err));
    })

    $(".individual-article").on("click", function (event) {
        event.preventDefault();
        const articleId = $(this).data("article-id")
        // alert("article: " + articleId + " " + "saved: " + saved)

        $.ajax(`/articles/${articleId}`, {
            type: "GET"
        }).then(location.href = `/articles/${articleId}`)
            .catch(err => console.log(err));
    })

    $(".add-note").on("click", function (event) {
        event.preventDefault();
        const articleId = $(this).data("article-id");
        // alert(articleId)
        const note = $(`#${articleId}-input`).val().trim();

        if (note) {
            $(`#${articleId}-input`).val("");
            $.ajax("/notes/submit", {
                type: "POST",
                data: {
                    articleId: articleId,
                    note: note
                }
            }).then(data => {
                window.location.href = window.location.href;
            }).catch(err => console.log(err));
        }
    })

    $(".exit-button").on("click", ".delete-note", function (event) {
        const noteId = $(this).data("note-id");
        $.ajax(`/notes/delete/${noteId}`, {
            type: "DELETE"
        }).then(data => window.location.href = window.location.href)
            .catch(err => console.log(err));
    })
})
