import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import CardContext from "../../context/context";
import Input from "../User/formComponents/Input";
import { VALIDATOR_MIN, VALIDATOR_MAX } from "../../utils/validator";
import { useForm } from "../../hooks/useForm";
import swal from "sweetalert";
import Modal from "../../utils/Modal";

const Billing = () => {
  const [success, setSuccess] = useState(false);
  const [formState, inputHandler] = useForm(
    {
      amount: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const navigate = useNavigate();
  const auth = useContext(CardContext);

  useEffect(() => {
    if (!auth.token) {
      navigate("/");
    }
  }, [auth.token, navigate]);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const sentData = await fetch(
        `https://cloudy-jumper-ox.cyclic.app/cards/${auth.cardDetails.id}/pay`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify({
            amount: formState.inputs.amount.value,
          }),
        }
      );
      if (!sentData.ok) {
        const errorMessage = await sentData.json();
        await swal("Oops", errorMessage.message, "error");
        return;
      }
      const secondFetch = await fetch(
        `https://cloudy-jumper-ox.cyclic.app/cards/${auth.cardDetails.id}/statements/${auth.monthAndYear.year}/${auth.monthAndYear.month}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify({
            credit: {
              vendor: "Credit",
              category: "Credit",
              type: "Credit",
              amount: formState.inputs.amount.value,
            },
          }),
        }
      );
      if (!secondFetch.ok) {
        const errorMessage = await secondFetch.json();
        await swal("Oops", errorMessage.message, "error");
        return;
      }

      auth.addStatement([], "", "", "");
      await swal(
        "Thank you",
        `You have successfully paid ₹${formState.inputs.amount.value}`,
        "success"
      );

      navigate(`/${auth.userId}/cards`);
    } catch (err) {
      await swal("Oops!", `${err.message}`, "error");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center p-2">
        <div className="my-2">
          Showing for <span className="font-bold">{auth.cardDetails.num}</span>
        </div>
        <div className="my-2">
          Bill due:{" "}
          <span className="font-bold">₹{auth.cardDetails.amount}</span>
        </div>
        <form className="text-center" onSubmit={submitHandler}>
          <Input
            id="amount"
            element="input"
            type="text"
            placeholder="Enter an amount"
            label="Amount"
            errorText="Please type in a value between 10 and the oustanding amount."
            onInput={inputHandler}
            validators={[
              VALIDATOR_MIN(10),
              VALIDATOR_MAX(auth.cardDetails.amount),
            ]}
          />
          <button
            type="submit"
            className={`bg-green-400 text-lg w-[50%] h-10 p-1 rounded-md my-4 ${
              formState.isValid ? "" : "opacity-30"
            }`}
            disabled={!formState.isValid}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Billing;
