angular.module('jsbursa', [])
  .directive('draggableList', function() {
    return {
      scope: {
        items: '=',
        id: '@'
      },
      template: '<ul><li data-id={{user.id}} ng-repeat="user in items"><h3>{{user.name}}</h3><h4>{{user.phone}}</h4></li><ul>',
      link: function($scope, $element) {
        var stageData = [];
        $scope.items = $scope.items || [];

        function rewriteStorage() {
          var i = [];
          _.map($scope.items, function(item) {i.push(item.id);});
          _.remove(stageData, {'id': $scope.id});
          stageData.push({'id': $scope.id, 'indexes': i});
          localStorage.setItem('stageData', JSON.stringify(stageData));
        }

        if (localStorage.getItem('stageData')) {
          stageData = JSON.parse(localStorage.getItem('stageData'));
          var indexes = _.find(stageData, {id: $scope.id});
          if (indexes) {
            var tempList = angular.copy(_.map($scope.items, function(item) {
              var index = _.indexOf(indexes.indexes, item.id);
              if (index === -1) {index = $scope.items.length}
              item.index = index;
              return item;
            }));
            tempList = _.map(_.sortByAll(tempList, 'index'), function(item) {
              return _.omit(item, 'index');
            });
            $scope.items = tempList;
            rewriteStorage();
            $scope.$applyAsync();
          }
        }

        function rebuildList(domList) {
          var indexes = [];

          $.each(domList.find('li'), function(){
            indexes.push($(this).data('id').toString());
          });

          var tempList =_.map($scope.items, function(item) {
            item.index = _.indexOf(indexes, item.id);
            return item;
          });

          var newList = angular.copy(_.map(_.sortByAll(tempList, 'index'), function(item) {
            return _.omit(item, 'index');
          }));

          $scope.items = [];
          $scope.$applyAsync();
          $scope.items = newList;
          $scope.$applyAsync();
          rewriteStorage();
        }

        $scope.$watch('items', $scope.$applyAsync());

        $element.find('ul').sortable({
          connectWith: $('draggable-list ul'),
          update: function() {
            rebuildList($(this));
          },
          remove: function(event, ui) {
            _.remove($scope.items, {'id' : ui.item.data('id').toString()});
            rebuildList($(this));
          },
          receive: function(event, ui) {
            $scope.items.push(_.find($scope.$parent[$(ui.sender).parent().attr('items')], {'id': ui.item.data('id').toString()}));
            rebuildList($(this));
          }
        });
      }
    }
  })

  .controller('myController', function($scope) {
    $scope.list1 = [
      {
        "id":"1",
        "name":"Jeremy Lane",
        "phone":"(466) 514-6617",
        "status":"redcard"
      },{
        "id":"2",
        "name":"Austin Hunt",
        "phone":"(314) 333-4959",
        "status":"removed"
      },{
        "id":"3",
        "name":"Ronald Campbell",
        "phone":"(686) 869-6077",
        "status":"removed"
      },{
        "id":"4",
        "name":"Don Stewart",
        "phone":"(328) 747-6780",
        "status":"removed"
      },{
        "id":"5",
        "name":"Jeremiah Jordan",
        "phone":"(769) 969-5203",
        "status":"removed"
      }
    ];
    $scope.list2 = [];
  });
