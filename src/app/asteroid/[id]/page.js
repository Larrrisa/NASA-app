"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MainStyle from "src/app/styles/Main.module.css";
import Asteroid from "src/app/styles/Asteroid.module.css";

export default function ExampleClientComponent() {
  const params = useParams();
  const [results, setResults] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const results = await fetch(
        `https://api.nasa.gov/neo/rest/v1/neo/${params.id}?api_key=cJyupV6nBeNhxsRE5LXgg3tjG2cTOXJSDn6ZRQ05`
      ).then((res) => res.json());

      setResults(results);
    };
    fetchData();
  }, []);

  return (
    <div className={Asteroid.main}>
      <p>Название астероида: {results.name}</p>
      <p>Опасен: {results.is_potentially_hazardous_asteroid ? `Да` : `Нет`}</p>
    </div>
  );
}
