import React, { useContext, useState } from "react";
import VISA from "../../assets/VISA.png";
import MasterCard from "../../assets/MasterCard.png";
import Modal from "../../utils/Modal";
import Backdrop from "../../utils/Backdrop";
import { Link } from "react-router-dom";
import CardContext from "../../context/context";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const cardStyle = {
  VISA: "bg-gradient-to-r from-cyan-500 to-blue-500",
  MasterCard: "bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400",
};

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const monthsIfCurrentYear = () => {
  const months = [];
  const currMonth = new Date().getMonth();
  for (let i = 1; i <= currMonth; i++) {
    months.push(i);
  }
  return months;
};

const CardStructure = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [chosenYear, setChosenYear] = useState("");
  const [chosenMonth, setChosenMonth] = useState("");
  const auth = useContext(CardContext);
  const navigate = useNavigate();

  const statementsHandler = () => {
    setShowModal(false);
    setShowStatementModal(true);
  };

  const { name, number, type, statements, outstandingAmount, id } = props.card;

  const cardDetails =
    type +
    " " +
    "XXXX" +
    " " +
    number.slice(number.length - 5, number.length - 1);

  const billHandler = () => {
    auth.addStatement(statements, outstandingAmount, cardDetails, id);
  };

  console.log("stataements from cardStructure--->", statements);
  console.log("MONTHS--->", chosenYear);
  console.log("IF CURR YEAR--->", monthsIfCurrentYear());

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const selectedYear = formData.get("year");
    const selectedMonth = formData.get("month");

    const fetchStatement = async () => {
      try {
        const sendData = await fetch(
          `http://localhost:8000/cards/${id}/statements/${selectedYear}/${selectedMonth}`,
          {
            headers: { Authorization: "Bearer " + auth.token },
          }
        );
        const response = await sendData.json();
        auth.addStatement(
          response.transactionsList,
          outstandingAmount,
          cardDetails,
          id,
          selectedMonth,
          selectedYear
        );
      } catch (err) {
        swal("Oops!", "Something went wrong, please try again", "error");
      }
    };
    fetchStatement();
    navigate("/cards/statement");
  };

  return (
    <>
      {showModal && <Backdrop onClick={() => setShowModal(false)} />}
      {showModal && (
        <Modal>
          <div className="text-center">
            Viewing for <span className="font-bold">{type}</span> ending with{" "}
            <span className="font-bold">
              XXXX {number.slice(number.length - 5, number.length - 1)}{" "}
            </span>
          </div>
          <div className="flex gap-2 justify-evenly p-4">
            <button
              className="bg-yellow-400 text-black rounded-md p-2"
              onClick={statementsHandler}
            >
              View statements
            </button>
            <button
              className="bg-yellow-400 text-black rounded-md p-2"
              onClick={billHandler}
            >
              <Link to="/cards/billing">Pay bill</Link>
            </button>
          </div>
        </Modal>
      )}
      {showStatementModal && (
        <Backdrop onClick={() => setShowStatementModal(false)} />
      )}
      {showStatementModal && (
        <Modal>
          <div className="text-center p-2">
            Choose the year and month for{" "}
            <span className="font-bold">{type}</span> ending with{" "}
            <span className="font-bold">
              XXXX {number.slice(number.length - 5, number.length - 1)}{" "}
            </span>
          </div>
          <form onSubmit={submitHandler} className="p-2 text-center">
            <div className="flex gap-4 justify-center p-2">
              <div>
                <label htmlFor="year">Choose a year : </label>
                <select
                  id="year"
                  name="year"
                  onChange={(event) => {
                    const selectedYear = event.target.value;
                    setChosenYear(selectedYear);
                  }}
                  className="border border-black"
                >
                  {statements.map((item) => (
                    <option value={item.year}>{item.year}</option>
                  ))}
                </select>
              </div>
              <div>
                {chosenYear &&
                parseInt(chosenYear) === new Date().getFullYear() ? (
                  <>
                    <label htmlFor="month">Choose a month : </label>
                    <select
                      id="month"
                      name="month"
                      className="border border-black"
                      value={chosenYear}
                    >
                      {monthsIfCurrentYear().map((item) => (
                        <option value={item}>{item}</option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <label htmlFor="month">Choose a month : </label>
                    <select
                      id="month"
                      name="month"
                      className="border border-black"
                      onChange={(event) => setChosenMonth(event.target.value)}
                      value={chosenMonth}
                    >
                      {months.map((item) => (
                        <option value={item}>{item}</option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            </div>
            <button type="submit" className="bg-green-400 rounded-md p-2 my-2">
              View statement
            </button>
          </form>
        </Modal>
      )}
      <div className="w-[90%] sm:w-[60%] md:w-[40%] lg:w-[30%]  bg-gradient-to-r from-cyan-500 to-blue-500   rounded-md relative h-52 p-2">
        <p className="absolute bottom-20 left-5 text-white text-xl">
          {name.length > 14 ? name.split(" ")[0] : name}
        </p>
        <p className="absolute bottom-10 left-5 text-white text-xl">
          XXXX {number.slice(number.length - 5, number.length - 1)}
        </p>
        <img src={VISA} className="absolute right-5 top-5 w-[90px] h-15" />
        <button
          className="absolute right-5 bottom-10 bg-slate-200 shadow-lg hover:scale-105 rounded-md p-2"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Pay bill/view statements
        </button>
      </div>
    </>
  );
};

export default CardStructure;
