import React, { useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import CardStructure from "./CardStructure";
import CardContext from "../../context/context";
import { useNavigate } from "react-router-dom";

const CardsHomePage = () => {
  const [cards, setCards] = useState([]);
  const auth = useContext(CardContext);
  const navigate = useNavigate();

  if (!auth.token) {
    navigate("/");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch("http://localhost:8000/cards", {
          headers: { Authorization: "Bearer " + auth.token },
        });
        console.log("response--->", data);
        const res = await data.json();
        setCards(res.cards);
      } catch (err) {
        swal("Oops!", err.message, "error");
        return;
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-[90%] bg-slate-400 flex flex-col items-center p-2">
      {!cards ? (
        <div className="flex flex-col gap-2">
          <div>No cards found</div>
          <button className="bg-green-500 rounded-md p-2">Add one now</button>
        </div>
      ) : (
        cards.map((card) => <CardStructure card={card} />)
      )}
      {console.log("cards---->", cards)}
    </div>
  );
};

export default CardsHomePage;
