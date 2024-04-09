import React, { useContext, useEffect, useRef, useState } from "react";
import VISA from "../../assets/VISA.png";
import MasterCard from "../../assets/MasterCard.png";
import JCB from "../../assets/JCB.png";
import AMEX from "../../assets/Amex.png";
import DinersClub from "../../assets/DinersClub.png";
import Discover from "../../assets/Discover.png";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../User/formComponents/Input";
import { useForm } from "../../hooks/useForm";
import {
  VALIDATOR_MAX,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MIN,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../utils/validator";
import { useNavigate } from "react-router-dom";
import CardContext from "../../context/context";
import swal from "sweetalert";

function getCreditCardIssuer(cardNumber) {
  cardNumber = cardNumber.replace(/\D/g, "");

  const visaRegex = /^4/;
  const mastercardRegex = /^5[1-5]/;
  const amexRegex = /^3[47]/;
  const discoverRegex = /^6(?:011|5[0-9]{2})/;
  const dinersClubRegex = /^3(?:0[0-5]|[68][0-9])/;
  const JCBregex = /(3(?:088|096|112|158|337|5(?:2[89]|[3-8][0-9]))\d{12})/;

  if (cardNumber.match(visaRegex)) {
    return "VISA";
  } else if (cardNumber.match(mastercardRegex)) {
    return "MasterCard";
  } else if (cardNumber.match(amexRegex)) {
    return "AMEX";
  } else if (cardNumber.match(discoverRegex)) {
    return "Discover";
  } else if (cardNumber.match(dinersClubRegex)) {
    return "DinersClub";
  } else if (cardNumber.match(JCBregex)) {
    return "JCB";
  } else {
    return "Unknown";
  }
}

const cardStyle = {
  VISA: { style: "bg-gradient-to-r from-cyan-500 to-blue-500", image: VISA },
  MasterCard: {
    style: "bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400",
    image: MasterCard,
  },
  JCB: {
    style: "bg-gradient-to-r from-[#aa4b6b] via-[#6b6b83] to-[#3b8d99]",
    image: JCB,
  },
  AMEX: { style: "bg-gradient-to-r from-[#4B79A1] to-[#283E51]", image: AMEX },
  DinersClub: {
    style: "bg-gradient-to-r from-[#544a7d] to-[#ffd452]",
    image: DinersClub,
  },
  Discover: {
    style: "bg-gradient-to-r from-[#654ea3] to-[#eaafc8]",
    image: Discover,
  },
  Unknown: { style: "bg-gradient-to-r from-slate-400 to-slate-700" },
};

const AddCard = () => {
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      month: {
        value: "",
        isValid: false,
      },
      year: {
        value: "",
        isValid: false,
      },
      number: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const navigate = useNavigate();
  const auth = useContext(CardContext);

  console.log(
    "EXPIRY----->",
    formState.inputs.month.value + "/" + formState.inputs.year.value
  );

  const ccType = getCreditCardIssuer(formState.inputs.number.value);

  useEffect(() => {
    if (!auth.token) {
      console.log("aloaloaloooo");
      navigate("/");
    }
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const sentData = await fetch("http://localhost:8000/cards/add", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify({
          name: formState.inputs.name.value,
          expiry:
            formState.inputs.month.value + "/" + formState.inputs.year.value,
          number: formState.inputs.number.value,
          type: ccType,
        }),
      });
      if (!sentData.ok) {
        const errorMessage = await sentData.json();
        await swal("Uh-oh!", errorMessage.message, "error");
        return;
      }
      await swal(
        "Thank you",
        `You have successfully added your card!`,
        "success"
      );
      navigate("/cards");
    } catch (err) {
      await swal("Oops!", `${err.message}`, "error");
    }
  };

  return (
    <>
      {" "}
      <div className="flex flex-col items-center gap-2 p-4">
        <AnimatePresence>
          <motion.div
            className={`w-[90%] sm:w-[60%] md:w-[40%] lg:w-[30%] 
              ${cardStyle[ccType].style}
              rounded-md relative h-52 p-2`}
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.5, ease: "easeOut" }}
          >
            <div className="absolute left-5 bottom-20 text-white">
              Name: {formState.inputs.name.value}
            </div>
            <div className="absolute left-5 bottom-12 text-white">
              Number: {formState.inputs.number.value}
            </div>
            <div className="absolute right-5 bottom-12 text-white">
              Expiry: {formState.inputs.month.value}/
              {formState.inputs.year.value}
            </div>
            {ccType !== "Unknown" && (
              <img
                src={cardStyle[ccType].image}
                className="absolute right-5 top-5 w-[90px] h-15 object-cover"
              ></img>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex flex-col items-center gap-2 p-4">
        <div className="w-[90%] sm:w-[60%] md:w-[40%] lg:w-[30%] bg-slate-200 rounded-md p-2">
          <div className="text-center">Card details</div>
          <form onSubmit={submitHandler}>
            <Input
              id="name"
              element="input"
              type="text"
              placeholder="Name on card"
              label="Name"
              errorText="This is a required field"
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
            />
            <div className="font-bold">Expiry</div>
            <div className="flex gap-2">
              <>
                <Input
                  id="month"
                  element="input"
                  type="text"
                  placeholder="MM"
                  label="MM"
                  errorText="This is a required field"
                  onInput={inputHandler}
                  validators={[VALIDATOR_MIN(1), VALIDATOR_MAX(12)]}
                />
                <Input
                  id="year"
                  element="input"
                  type="text"
                  placeholder="YY"
                  label="YY"
                  errorText="Enter a valid year"
                  onInput={inputHandler}
                  validators={[VALIDATOR_MIN(new Date().getFullYear() % 100)]}
                />
              </>
            </div>
            <Input
              id="number"
              element="input"
              type="text"
              placeholder="Card number"
              label="Card number"
              errorText="Needs to be 16 characters in length"
              onInput={inputHandler}
              validators={[VALIDATOR_MAXLENGTH(16), VALIDATOR_MINLENGTH(16)]}
            />
            <div className="flex justify-center">
              <button
                type="submit"
                className={`bg-green-400  text-lg w-[50%] h-10 p-1 rounded-md my-4 ${
                  formState.isValid ? "" : "opacity-30"
                }`}
                disabled={!formState.isValid}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCard;
