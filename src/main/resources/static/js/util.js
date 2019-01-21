/* Wires up the following:
   1. A button that opens the dialog
   2. The top-right x that closes the dialog
   3. A 'close' button that closes the dialog
 */
function initDialog (prefix)
{
    $(function () {
        var dialog = $('#' + prefix + 'Dialog');
        var openDialogButton = $('#' + prefix + 'Button');

        openDialogButton.on('click', function ()
        {
            dialog.toggleClass('is-active');
        });

        dialog.find('.close').on('click', function ()
        {
            dialog.toggleClass('is-active');
        });
        dialog.find('button[class="delete"]').on('click', function ()
        {
            dialog.toggleClass('is-active');
        });

        $(document).keyup(function (e)
        {
            if (e.keyCode === 27 && dialog.hasClass('is-active')) { // escape key maps to keycode `27`
                dialog.toggleClass('is-active');
            }
        });
    });
}