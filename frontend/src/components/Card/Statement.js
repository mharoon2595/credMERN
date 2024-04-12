import React, { useContext } from "react";
import CardContext from "../../context/context";

export const Statement = () => {
  const auth = useContext(CardContext);
  const transactions = auth.cardDetails.statement;

  const monthInWords = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const sum = transactions.reduce(
    (acc, currValue) => (acc += currValue.amount),
    0
  );

  return (
    <>
      <div className="p-2">
        Transactions for the month of{" "}
        <span className="font-bold">
          {monthInWords[auth.monthAndYear.month]}, {auth.monthAndYear.year}{" "}
        </span>
        <div className="relative">
          {transactions.map((item) => (
            <div className="bg-slate-200 p-2 rounded-md my-2 relative">
              <div>Vendor: {item.vendor}</div>
              <div>Category: {item.category}</div>
              <div
                className={
                  item.type === "Credit"
                    ? "text-green-500 font-semibold"
                    : "text-red-500 font-semibold"
                }
              >
                Type: {item.type}
              </div>
              <div className="absolute right-5 bottom-2 font-bold">
                Amount: ₹{item.amount}
              </div>
            </div>
          ))}
          <div className="text-center px-2 mt-2 text-lg font-bold">
            Net total: ₹{sum}
          </div>
        </div>
      </div>
    </>
  );
};
