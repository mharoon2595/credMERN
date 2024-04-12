import React from "react";
import Input from "./formComponents/Input";
import { useForm } from "../../hooks/useForm";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../utils/validator";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      if (formState.inputs.password.value !== formState.inputs.confirm.value) {
        swal("Oops!", "Passwords do not match", "error");
        return;
      }
      const data = await fetch("http://localhost:8000/users/signup", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
      });

      if (!data.ok) {
        const errorMessage = await data.json();
        await swal("Oops", errorMessage.message, "error");
        return;
      }
      const res = await data.json();
      console.log("RES FROM SIGNUP--->", res);
      navigate("/login");
      await swal("Alright", "Account created, please login now", "success");
    } catch (err) {
      await swal("Oops", err.message, "error");
    }
  };

  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      confirm: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  return (
    <div className="flex bgImage h-[90%] justify-center items-center">
      <div className="z-10 bg-white w-[50%] rounded-md p-2">
        <form className="flex flex-col p-2" onSubmit={submitHandler}>
          <div className="text-center text-lg font-bold">Signup</div>
          <div className="flex flex-col p-2">
            <Input
              id="name"
              element="input"
              type="text"
              placeholder="Name"
              label="Name"
              errorText="Please type in your name"
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
            />
          </div>
          <div className="flex flex-col p-2">
            <Input
              id="email"
              element="input"
              type="text"
              placeholder="Email"
              label="Email"
              errorText="Please type in a valid email address"
              onInput={inputHandler}
              validators={[VALIDATOR_EMAIL()]}
            />
          </div>
          <div className="flex flex-col p-2">
            <Input
              id="password"
              element="input"
              type="password"
              placeholder="Password"
              label="Password"
              errorText="Please type in a password with atleast 8 characters"
              onInput={inputHandler}
              validators={[VALIDATOR_MINLENGTH(8)]}
            />
          </div>
          <div className="flex flex-col p-2">
            <Input
              id="confirm"
              element="input"
              type="password"
              placeholder="Confirm password"
              label="Confirm password"
              errorText="Please type in a password with atleast 8 characters"
              onInput={inputHandler}
              validators={[VALIDATOR_MINLENGTH(8)]}
            />
          </div>

          <div className="flex justify-center ">
            <button
              type="submit"
              className={`bg-green-400 text-lg w-[50%] h-10 p-1 rounded-md my-4 ${
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
  );
};

export default Signup;
