import { createContext } from "react";

const CardContext = createContext({
  token: "",
  login: () => {},
  addStatement: () => {},
  cardDetails: { statement: "", amount: "", num: "", id: "" },
  monthAndYear: { month: "", year: "" },
});

export default CardContext;
