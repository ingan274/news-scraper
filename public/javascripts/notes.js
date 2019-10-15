$(document).ready(function(){
  
    $("#scrapeNews").on("click",function(event) {
        event.preventDefault();
        $.ajax("/articles/scrape", {
            type: "GET"
        }).then(window.location.reload())
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
        }).then(data => window.location.reload())
        .catch(err => console.log(err));
    })

    $(".individual-article").on("click",function(event) {
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
        const note = $(`#${articleId}-input`).val().trim();

        if (note) {
            $(`#${articleId}-input`).val("");
            $.post("/notes/submit", { articleId: articleId, note: note }, data => location.reload())
        }
    })

    $(".delete-note").on("click", function (event) {
        const noteId = $(this).data("note-id");
        $.ajax(`/notes/delete/${noteId}`, {
            type: "DELETE"
        }).then(data => location.reload());
    })
})
