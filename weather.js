const apiURL = "https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json";

const getWeatherData = (url) => {
  return fetch(url);
};

const button = document.querySelector("button");

button.addEventListener("click", () => {
  getWeatherData(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTPエラー:${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log({data});
      const weatherContainer = document.getElementById("weatherData");
      weatherContainer.innerHTML = "";

      // 日付取得
      const timeDefines = data[0].timeSeries[0].timeDefines;

      // 東京地方の天気予報データ取得
      const areas = data[0].timeSeries[0].areas;
      console.log({ areas });

      // 日付行を作成
      const dateRow = document.createElement("tr");
      const dateHeader = document.createElement("th")
      dateHeader.textContent = "日付";
      dateRow.appendChild(dateHeader)
      timeDefines.forEach((date) => {
        const dateCell = document.createElement("th");
        dateCell.textContent = date;
        dateRow.appendChild(dateCell);
      });
      weatherContainer.appendChild(dateRow);

      // 各地域ごとの情報を追加
      areas.forEach((tokyoArea) => {
        const row = document.createElement("tr");
        const areaName = tokyoArea.area.name;

        // 地域名をthに設定
        const areaCell = document.createElement("th");
        areaCell.textContent = areaName;
        row.appendChild(areaCell);

        // 天気の画像追加
        const weatherCodeRow = document.createElement("tr");
        const weatherCodeHeader = document.createElement("th");
        weatherCodeHeader.textContent = "天気";
        weatherCodeRow.appendChild(areaCell);
        weatherCodeRow.appendChild(weatherCodeHeader);

        tokyoArea.weatherCodes.forEach((weatherCode) => {
          const weatherCodeCell = document.createElement("td");
          const weatherImg = document.createElement("img");

          // 天気コードに基づいて画像URLを生成
          const imageUrl = `https://www.jma.go.jp/bosai/forecast/img/${weatherCode}.svg`;
          weatherImg.src = imageUrl;
          weatherCodeCell.appendChild(weatherImg);
          weatherCodeRow.appendChild(weatherCodeCell);
        });
        weatherContainer.appendChild(weatherCodeRow);

        // 天気の情報追加
        const weatherRow = document.createElement("tr");
        tokyoArea.weathers.forEach((weather) => {
          const weatherCell = document.createElement("td");
          weatherCell.textContent = weather;
          weatherRow.appendChild(weatherCell);
        });
        weatherContainer.appendChild(weatherRow);

        // 風の情報追加
        const windRow = document.createElement("tr");
        const windHeader = document.createElement("th");
        windHeader.textContent = "風";
        windRow.appendChild(windHeader);

        tokyoArea.winds.forEach((wind) => {
          const windCell = document.createElement("td");
          windCell.textContent = wind;
          windRow.appendChild(windCell);
        });

        weatherContainer.appendChild(windRow);

        // 波の情報追加
        const waveRow = document.createElement("tr");
        const waveHeader = document.createElement("th");
        waveHeader.textContent = "波";
        waveRow.appendChild(waveHeader);

        tokyoArea.waves.forEach((wave) => {
          const waveCell = document.createElement("td");
          waveCell.textContent = wave;
          waveRow.appendChild(waveCell);
        });

        weatherContainer.appendChild(waveRow);
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

// Todo:降水確率取得　data[0].timeSeries[1].areas.pops;
// Todo:気温取得　　　data[0].timeSeries[2].areas.area; data[0].timeSeries[2].areas.temps; 
// Todo:デザイン調整