import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import Modal from "../../utils/Modal";
import Backdrop from "../../utils/Backdrop";
import { Link } from "react-router-dom";
import CardContext from "../../context/context";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { cardStyle } from "./AddCard.js";

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
  const [deleteModal, setDeleteModal] = useState(false);
  const [chosenYear, setChosenYear] = useState("");
  const [chosenMonth, setChosenMonth] = useState("");
  const auth = useContext(CardContext);
  const navigate = useNavigate();

  const statementsHandler = () => {
    setShowModal(false);
    setShowStatementModal(true);
  };

  const { name, number, type, statements, outstandingAmount, id } = props.card;

  console.log("CARD STYLE--->", cardStyle[type]);

  const cardDetails =
    type +
    " " +
    "XXXX" +
    " " +
    number.slice(number.length - 5, number.length - 1);

  const billHandler = () => {
    const obtainFinalYear = statements.pop();
    const finalYear = obtainFinalYear.year;
    const obtainFinalMonth = obtainFinalYear.month.pop();
    const finalMonth = obtainFinalMonth.month;
    auth.addStatement(
      statements,
      outstandingAmount,
      cardDetails,
      id,
      finalMonth,
      finalYear
    );
  };

  const deleteHandler = async () => {
    try {
      const deleteItem = await fetch(
        `http://localhost:8000/cards/${id}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      if (!deleteItem.ok) {
        const error = await deleteItem.json();
        await swal("Error", error.message, "error");
        return;
      }

      await swal("Card deleted", "Card removed succesfully", "success");
      setDeleteModal(false);
      props.reload(id);
    } catch (err) {
      await swal("Uh-oh", err.message, "error");
      setDeleteModal(false);
    }
  };

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
            <span className="font-bold">XXXX {number.slice(-4)} </span>
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
      {deleteModal && <Backdrop onClick={() => setDeleteModal(false)} />}
      {deleteModal && (
        <Modal>
          <div className="text-center my-2">Are you sure?</div>
          <div className="flex justify-evenly my-2">
            <button
              className="bg-green-500 text-white p-2 rounded-md"
              onClick={deleteHandler}
            >
              {" "}
              Yes
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded-md"
              onClick={() => {
                setDeleteModal(false);
              }}
            >
              {" "}
              No
            </button>
          </div>
        </Modal>
      )}
      <motion.div
        className={`w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] ${cardStyle[type].style} rounded-md relative overflow-hidden min-h-64 sm:h-52 my-2`}
        initial={{ opacity: 0, x: props.index % 2 === 0 ? -100 : 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75 }}
      >
        <div
          className={`absolute top-5 -left-8 w-36 ${
            outstandingAmount === 0 ? "bg-green-500" : "bg-red-500"
          }  text-center origin-center  -rotate-45 text-white overflow-clip`}
        >
          {outstandingAmount === 0 ? "No dues" : "Bill due"}
        </div>
        <div className="p-2">
          <p className="absolute bottom-28 left-5 sm:bottom-20 sm:left-5 text-white text-xl">
            {name.length > 14 ? name.split(" ")[0] : name}
          </p>
          <p className="absolute bottom-20 left-5 sm:bottom-12 sm:left-5 text-white text-xl">
            XXXX {number.slice(-4)}
          </p>
          <img
            src={cardStyle[type].image}
            className="absolute right-5 top-5 w-[90px] h-15"
          />

          <button
            className="absolute right-5 top-[50%] bg-red-500 shadow-lg hover:scale-105 rounded-md p-2 "
            onClick={() => {
              setDeleteModal(true);
            }}
          >
            Delete Card
          </button>

          <button
            className="absolute  right-[50%] translate-x-1/2 sm:right-5 bottom-1 sm:bottom-10 sm:translate-x-0 bg-green-500 shadow-lg hover:scale-105 rounded-md p-2 "
            onClick={() => {
              setShowModal(true);
            }}
          >
            Pay bill/view statements
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default CardStructure;
