import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Detail() {
  const navigate = useNavigate();

  let id = useParams().id;

  console.log(typeof id)

  const [poke, setPoke] = useState();

  useEffect(() => {

    async function fetchData() {
      try {
        id = check(id, "id")
        const { data } = await axios.get(`/api/pokemon/${id}`);
        setPoke(data);
      } catch (e) {
        navigate("/error");
      }
    }

    fetchData();

  }, []);

  return (
    <div>
      {
        poke ?
          <>
            <h1>{poke.name}</h1>
            <h2>{poke.id}</h2>
            <img src={poke.img}></img>
          </>
          :
          <h1>loading</h1>
      }

    </div>
  )
}

function check(input, type) {
  switch (type) {
    case "pagenum":
      if (!input) throw type + " not valid";
      if (isNaN(input)) throw type + " not valid";
      input = parseInt(input);
      if (input <= 0) throw type + " not valid";
      return input;
    case "id":
      if (!input) throw type + " not valid";
      if (isNaN(input)) throw type + " not valid";
      input = parseInt(input);
      if (input <= 0) throw type + " not valid";
      return input;
    default:
      return false;
  }
}