const apiURL = "https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json";

const weatherData = (url) => {
  return fetch(url);
};

// 外部APIから天気予報のデータ取得
const getWeatherData = async () => {
  try {
    const response = await weatherData(apiURL);
    if (!response.ok) {
      throw new Error(`HTTPエラー:${response.status}`);
    }
    const data = await response.json();
    displayWeatherData(data);
  } catch (e) {
    throw new Error(e.message);
  }
};

const displayWeatherData = (data) => {
  const weatherContainer = document.getElementById("weatherData");
  weatherContainer.innerHTML = "";

  const timeDefines = data[0].timeSeries[0].timeDefines;
  const formattedDates = timeDefines.map(formatDate)
  const areas = data[0].timeSeries[0].areas;

  appendDateRow(weatherContainer, formattedDates);
  areas.forEach((area, index) =>
    appendAreaData(
      weatherContainer,
      area
    )
  );
};

const appendDateRow = (container, formattedDates) => {
  const dateRow = createRowWithHeader(
    "日付",
    formattedDates.map((date) => createCell(date))
  );
  container.appendChild(dateRow);
};

const appendAreaData = (
  container,
  area
) => {
  const areaData = [
    { header: "地域", values: [area.area.name] },
    { header: "天気", values: area.weatherCodes, isImageRow: true },
    { header: `天気情報`, values: area.weathers },
    { header: "風", values: area.winds },
    { header: "波", values: area.waves }
  ];

  areaData.forEach((data) =>
    appendWeatherRow(container, data.header, data.values, data.isImageRow)
  );
};

const appendWeatherRow = (container, headerText, data, isImageRow = false) => {
  const row = createRowWithHeader(
    headerText,
    data.map((item) => {
      return createCell(item, isImageRow);
    })
  );
  container.appendChild(row);
};


const createRowWithHeader = (headerText, cells) => {
  const row = document.createElement("tr");
  row.appendChild(createHeaderCell(headerText));
  cells.forEach((cell) => row.appendChild(cell));
  return row;
};

const createCell = (item, isImageRow = false) => {
  const cell = document.createElement(isImageRow ? "td" : "th");
  if (isImageRow) {
    const img = document.createElement("img");
    img.src = `https://www.jma.go.jp/bosai/forecast/img/${item}.svg`;
    cell.appendChild(img);
  } else {
    cell.textContent = item;
  }
  return cell;
};


const createHeaderCell = (text) => {
  const cell = document.createElement("th");
  cell.textContent = text;
  return cell;
};

document
  .getElementById("getWeatherBtn")
  .addEventListener("click", getWeatherData);

const formatDate = (dateString) => {
  const date = new Date(dateString);

  // 月を取得
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // 曜日を取得
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[date.getDay()];

  return `${month}月${day}日（${weekday}）`;
};
