import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Input from "./formComponents/Input";
import { useForm } from "../../hooks/useForm";
import { VALIDATOR_EMAIL } from "../../utils/validator";
import { VALIDATOR_MINLENGTH } from "../../utils/validator";
import CardContext from "../../context/context";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { useScroll } from "framer-motion";
import spinner from "../../assets/spinner.png";
import LoadingSpinner from "../../utils/LoadingSpinner";

const Login = () => {
  const auth = useContext(CardContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formState, inputHandler] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const fetchData = await fetch(
        "https://cloudy-jumper-ox.cyclic.app/users/login",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        }
      );
      if (!fetchData.ok) {
        const errorMessage = await fetchData.json();
        await swal("Oops", errorMessage.message, "error");
        setIsLoading(false);
        return;
      }
      const res = await fetchData.json();
      auth.login(res.token, res.name, res.userId, null);
      setIsLoading(false);
      await swal("Logged in", `You can add/view your cards now`, "success");
      navigate(`/${res.userId}/cards`);
    } catch (err) {
      await swal("Oops!", `${err.message}`, "error");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex bgImage h-[90%] justify-center items-center">
        <div className="z-10 bg-white w-[50%] rounded-md p-2 relative">
          {isLoading && <LoadingSpinner asOverlay />}
          <form className="flex flex-col p-2" onSubmit={submitHandler}>
            <div className="text-center text-lg font-bold">Login</div>
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
                validators={[VALIDATOR_MINLENGTH(6)]}
              />
            </div>

            <div className="flex justify-center ">
              <button
                type="submit"
                className={`bg-green-400 text-lg  h-10 p-1 rounded-md my-4 ${
                  formState.isValid ? "" : "opacity-30"
                }`}
                disabled={!formState.isValid}
              >
                Submit
              </button>
            </div>
            <div className="text-center underline ">
              <Link to="/signup">New user? Please sign up.</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
