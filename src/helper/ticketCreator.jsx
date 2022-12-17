import "./Ticket.css";

import ticket from "../assets/cutopia.png";

const TicketCreator = (name, email, personStatus) => {
  return (
    <article className="article">
      <picture className="picture">
        <source media="(min-width: 0px)" srcSet={ticket} />
        <img src={ticket} alt="ticket" />
      </picture>
      <h1 className="header">Test test</h1>
    </article>
  );
};

export default TicketCreator;
