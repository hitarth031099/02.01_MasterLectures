(function ($) {

    init();

    $('#searchForm').submit(function (event) {
        event.preventDefault();
        let input = $('#search_term');
        let text = input.val();
        text = text.trim();
        if (text == '') {
            alert("Search should not be empty!");
            return;
        }
        input.val("");
        $('#show').html("").css("visibility", "hidden");

        const ul = $('#showList');
        $.ajax({
            method: 'GET',
            url: "http://api.tvmaze.com/search/shows?q=" + text,
            success: function (responseMessage) {
				
                ul.html("");
                responseMessage.forEach(element => {
                    ul.html(ul.html() + `<ol><a class="details" href="${element.show._links.self.href}" onclick="showClick(event,'${element.show.id}')">${element.show.name}</a></ol>`);
                });
                ul.css("visibility", "visible");
            },
            error: function (responseMessage) {
                alert("didn't get mesage, something wrong");
            }
        });
    });

})(jQuery);


function showClick(event, showId) {
    event.preventDefault();
    $('#showList').html("").css("visibility", "hidden");
    const show = $('#show');
    show.css("visibility", "visible");
    $('#homeLink').css("visibility", "visible");
    $.ajax({
        method: 'GET',
        url: "http://api.tvmaze.com/shows/" + showId,
        success: function (responseMessage) {
            show.html("");
            show.html(show.html() + `<h1>${responseMessage.name ? responseMessage.name : "N/A"}</h1>`);
            show.html(show.html() + `<img src=${responseMessage.image && responseMessage.image.medium ? responseMessage.image.medium : "/no_image.jpg"}>`);
            show.html(show.html() + `<dl>`);

            show.html(show.html() + `<dt>Language</dt><dd>${responseMessage.language ? responseMessage.language : "N/A"}</dd>`);

            show.html(show.html() + `<dt>Genres</dt><dd><ul>${responseMessage.genres ? ((input) => {
                let output = "";
                input.forEach(element => {
                    output += `<li>${element}</li>`;
                });
                return output;
            })(responseMessage.genres) : "N/A"}</ul></dd>`);

            show.html(show.html() + `<dt>Average Rating</dt><dd>${responseMessage.rating && responseMessage.rating.average ? responseMessage.rating.average : "N/A"}</dd>`);

            show.html(show.html() + `<dt>Network</dt><dd>${responseMessage.network && responseMessage.network.name ? responseMessage.network.name : "N/A"}</dd>`);

            show.html(show.html() + `<dt>Summary</dt><dd>${responseMessage.summary ? responseMessage.summary : "N/A"}</dd>`);

            show.html(show.html() + `</dl>`);
        },
        error: function (responseMessage) {
            alert("didn't get mesage, something wrong");
        }
    });
}

function init() {
    $.ajax({
        method: 'GET',
        url: 'http://api.tvmaze.com/shows',
        success: function (responseMessage) {
            const ul = $('#showList');
            ul.html("");
            responseMessage.forEach(element => {
                ul.html(ul.html() + `<ol> <a class="details" href="${element._links.self.href}" onclick="showClick(event,'${element.id}')">${element.name}</a></ol> `);
            });
            ul.css("visibility", "visible");
        },
        error: function (responseMessage) {
            alert("didn't get mesage, something wrong");
        }
    });
}
