const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const { TicketFull } = require('./src/TicketFull');

const app = new Koa();
app.use(cors());

// const tickets = [
//   new TicketFull('Поменять краску в принтере', false, 'Принтер HP 1210'),
//   new TicketFull('Установить обновления ПО', true, 'каб. 201, каб. 301')
// ];

let tickets = [];

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true
}));

// устанавливаем разрешение на использование других методов при preflight-запросах
// app.use(async (ctx, next) => {
//   if (ctx.request.method !== 'OPTIONS') {
//     next();
//     return;
//   }

//   ctx.response.set('Access-Control-Allow-Origin', '*');
//   ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');
//   ctx.response.status = 204;

//   next();
// });

app.use(async (ctx, next) => {
  console.log('ctx.request.body - ', ctx.request.body);
  console.log('ctx.request.query.method - ', ctx.request.query.method);
  let { method } = ctx.request.query;

  // if (ctx.request.method === 'GET') {
  //   ({ method } = ctx.request.query);
  // }

  // if (ctx.request.method === 'POST') {
  //   ({ method } = ctx.request.body);
  // }

  // ctx.response.set('Access-Control-Allow-Origin', '*');
  // ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));

  console.log('method запроса - ', ctx.request.method);

  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets;
      return;
    case 'ticketById':
      ctx.response.body = tickets.find((t) => t.id === ctx.request.body.id);
      return;
    case 'createTicket':
      const { name, status, description } = ctx.request.body;
      const ticket = new TicketFull(name, status, description);
      tickets.push(ticket);
      console.log(tickets);
      ctx.response.body = ticket;
      return;
    case 'changeTicket':

    case 'deleteTicket':

    default:
      ctx.response.status = 404;
      return;
  }
  // console.log('------------');
  next();
});

const server = http.createServer(app.callback());
const port = 5050;

server.listen(port, (err) => {
  if (err) {
    console.log('------------');
    console.log('ошибка в listen', err);
    return;
  }
  console.log('------------');
  console.log(`Server is listening to ${port}`);
});
