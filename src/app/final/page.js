"use client";

import { useState, useEffect } from "react";
import MainStyle from "../styles/Main.module.css";
import HeaderStyle from "../styles/Header.module.css";
import Image from "next/image";

export default function Page({ searchParams }) {
  const [finalBasket, setFinalBasket] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.all(
        searchParams.basket.map((item) =>
          fetch(
            `https://api.nasa.gov/neo/rest/v1/neo/${item}?api_key=cJyupV6nBeNhxsRE5LXgg3tjG2cTOXJSDn6ZRQ05`
          ).then((res) => res.json())
        )
      );
      setFinalBasket(results);
    };
    fetchData();
  }, [searchParams.basket]);

  function shortName(item) {
    const start = item.indexOf("(") + 1;
    const end = item.indexOf(")");
    const shorter = item.slice(start, end);
    return shorter;
  }

  return (
    <div>
      <div className={HeaderStyle.container}>
        <div className={HeaderStyle.header}>Armageddon 2023</div>
        <p className={HeaderStyle.text}>ООО “Команда им. Б. Уиллиса”</p>.
        <p className={HeaderStyle.text}>Взрываем астероиды с 1998 года.</p>
      </div>
      <main className={MainStyle.container}>
        <h1 className={MainStyle.h1}>Заказ отправлен!</h1>
        {finalBasket.map((item) => (
          <div key={item.id} className={MainStyle.bottom}>
            <div className={MainStyle.date}>{searchParams.startDate}</div>
            <div className={MainStyle.info}>
              <div className={MainStyle.distance}>
                {searchParams.measures === "kilometers"
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
          </div>
        ))}
      </main>
      <p className={MainStyle.copyright}>© Все права и планета защищены</p>
    </div>
  );
}
