import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import CardContext from "./context/context";
import HomePage from "./components/Home/HomePage";
import Login from "./components/User/Login";
import Signup from "./components/User/Signup";
import { useEffect, useState, useCallback } from "react";
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
        path: "/:id/cards",
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
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [id, setId] = useState("");
  const [month, setMonth] = useState("");
  const [expirationTime, setExpirationTime] = useState(null);
  const [year, setYear] = useState("");
  let logoutTimer;

  const login = useCallback((inputToken, username, usrId, expirationTime) => {
    setToken(inputToken);
    setName(username);
    setUserId(usrId);
    const tokenExpiration =
      expirationTime || new Date(new Date().getTime() + 60 * 60 * 1000);
    setExpirationTime(tokenExpiration);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        token: inputToken,
        name: username,
        userId: usrId,
        expiry: tokenExpiration.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setName(null);
    setExpirationTime(null);
    localStorage.removeItem("userData");
  }, []);

  const addStatement = (stm, sum, cardNum, id, month, year) => {
    setStatement(stm);
    setAmount(sum);
    setDetails(cardNum);
    setId(id);
    setMonth(month);
    setYear(year);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data && data.token && new Date(data.expiry) > new Date()) {
      login(data.token, data.name, data.userId, new Date(data.expiry));
    }
  }, []);

  useEffect(() => {
    if (expirationTime && token) {
      const remainingTime =
        new Date(expirationTime).getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, expirationTime, logout]);

  return (
    <CardContext.Provider
      value={{
        token: token,
        isLoggedIn: !!token,
        userId: userId,
        login: login,
        logout: logout,
        addStatement: addStatement,
        cardDetails: {
          statement: statement,
          amount: amount,
          num: details,
          id: id,
        },
        monthAndYear: { month: month, year: year },
        name: name,
      }}
    >
      <RouterProvider router={route} />
    </CardContext.Provider>
  );
}

export default App;
