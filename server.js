// import Ticket from './src/Ticket';
const { Ticket } = require('./src/Ticket');

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const { TicketFull } = require('./src/TicketFull');

const app = new Koa();

const tickets = [
  new TicketFull('Поменять краску в принтере', false, 'Принтер HP 1210'),
  new TicketFull('Установить обновления ПО', true, 'каб. 201, каб. 301')
];

// app.use(koaBody({
//   urlencoded: true,
// }));

app.use((ctx, next) => {
  // console.log('i am one');
  console.log(ctx.headers);
  // ctx.response.body = 'server response';
  next();
});

app.use(async (ctx) => {
  // const { method } = ctx.request.querystring;
  const method = 'createTicket';

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
      return;

    default:
      ctx.response.status = 404;
      return;
  }
});

const server = http.createServer(app.callback());
const port = 5050;

server.listen(port, (err) => {
  if (err) {
    console.log('ошибка в listen', err);
    return;
  }
  console.log(`Server is listening to ${port}`);
});
