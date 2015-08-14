var http = require('http');
var url = require('url');
//var path = require('path');
var _ = require('lodash');

var list = [
  { id: '1', name: 'Illya Klymov', phone: '+380504020799', role: 'Administrator' },
  { id: '2', name: 'Ivanov Ivan', phone: '+380670000002', role: 'Student', strikes: 1 },
  { id: '3', name: 'Petrov Petr', phone: '+380670000001', role: 'Support', location: 'Kiev' }
];

var flag = false;

function setHeaders(response) {
  response.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, POST, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'content-type');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Content-Type', 'application/json');
}

function noHeaders() {return {'status': 401}}

function options() {return {'status': 204}}

function load() {
  return {
    'status': 200,
    'data': JSON.stringify(list)
  }
}

function save(userId, body) {
  var item = _.find(list, {'id': userId});
  if (item && body.id === userId) {
    if (!body.role || body.role === 'Student' || body.role === 'Support' || body.role === 'Administrator') {
      item.role = body.role || 'Student';
      item.name = body.name;
      item.phone = body.phone;
      if (!body.role || body.role === 'Student') item.strikes = body.strikes;
      if (body.role === 'Support') item.location = body.location;
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

  if (!body.role || body.role === 'Support' || body.role === 'Administrator') {
    item.id = (+_.max(list, 'id').id + 1).toString();
    item.name = body.name;
    item.phone = body.phone;
    item.role = body.role || 'Student';
    if (body.role === 'Student') item.strikes = +body.strikes;
    if (body.role === 'Support') item.location = body.location;
    list.push(item);
    return {
      'status': 204,
      'data': item.id
    }
  } else {
    return {'status': 401}
  }
}

function refreshAdmins() {
  return {'status': 200}
}

function router(haveHeaders, method, pathname, userId, body) {
  if (pathname === '/api/users') {
    if (method === 'OPTIONS') return options();
    if (method === 'GET') {
      if (flag || haveHeaders) return load();
      else return noHeaders();
    }
    if (method === 'PUT' || method === 'POST' || method === 'DELETE') flag = true;
    if (!haveHeaders) return noHeaders();
    if (method === 'PUT') return save(userId, body);
    if (method === 'POST') return add(body);
    if (method === 'DELETE') return remove(userId);
  }
  if (pathname === '/refreshAdmins') {
    return refreshAdmins();
  }
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
      if (parsedBody.role === 'Admin') parsedBody.role = 'Administrator';
      var content = router(haveHeaders, method, pathname, userId, parsedBody);

      setHeaders(response);
      if (content && content.status) response.writeHead(content.status);
      if (content && content.data) response.write(content.data);
      response.end();

    });
  }

  var server = http.createServer(onRequest);
  if (module.parent) { module.exports = server } else { server.listen(20007); }
}

start(router);