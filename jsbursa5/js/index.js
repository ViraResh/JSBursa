$(function() {

  var stageData = [];

  if (localStorage.getItem('stageData')) {
    stageData = JSON.parse(localStorage.getItem('stageData'));
  }

  function getStatus(item) {
    if (item.parent().parent().hasClass('active')) {
      return 'active';
    } else if (item.parent().parent().hasClass('redcard')) {
      return 'redcard';
    } else if (item.parent().parent().hasClass('removed')) {
      return 'removed';
    }
  }

  function rebuild() {
    stageData = [];
    $.each($('li'), function(){
      stageData.push({
        'id' : $(this).data('id').toString(),
        'name' : $(this).data('name'),
        'phone' : $(this).data('phone'),
        'status' : getStatus($(this))
      });
    });
    localStorage.setItem('stageData', JSON.stringify(stageData));
  }

  function paint() {
    var list = $('ul');
    var removed = $('.removed ul');
    list.text('')
        .disableSelection();

    stageData.forEach(function(item) {
      $('.' + item.status + ' ul').append(
        '<li data-id=' + item.id + '>' +
          '<h3>' + item.name + '</h3>' +
          '<h4>' + item.phone + '</h4>' +
        '</li>');
    });
    //toArray

    list.sortable({
      connectWith: 'ul',
      remove: function (event, ui) {
        $.post(url + '/' + ui.item.data('id'), {'status': getStatus(ui.item)})
          .error(function() {
            list.sortable('cancel');
          }
        )
      },
      update: function () {rebuild()}
    });
/*
    removed.sortable( 'option', {
      containment: $('.removed'),
      remove: function () {return}
    });*/
  }

  function writeStorage(getData) {
    getData =_.map(getData, function(item) {
      var index = _.indexOf(_.map(stageData, 'id'), item.id);
      if (index === -1) {index = stageData.length}
      item.index = index;
      return item;
    });
    stageData = _.map(_.sortByAll(getData, ['status', 'index']), function(item) {
      return _.omit(item, 'index');
    });
    localStorage.setItem('stageData', JSON.stringify(stageData));
    paint();
  }

  $.get(url).success(writeStorage);
});