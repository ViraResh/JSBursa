var server = require('../index');
var request = require('supertest');
var _ = require('lodash');

var testList = [
  { id: '1', name: 'Illya Klymov', phone: '+380504020799', role: 'Administrator' },
  { id: '2', name: 'Ivanov Ivan', phone: '+380670000002', role: 'Student', strikes: 1 },
  { id: '3', name: 'Petrov Petr', phone: '+380670000001', role: 'Support', location: 'Kiev' }
];

// А. Неправильный код ответа на GET на /refreshAdmins
describe('A', function(){
  it('1,2', function(done){
    request(server)
      .get('/refreshAdmins')
      //
      //
      // .set('Content-Type', 'application/json')
      //
      //
      .end(function(err, res){
// 1. Проверить, что дает статус 200, если указать Content-Type application/json.
        expect(res.status).toEqual(200);
// 2. Проверить, что ответ сервера содержит Content-Type application/json.
        expect(res.headers['content-type']).toEqual('application/json');
        done(err);
      });
  });
});

// B. Неправильное начальное состояние сервера при получении списка пользователей
describe('B', function(){
  it('1,2,3', function(done){
    request(server)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
// 1. Проверить, что список пользователей = массив объектов.
        expect(res.body).toEqual(testList);
// 2. Проверить, что ответ сервера содержит Content-Type application/json.
        expect(res.headers['content-type']).toEqual('application/json');
// 3.Проверить, что дает статус 200
        expect(res.status).toEqual(200);
        done();
      });
  });
});

// C. Неправильная реакция на запрос без Content-Type
describe('C', function() {
  it('1,2,3,4', function (done) {
    request(server)
      .get('/api/users')
      .end(function (err, res) {
// 1. Проверить что возвращается 401 при запросе GET
        expect(res.status).toEqual(401);
        done();
      });
    request(server)
      .post('/api/users')
      .end(function (err, res) {
// 2. Проверить что возвращается 401 при запросе POST
        expect(res.status).toEqual(401);
        done();
      });
    request(server)
      .del('/api/users')
      .end(function (err, res) {
// 3. Проверить что возвращается 401 при запросе PUT
        expect(res.status).toEqual(401);
        done();
      });
    request(server)
      .put('/api/users')
      .end(function (err, res) {
// 4. Проверить что возвращается 401 при запросе DELETE
        expect(res.status).toEqual(401);
        done();
      });
  });
});

// D. Неправильная реакция на запрос с неправильным Content-Type
describe('D', function(){
  it('1,2,3,4', function(done){
    request(server)
      .get('/api/users')
      .set('Content-Type', 'application/pdf')
      .end(function(err, res){
// 1. Проверить что возвращается 401 при запросе GET
        expect(res.status).toEqual(401);
        done();
      });
    request(server)
      .post('/api/users')
      .set('Content-Type', 'application/pdf')
      .end(function(err, res){
// 2. Проверить что возвращается 401 при запросе POST
        expect(res.status).toEqual(401);
        done();
      });
    request(server)
      .put('/api/users')
      .set('Content-Type', 'application/pdf')
      .end(function(err, res){
// 3. Проверить что возвращается 401 при запросе PUT
        expect(res.status).toEqual(401);
        done();
      });
    request(server)
      .del('/api/users')
      .set('Content-Type', 'application/pdf')
      .end(function(err, res){
// 4. Проверить что возвращается 401 при запросе DELETE
        expect(res.status).toEqual(401);
        done();
      });
  });
});

// E. Некорректная обработка PUT-запроса
describe('E', function(){
  it('1', function(done){
    var newUser = {
      id: '2',
      name: 'Fedya',
      phone: '+380000000000',
      role: 'Support',
      location: 'Kiev'
    };
    request(server)
      .put('/api/users/2')
      .set('Content-Type', 'application/json')
      .send(newUser)
      .end(function(err, res){
// 1. Проверить,что при запросе с правильным id и role ответ 204 и содержит хедеры
        expect(res.status).toEqual(204);
        expect(res.headers['content-type']).toBeDefined();
        expect(res.headers['content-type']).toEqual('application/json');
        done();
      });
    request(server)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
//      Проверить,что он записался с правильными данными
        expect(res.body[1].id).toEqual(newUser.id);
        expect(res.body[1].name).toEqual(newUser.name);
        expect(res.body[1].phone).toEqual(newUser.phone);
        expect(res.body[1].role).toEqual(newUser.role);
        expect(res.body[1].location).toEqual(newUser.location);
        expect(res.status).toEqual(200);
        expect(res.headers['content-type']).toBeDefined();
        expect(res.headers['content-type']).toEqual('application/json');
        done(err);
      });
  });

  it('2', function(done){
    var newUser = {
      id: '3',
      name: 'Ivanov Ivan',
      phone: '+380670000002',
      strikes: 1
    };
    request(server)
      .put('/api/users/3')
      .set('Content-Type', 'application/json')
      .send(newUser)
      .end(function(err, res){
// 2. Проверить, что при запросе с правильным id без role ответ 204  содержит хедеры
        expect(res.status).toEqual(204);
        expect(res.headers['content-type']).toBeDefined();
        expect(res.headers['content-type']).toEqual('application/json');
        done();
      });
    newUser.role = 'Student';
    request(server)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
//      Проверить, что он записался с правильными данными и role = Student
        expect(res.body[2].id).toEqual(newUser.id);
        expect(res.body[2].name).toEqual(newUser.name);
        expect(res.body[2].phone).toEqual(newUser.phone);
        expect(res.body[2].role).toEqual(newUser.role);
        expect(res.body[2].strikes).toEqual(newUser.strikes);
        done(err);
      });
  });

});

// F. Некорректная обработка PUT-запроса (администратора)
describe('F', function(){
  it('1', function(done){
    var newUser = {
      id: '2',
      name: 'Admin Fedya',
      phone: '+380000000000',
      role: 'Administrator'
    };
    request(server)
      .put('/api/users/2')
      .set('Content-Type', 'application/json')
      .send(newUser)
      .end(function(err, res){
// 1. Проверить,что при запросе с правильным id и role ответ 204 и содержит хедеры
        expect(res.status).toEqual(204);
        expect(res.headers['content-type']).toBeDefined();
        expect(res.headers['content-type']).toEqual('application/json');
        done();
      });
    request(server)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
//      Проверить,что он записался с правильными данными
        expect(res.body[1].id).toEqual(newUser.id);
        expect(res.body[1].name).toEqual(newUser.name);
        expect(res.body[1].phone).toEqual(newUser.phone);
        expect(res.body[1].role).toEqual(newUser.role);
        done(err);
      });
  });
});

// G. Некорректная обработка неверного PUT-запроса
describe('G', function(){
  it('1', function(done){
    var state;
    var newUser = {
      id: '10',
      name: 'New Fedya',
      phone: '+380000000000',
      role: 'Administrator'
    };
    request(server)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        state = res.body;
        done(err);
      });
    request(server)
      .put('/api/users/4')
      .set('Content-Type', 'application/json')
      .send(newUser)
      .end(function(err, res){
// 1. Проверить, что при запросе с неправильным id ответ 404 и содержит хедеры
        expect(res.status).toEqual(404);
        expect(res.headers['content-type']).toBeDefined();
        expect(res.headers['content-type']).toEqual('application/json');
        done();
      });
    request(server)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
//      Проверить, что он не записался
        expect(res.body).toEqual(state);
        done(err);
      });
  });
});
// H. Некорректная обработка запроса на удаление
describe('H', function(){
  it('1,2,3', function(done){
    var state;
    request(server)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        state = res.body;
        done(err);
      });
    request(server)
      .del('/api/users/1')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        _.remove(state, {id: '1'})
// 1. Проверить, что дает статус 204, если указать Content-Type application/json.
        expect(res.status).toEqual(204);
// 2. Проверить, что ответ сервера содержит Content-Type application/json.
        expect(res.headers['content-type']).toBeDefined();
        expect(res.headers['content-type']).toEqual('application/json');
        done(err);
      });
    request(server)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
// 3. Проверить, что после успешного запроса на удаление - пользователя нет на сервере.
        expect(res.body).toEqual(state);
        done(err);
      });
  });
});

// I. Некорректная обработка неверного запроса на удаление
describe('I', function(){
  it('1', function(done){
    var state;
    request(server)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        state = res.body;
        done(err);
      });
    request(server)
      .del('/api/users/1')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
// 1. Проверить, что DELETE запрос на /api/users/НЕСУЩЕСТВУЮЩИЙ_ID возвращает 404.
        expect(res.status).toEqual(404);
        expect(res.headers['content-type']).toBeDefined();
        expect(res.headers['content-type']).toEqual('application/json');
        done();
      });
    request(server)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
// 2. Проверить, что после некорректного запроса состояние не меняется.
        expect(res.body).toEqual(state);
        done(err);
      });
  });
});

// J. Некорректная обработка некорректной роли
describe('J', function(){
  it('1', function(done){
    var newEntry = {
      name:'Kyzya',
      phone:'+380000000123',
      role:'HZ'
    };
    var state;
    request(server)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        state = res.body;
        done(err);
      });
    request(server)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(newEntry)
      .end(function(err, res){
// 1. Проверить, что при POST запросе с неправильной ролью ответ 401 и содержит хедеры
        expect(res.status).toEqual(401);
        expect(res.headers['content-type']).toBeDefined();
        expect(res.headers['content-type']).toEqual('application/json');
        done();
      });
    request(server)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .end(function(err, res){
// 2. Проверить, что после некорректного запроса состояние не меняется.
        expect(res.body).toEqual(state);
        done(err);
      });
  });
});

// K. Некорректная обработка запроса без роли
describe('K', function(){
  it('1', function(done){
    var newOne = {
      name:'Vasay',
      phone:'+38000000234'
    };
    request(server)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(newOne)
      .end(function(err, res){
        console.log(1, res.body);
// 1. Проверить, что при POST запросе без роли ответ идет 204 и содержит хедеры
        expect(res.status).toEqual(204);
        expect(res.headers['content-type']).toBeDefined();
        expect(res.headers['content-type']).toEqual('application/json');
        done();
      });
  });
});

// L. Некорректная обработка запроса на создание администратора
describe('L', function(){
  it('1', function(done){
    var newAdmin = {
      name: 'Admin Anna',
      phone: '+380500000001',
      role: 'Administrator'
    };
    request(server)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(newAdmin)
      .end(function(err, res){
// 1. Проверить, что при запросе на создание администратора ответ 204 с хедерами
        expect(res.status).toEqual(204);
        expect(res.headers['content-type']).toBeDefined();
        expect(res.headers['content-type']).toEqual('application/json');
        done();
      });
  });
});
// M. Некорректная обработка запроса на создание помощника
describe('H', function(){
  it('1', function(done){
    var newSupport = {
      name: 'Odessyt',
      phone: '+380000000000',
      role: 'Support',
      location: 'Odessa mama'
    };
    request(server)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(newSupport)
      .end(function(err, res){
// 1. Проверить, что при запросе на создание помощника ответ 204 с хедерами
        expect(res.status).toEqual(204);
        expect(res.headers['content-type']).toBeDefined();
        expect(res.headers['content-type']).toEqual('application/json');
        done();
      });
  });
});
