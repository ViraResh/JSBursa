var state = {
  usersObj: [],
  usersList: []
};
var students = {
  active: [], redcard: [], removed: [], allStud: []
};

var studentsStorage = localStorage.getItem('studentsStorage');
if (studentsStorage) {
  students = JSON.parse(studentsStorage);
}

$(document).ready(function(){

  function create(arr, status) { // arr = students.active, students.redcard, students.removed
    arr.forEach(function(item) {
      state.usersObj.map(function(index) {

        if(item === (index.name) && index.status === status) {
          $('.' + index.status + ' ul').append('<li id=' + index.id + '>'); // data-id, index.status = class
          $('#' + index.id).append('<h3> + <h4>');
          $('#' + index.id + ' h3').text(index.name);
          $('#' + index.id + ' h4').text(index.phone);
        }

      })
    });
  }

  function create2() {
    state.usersList.forEach(function(item) {
      if (students.allStud.indexOf(item) === -1) {
        state.usersObj.map(function (index) {

          if ((index.name+'-'+index.status) === item) {
            $('.' + index.status + ' ul').append('<li id=' + index.id + '>'); // data-id, index.status = class
            $('#' + index.id).append('<h3> + <h4>');
            $('#' + index.id + ' h3').text(index.name);
            $('#' + index.id + ' h4').text(index.phone);
          }
        })
      }
    });
  }

  function createWithLocalStorage() {

    create(students.active, 'active');
    create(students.redcard, 'redcard');
    create(students.removed, 'removed');
    create2();
  }

  function addStudents() {
    students.active = [];
    students.redcard = [];
    students.removed = [];
    students.allStud = [];
    $('li').each(function() {

      var parentDiv = $($(this).parent()).parent();
      if(parentDiv.hasClass('active')) {
        students.active.push($(this).children('h3').text());
        students.allStud.push($(this).children('h3').text()+'-'+'active')
      }
      if(parentDiv.hasClass('redcard')) {
        students.redcard.push($(this).children('h3').text());
        students.allStud.push($(this).children('h3').text()+'-'+'redcard')
      }
      if(parentDiv.hasClass('removed')) {
        students.removed.push($(this).children('h3').text());
        students.allStud.push($(this).children('h3').text()+'-'+'removed')
      }

    });
    localStorage.setItem('studentsStorage', JSON.stringify(students));
  }

  $.get(window.url).success(function list (data) {
    data.map(function(index) {
      state.usersObj.push(index);
    });
    state.usersObj.map(function (index) {
      state.usersList.push(index.name+'-'+index.status)
    });
    createWithLocalStorage();
    addStudents();
  });

  $('ul').sortable({
    connectWith: 'ul',
    remove: function(event, ui) {

      if ($(event.target).parent().hasClass('removed')) {
        $('ul').sortable( "cancel" );
        return;
      }

      function newStatus() {
        if (ui.item.parent().parent().hasClass('active')) {
          return 'active';
        }
        if (ui.item.parent().parent().hasClass('redcard')) {
          return 'redcard';
        } else {
          return 'removed';
        }
      }

      $.post(window.url + '/' + ui.item.attr('id'), {status: newStatus()})
        .success(function change() {
          console.log(newStatus());
          addStudents();
        })
        .error(function err() {
          $('ul').sortable( "cancel" );
        })

    },
    update: function(){
      addStudents();
    }

  });

});