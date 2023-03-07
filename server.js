const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
// const cors = require('@koa/cors');
const { TicketFull } = require('./src/TicketFull');

const app = new Koa();
// app.use(cors());

// tickets здесь временно
// const tickets = [
//   new TicketFull('Поменять краску в принтере', false, 'Принтер HP 1210'),
//   new TicketFull('Установить обновления ПО', true, 'каб. 201, каб. 301')
// ];

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true
}));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

let tickets = [];

app.use(async (ctx, next) => {
  console.log('ctx.request---', ctx.request);

  if (ctx.request.method === 'GET') {
    console.log('ctx.request.query ---', ctx.request.query);
  }

  if (ctx.request.method === 'POST') {
    ctx.response.set('Content-Type', ctx.request.header['content-type']);
    console.log('ctx.request.body ---', ctx.request.body);
    console.log('ctx.request.query ---', ctx.request.query);
  }

  let { method } = ctx.request.query;

  ctx.response.set('Access-Control-Allow-Origin', '*');

  // let method = 'allTickets';

  switch (method) {
    case 'allTickets':
      // ctx.response.body = 'tickets';
      ctx.response.body = tickets;
      return;
    case 'createTicket':
      // ctx.response.body = 'hiiiiiii';
      const { name, description } = ctx.request.body;
      const ticket = new TicketFull(name, description);
      tickets.push(ticket);
      console.log('tickets - ', tickets);
      ctx.response.body = ticket;
      return;
    case 'deleteTicket':
      ctx.response.body = 'hiiiiiii';
      /*const { id } = ctx.request.query;
      tickets = tickets.filter((t) => t.id !== id);
      ctx.response.body = tickets;
      return;*/
    // case 'changeTicket':

    case 'ticketById':
      ctx.response.body = tickets.find((t) => t.id === ctx.request.body.id);
      return;

    // Отметка о выполнении каждого тикета



    default:
      ctx.response.status = 404;
      return;
  }
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
