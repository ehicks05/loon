/**
 * Ajax to get new search results.
 * @param {string} callingElementId - Where the results will be placed.
 * @param {string} context - Context path.
 * @param {string} endpoint - query portion of the url.
 * @param {string} issueFormId - The issue form to get results from.
 * @param {string} newPage - The page to get from the search result.
 * @param {string} newSortColumn - Sort column.
 * @param {string} newSortDirection - Sort direction.
 */
function ajaxItems(callingElementId, context, endpoint, issueFormId, newPage, newSortColumn, newSortDirection)
{
    var myUrl = context + endpoint;
    var params = {};
    if (issueFormId) params.issueFormId = issueFormId;
    if (newPage) params.page = newPage;
    if (newSortColumn) params.sortColumn = newSortColumn;
    if (newSortDirection) params.sortDirection = newSortDirection;

    var opts = {
        lines: 13, // The number of lines to draw
        length: 20, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };

    var target = $('#' + callingElementId).closest('.ajaxTableContainer'); //put your target here!
    target.css('opacity', '.50');
    var spinner = new Spinner(opts).spin(target[0]);

    $.get(myUrl, params,
        function(data, textStatus, xhr)
        {
            spinner.stop();
            target.css('opacity', '1');
            if(textStatus == "success")
            {
                var rows = [];

                $('#' + callingElementId).closest('.ajaxTableContainer').html(data);
            }
            if (textStatus == "error")
                alert("Error: " + xhr.status + ": " + xhr.statusText);
        });
}