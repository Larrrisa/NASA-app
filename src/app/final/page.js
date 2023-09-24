"use client";

import { useState, useEffect } from "react";

import MainStyle from "../styles/Main.module.css";
import BasketStyle from "../styles/Basket.module.css";
import HeaderStyle from "../styles/Header.module.css";
import Image from "next/image";

export default function BasketPage({ searchParams }) {
  const [finalBasket, setFinalBasket] = useState([]);
  const dates = JSON.parse(searchParams.dateAsString);

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.all(
        dates.map((item) =>
          fetch(
            `https://api.nasa.gov/neo/rest/v1/neo/${item.id}?api_key=cJyupV6nBeNhxsRE5LXgg3tjG2cTOXJSDn6ZRQ05`
          ).then((res) => res.json())
        )
      );

      setFinalBasket(results);
    };

    fetchData();
  }, [dates]);

  function shortName(item) {
    const start = item.indexOf("(") + 1;
    const end = item.indexOf(")");
    const shorter = item.slice(start, end);
    return shorter;
  }

  function changedData(item) {
    const data = item.split("-");
    const months = [
      "янв",
      "фев",
      "мар",
      "апр",
      "мая",
      "июня",
      "июля",
      "авг",
      "сент",
      "окт",
      "нояб",
      "дек",
    ];
    const day = data[2];
    const month = months[parseInt(data[1]) - 1];
    const year = data[0];
    const properDate = `${day + " "}${month + " "}${year}`;

    return properDate;
  }

  return (
    <div>
      <div className={HeaderStyle.container}>
        <div className={HeaderStyle.header}>Armageddon 2023</div>
        <div>
          <p className={HeaderStyle.text}>ООО “Команда им. Б. Уиллиса”</p>
          <p className={HeaderStyle.text}>Взрываем астероиды с 1998 года</p>
        </div>
      </div>
      <main className={MainStyle.container}>
        <h1 className={BasketStyle.h1}>Заказ отправлен!</h1>
        <div>
          {finalBasket.map((item) => {
            return (
              <div key={item.id} className={MainStyle.bottom}>
                <div className={MainStyle.date}>
                  {dates.map((i) => {
                    if (i.id === item.id) {
                      return changedData(i.date);
                    }
                  })}
                </div>
                <div className={MainStyle.info}>
                  <div className={MainStyle.distance}>
                    {item.close_approach_data
                      .filter((i) => {
                        const date = dates.find((d) => d.id === item.id);
                        return date && i.close_approach_date === date.date;
                      })
                      .map((approach) => (
                        <div key={item.id}>
                          {searchParams.measures === "kilometers"
                            ? Math.round(approach.miss_distance.kilometers) +
                              " км"
                            : Math.round(approach.miss_distance.lunar) +
                              " лунные орбиты"}
                        </div>
                      ))}

                    <div className={MainStyle.line}></div>
                  </div>
                  <div className={MainStyle.asteroidImg}>
                    {item.estimated_diameter.meters.estimated_diameter_max &&
                    Math.round(
                      item.estimated_diameter.meters.estimated_diameter_max
                    ) > 1000 ? (
                      <Image
                        src="/big.png"
                        alt="asteroid_img"
                        width={45}
                        height={45}
                      />
                    ) : (
                      <Image
                        src="/big.png"
                        alt="asteroid_img"
                        width={30}
                        height={30}
                      />
                    )}
                  </div>
                  <div>
                    <div className={MainStyle.name}>{shortName(item.name)}</div>

                    <div className={MainStyle.diameter}>
                      <p className={MainStyle.diameterSymbol}>&Oslash;</p>
                      {Math.round(
                        item.estimated_diameter.meters.estimated_diameter_max
                      ) +
                        " " +
                        "м"}
                    </div>
                  </div>
                </div>
                <div className={MainStyle.dangerousasteroid}>
                  {item.is_potentially_hazardous_asteroid ? "⚠️ Опасен" : ""}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <p className={MainStyle.copyright}>© Все права и планета защищены</p>
    </div>
  );
}
