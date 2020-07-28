
    /*Dropdown Menu*/
    $('.dropdownset').click(function () {
        $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdownsetmenu').slideToggle(300);
});
    $('.dropdownset').focusout(function () {
        $(this).removeClass('active');
    $(this).find('.dropdownsetmenu').slideUp(300);
});
    $('.dropdownset .dropdownsetmenu li').click(function () {
        $(this).parents('.dropdownset').find('span').text($(this).text());
    $(this).parents('.dropdownset').find('input').attr('value', $(this).attr('id'));
});
/*End Dropdown Menu*/
  
$('.dropdownsetmenu li').click(function () {
  var input = '<strong>' + $(this).parents('.dropdownset').find('input').val() + '</strong>',
      msg = '<span class="msg">Hidden input value: ';
  $('.msg').html(msg + input + '</span>');
  });
   