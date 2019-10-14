$("#scrape").on("click", function(event) {
    $.get("/articles/scrape", data => location.reload());
})

$(".save, .unsave").on("click", function(event) {
    const articleId = $(this).data("article-id");
    $.ajax(`/articles/save/${articleId}`, {
        type: "PUT",
        data: {
            save: $(this).data("save")
        }
    }).then(data => location.reload());
})

$(".add-note").on("click", function(event) {
    event.preventDefault();
    const articleId = $(this).data("article-id");
    const note = $(`#${articleId}-input`).val().trim();
    
    if (note) {
        $(`#${articleId}-input`).val("");
        $.post("/notes/submit", { articleId: articleId, note: note }, data => location.reload())
    }
})

$(".delete-note").on("click", function(event) {
    const noteId = $(this).data("note-id");
    $.ajax(`/notes/delete/${noteId}`, {
        type: "DELETE"
    }).then(data => location.reload());
})