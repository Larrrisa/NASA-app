"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Page from "./final/page";
import HeaderStyle from "./styles/Header.module.css";
import MainStyle from "./styles/Main.module.css";
import Basket from "./styles/Basket.module.css";
import Image from "next/image";

export default function Home() {
  const currentDate = new Date();
  const [asteroidsList, setAsteroidsList] = useState([]);
  const [startDate, setStartDate] = useState(
    `${currentDate.getUTCFullYear()}-${String(
      currentDate.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getUTCDate()).padStart(2, "0")}`
  );
  const [fetching, setFetching] = useState(true);
  const [measures, setMeasures] = useState("kilometers");
  const [buttonStates, setButtonStates] = useState({});
  const [basket, setBasket] = useState([]);

  useEffect(() => {
    if (fetching) {
      async function getData() {
        try {
          const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=cJyupV6nBeNhxsRE5LXgg3tjG2cTOXJSDn6ZRQ05`;

          const response = await fetch(url);
          const res = await response.json();
          setAsteroidsList([
            ...asteroidsList,
            ...res.near_earth_objects[startDate],
          ]);

          setStartDate(
            `${new Date(startDate).getFullYear()}-${String(
              new Date(startDate).getMonth() + 1
            ).padStart(2, "0")}-${String(
              new Date(startDate).getDate() + 1
            ).padStart(2, "0")}`
          );
          setFetching(false);
        } catch (error) {
          console.log("ERROR", error);
          throw new Error("Failed to fetch data");
        }
      }
      getData();
    }
  }, [fetching]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return function () {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //date
  const endDate = `${new Date(startDate).getFullYear()}-${String(
    new Date(startDate).getMonth() + 1
  ).padStart(2, "0")}-${String(new Date(startDate).getDate() + 1).padStart(
    2,
    "0"
  )}`;

  function handleScroll(e) {
    if (
      e.target.documentElement.scrollHeight -
        (window.innerHeight + e.target.documentElement.scrollTop) <
      100
    )
      setFetching(true);
  }

  function handleMeasureClick() {
    if (measures === "kilometers") {
      setMeasures("lunar");
    } else setMeasures("kilometers");
  }

  function handleOrderClick(id, e) {
    if (e.target.id === id && !buttonStates[id]) {
      setButtonStates({ ...buttonStates, [id]: true });
      setBasket([...basket, e.target.id]);
    } else if (e.target.id === id && buttonStates[id] === true) {
      setButtonStates({ ...buttonStates, [id]: false });
      setBasket(basket.filter((item) => item !== id));
    }
  }

  function shortName(item) {
    const start = item.indexOf("(") + 1;
    const end = item.indexOf(")");
    const shorter = item.slice(start, end);
    return shorter;
  }

  function changedData(startDate) {
    const data = startDate.split("-");
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

  function countBasketItems() {
    if (basket.length >= 5 && basket.legth <= 20) {
      return `${basket.length} астероидов`;
    } else if (String(basket.length).includes("1")) {
      return `${basket.length} астероид`;
    } else if (
      String(basket.length).includes("2") ||
      String(basket.length).includes("3") ||
      String(basket.length).includes("4")
    ) {
      return `${basket.length} астероида`;
    } else return `${basket.length} астероидов`;
  }

  return (
    <div>
      <div className={HeaderStyle.container}>
        <div className={HeaderStyle.header}>Armageddon 2023</div>
        <div>
          <p className={HeaderStyle.text}>ООО “Команда им. Б. Уиллиса”</p>.
          <p className={HeaderStyle.text}>Взрываем астероиды с 1998 года.</p>
        </div>
      </div>
      <main className={MainStyle.container}>
        <h1 className={MainStyle.h1}>
          Ближайшие
          <br /> подлеты
          <br /> астероидов
        </h1>
        <div className={MainStyle.measures}>
          <div
            className={`${MainStyle.measureskm} ${
              setMeasures === "kilometers" ? MainStyle.activemesure : ""
            }`}
            onClick={handleMeasureClick}
          >
            в километрах
          </div>
          <div
            className={`${
              setMeasures === "lunar" ? MainStyle.activemesure : ""
            }`}
            onClick={handleMeasureClick}
          >
            в лунных орбитах
          </div>
        </div>

        <div>
          {asteroidsList.map((item) => {
            return (
              <div key={item.id} className={MainStyle.bottom}>
                <div className={MainStyle.date}>{changedData(startDate)}</div>
                <div className={MainStyle.info}>
                  <div className={MainStyle.distance}>
                    {measures === "kilometers"
                      ? Math.round(
                          item.close_approach_data[0].miss_distance.kilometers
                        ) + " км"
                      : Math.round(
                          item.close_approach_data[0].miss_distance.lunar
                        ) + " лунные орбиты"}
                  </div>

                  <div>
                    <Image
                      className={MainStyle.asteroidImg}
                      src="/small.png"
                      alt="small_asteroid"
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>
                    <div className={MainStyle.name}>
                      <Link href={`/asteroid/${item.id}`}>
                        {shortName(item.name)}
                      </Link>
                    </div>
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
                <div>
                  <div className={MainStyle.buttons}>
                    <button
                      className={`${MainStyle.button} ${
                        buttonStates[item.id] ? MainStyle.buttonChosen : ""
                      }`}
                      id={item.id}
                      onClick={(e) => handleOrderClick(item.id, e)}
                    >
                      {buttonStates[item.id] ? "В корзине" : "Заказать"}
                    </button>
                    <div>
                      {item.is_potentially_hazardous_asteroid
                        ? "⚠️ Опасен"
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <div className={Basket.main}>
        <div>
          <p>Корзина</p>
          <p className={Basket.countItems}>
            {basket.length === 0 ? `пуста` : countBasketItems(basket)}
          </p>
        </div>
        <Link
          href={{
            pathname: "/final",
            query: { basket },
            state: { measures, shortName, startDate },
          }}
          className={Basket.button}
        >
          Отправить
        </Link>
      </div>
    </div>
  );
}
