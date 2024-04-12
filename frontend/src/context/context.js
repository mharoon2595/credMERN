import { createContext } from "react";

const CardContext = createContext({
  isLoggedIn: false,
  token: "",
  userId: "",
  login: () => {},
  addStatement: () => {},
  name: "",
  cardDetails: { statement: "", amount: "", num: "", id: "" },
  monthAndYear: { month: "", year: "" },
  logout: () => {},
});

export default CardContext;
