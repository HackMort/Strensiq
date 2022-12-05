$(document).ready(function() {
    $('.skeletonmodal div').hide();
    $('.spancallout').on('click', function() {
        var itemclick = $(this).index();
        var itemclicknumber = itemclick + 1;
        $('.skeletonarea').addClass('active');
        $('.skeletonmodal').addClass('active');
        $('.skeletonmodal div').hide();
        $('.skeletonmodal div:nth-of-type(' + itemclicknumber + ')').show();
    });
    $('.skeletonmodal legend').on('click', function() {
        $('.skeletonarea').removeClass('active');
        $('.skeletonmodal').removeClass('active');
    });
});