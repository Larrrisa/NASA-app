"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MainStyle from "src/app/styles/Asteroid.module.css";
import Asteroid from "src/app/styles/Asteroid.module.css";

export default function AsteroidPage() {
  const params = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const AsteroidResult = await fetch(
          `https://api.nasa.gov/neo/rest/v1/neo/${params.id}?api_key=cJyupV6nBeNhxsRE5LXgg3tjG2cTOXJSDn6ZRQ05`
        ).then((res) => res.json());

        setResults(AsteroidResult);
      } catch (error) {
        console.log("ERROR", error);
        throw new Error("Failed to fetch data");
      }
    }

    fetchData();
  }, []);

  return (
    <div className={Asteroid.main}>
      <h1 className={MainStyle.h1}>Название астероида: {results.name}</h1>

      <p>Опасен: {results.is_potentially_hazardous_asteroid ? `Да` : `Нет`}</p>

      <div>
        {results.close_approach_data &&
          results.close_approach_data.map((item, index) => {
            return (
              <div key={index} className={Asteroid.info}>
                <ul>
                  <li>
                    Скорость относительно Земли:
                    {" " +
                      Math.round(item.relative_velocity.kilometers_per_hour)}
                    км/ч
                  </li>
                  <li>
                    Расстояние до Земли:
                    {" " + Math.round(item.miss_distance.kilometers)} км
                  </li>
                  <li>
                    Время максимального сближения с Землей:
                    {" " + item.close_approach_date}
                  </li>
                  <li>По орбите вокруг чего летит: {item.orbiting_body}</li>
                </ul>
              </div>
            );
          })}
      </div>
    </div>
  );
}
