export default function changedData(startDate) {
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
