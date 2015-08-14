var http = require('http');
var url = require('url');
var _ = require('lodash');

var list = [
  { id: '1', name: 'Illya Klymov', phone: '+380504020799', role: 'Administrator' },
  { id: '2', name: 'Ivanov Ivan', phone: '+380670000002', role: 'Student', strikes: 1 },
  { id: '3', name: 'Petrov Petr', phone: '+380670000001', role: 'Support', location: 'Kiev' }
];

var headers = {'Content-Type': 'application/json'};

function noHeaders() {return {'status': 401}}

function load() {
  return {
    'status': 200,
    'data': JSON.stringify(list)
  }
}

function save(userId, body) {
  var item = _.find(list, {'id': userId});
  if (item && body.id === userId) {
    body.role = body.role || 'Student'
    if (body.role === 'Student' || body.role === 'Support' || body.role === 'Administrator') {
      _.assign(item, body);
      return {'status': 204}
    }
    return {'status': 401}
  }
  return {'status': 404}
}

function remove(userId) {
  var item = _.find(list, {'id': userId});
  if (item) {
    _.remove(list, {'id': userId});
    return {'status': 204}
  } else {
    return {'status': 404}
  }
}

function add(body) {
  var item = {};
  body.role = body.role || 'Student'
  if (body.role === 'Student' || body.role === 'Support' || body.role === 'Administrator') {
    body.id = (+_.max(list, 'id').id + 1).toString();
    _.assign(item, body);
    list.push(item);
    return {
      'status': 204,
      'data': item.id
    }
  } else {
    return {'status': 401}
  }
}

function refreshAdmins() {return {'status': 200}}

function router(haveHeaders, method, pathname, userId, body) {
  if (method === 'GET' && pathname === '/refreshAdmins') return refreshAdmins();
  if (!haveHeaders) return noHeaders();
  if (pathname === '/api/users') {
    if (method === 'GET') return load();
    if (method === 'PUT') return save(userId, body);
    if (method === 'POST') return add(body);
    if (method === 'DELETE') return remove(userId);
  }
  return noHeaders();
}

function start(router) {
  function onRequest(request, response) {
    var method = request.method;
    var pathname = url.parse(request.url, true).pathname;
    var haveHeaders = (request.headers['content-type'] === 'application/json');
    var userId;
    var body = '';
    var parsedBody = {};

    if (method === 'PUT' || method === 'DELETE') {
      if (_.startsWith(pathname, '/api/users')) {
        userId = pathname.substr('/api/users/'.length);
        pathname = '/api/users';
      }
    }

    request.on('data', function (data) {
      body += data;
      if (body.length > 1e6)
        request.connection.destroy();
    });
    request.on('end', function () {
      if (body !== '') parsedBody = JSON.parse(body);
      var content = router(haveHeaders, method, pathname, userId, parsedBody);

      response.writeHead(content.status, headers);
      if (content && content.data) response.write(content.data);
      response.end();

    });
  }

  var server = http.createServer(onRequest);
  if (module.parent) { module.exports = server } else { server.listen(20007); }
}

start(router);