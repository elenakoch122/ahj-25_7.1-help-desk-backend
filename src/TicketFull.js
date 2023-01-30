const { Ticket } = require("./Ticket");

class TicketFull extends Ticket {
  constructor(name, status, description) {
    super(name, status);
    this.description = description; // полное описание
  }
}

module.exports = {
  TicketFull
};
