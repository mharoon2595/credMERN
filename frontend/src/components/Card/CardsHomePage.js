import React, { useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import CardStructure from "./CardStructure";
import CardContext from "../../context/context";
import { useNavigate, useParams } from "react-router-dom";

const CardsHomePage = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const id = useParams().id;
  const auth = useContext(CardContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("auth---->", auth.token);
    const fetchData = async () => {
      try {
        const data = await fetch(`http://localhost:8000/cards/${id}`);
        console.log("response--->", data);
        const res = await data.json();
        setCards(res.cards);
        setIsLoading(false);
      } catch (err) {
        swal("Oops!", err.message, "error");
        setIsLoading(false);
        return;
      }
    };
    fetchData();
  }, []);

  if (!auth.isLoggedIn) {
    navigate("/");
  }

  const reloadCards = (id) => {
    return setCards(cards.filter((item) => item.id !== id));
  };

  return (
    <>
      {isLoading ? (
        <div className="min-h-[90%] bgImage2 flex flex-col items-center p-2">
          <div
            className={`w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] animate-pulse bg-slate-300 rounded-md relative overflow-hidden min-h-64 sm:h-52 my-2`}
          ></div>
          <div
            className={`w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] animate-pulse bg-slate-300 rounded-md relative overflow-hidden min-h-64 sm:h-52 my-2`}
          ></div>
        </div>
      ) : (
        <div className="min-h-[90%] bgImage2 flex flex-col items-center p-2">
          {!cards || cards.length === 0 ? (
            <div className="flex flex-col gap-2">
              <div>No cards found</div>
              <button className="bg-green-500 rounded-md p-2">
                Add one now
              </button>
            </div>
          ) : (
            cards.map((card, index) => (
              <CardStructure
                key={card.id}
                card={card}
                reload={reloadCards}
                index={index}
              />
            ))
          )}
        </div>
      )}
    </>
  );
};

export default CardsHomePage;
