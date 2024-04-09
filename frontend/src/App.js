import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import CardContext from "./context/context";
import HomePage from "./components/Home/HomePage";
import Login from "./components/User/Login";
import Signup from "./components/User/Signup";
import { useState } from "react";
import CardsHomePage from "./components/Card/CardsHomePage";
import Billing from "./components/Card/Billing";
import { Statement } from "./components/Card/Statement";
import AddCard from "./components/Card/AddCard";

const route = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        path: "/cards",
        element: <CardsHomePage />,
      },
      {
        path: "/cards/billing",
        element: <Billing />,
      },
      { path: "/cards/statement", element: <Statement /> },
      { path: "/add", element: <AddCard /> },
    ],
  },
]);

function App() {
  const [token, setToken] = useState("");
  const [statement, setStatement] = useState([]);
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [id, setId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const login = (temp) => {
    setToken(temp);
  };

  const addStatement = (stm, sum, cardNum, id, month, year) => {
    setStatement(stm);
    setAmount(sum);
    setDetails(cardNum);
    setId(id);
    setMonth(month);
    setYear(year);
  };

  return (
    <CardContext.Provider
      value={{
        token: token,
        login: login,
        addStatement: addStatement,
        cardDetails: {
          statement: statement,
          amount: amount,
          num: details,
          id: id,
        },
        monthAndYear: { month: month, year: year },
      }}
    >
      <RouterProvider router={route} />
    </CardContext.Provider>
  );
}

export default App;
