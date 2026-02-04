import { cross } from "./svg_exports/cross.js";
import { leafs } from "./svg_exports/lisce.js";
import { mourning } from "./svg_exports/mourning.js";

const DEFAULT_LAYOUT = {
  crossTop: -218,
  crossLeft: 442,
  imageTop: 140,
  imageLeft: 30,
  yearsTop: -50,
  lightTextMarginTop: 8,
  nameTop: 17,
  boldedMarginTop: 15,
  mourningTop: 240,
  mourningLeft: 366,
  mourningTextMarginTop: 20,
  ozalosceniLeft: -116,
};

export const generateHtml = (image, name, surname, settedValues, layoutSettings = null) => {
  const layout = layoutSettings || DEFAULT_LAYOUT;
  const male = settedValues[0] === "Musko";

  const extractYears = (date) => {
    if (!date || typeof date !== "string") return "";
    const parts = date.split(".");
    return parts.length >= 3 ? parts[2] : date;
  };

  const onlyYearsOfDeath = extractYears(settedValues[4]);

  const getDeathTypeText = (type) => {
    switch (type) {
      case "Nakon krace bolesti":
        return "краће болести.";
      case "Nakon duze bolesti":
        return "дуже болести.";
      case "Nakon teze bolesti":
        return "теже болести.";
      case "Iznenada":
        return "неочекиваних околности.";
      default:
        return "неочекиваних околности.";
    }
  };

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        * {
          -webkit-text-size-adjust: none !important;
          text-size-adjust: none !important;
          box-sizing: border-box;
        }

        @page {
          size: letter landscape;
          margin: 0;
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          font-family: 'Times New Roman', serif;
        }

        body {
          position: relative;
          padding: 40px 50px;
        }

        .container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        img {
          width: 145px !important;
          height: 180px !important;
          object-fit: cover !important;
          position: absolute !important;
          top: ${layout.imageTop}px;
          left: ${layout.imageLeft}px;
          border: 2px solid #333;
          z-index: 2;
        }

        .cross-svg {
          text-align: center;
          margin-bottom: 322px;
          margin-right: 100px !important;
        }

        .birth-death-years {
          font-weight: bold;
          font-size: 32px !important;
          text-align: center;
          margin-top: ${layout.yearsTop}px;
        }

        .light-text {
          font-size: 17px !important;
          text-align: center;
          margin: ${layout.lightTextMarginTop}px auto 15px auto;
          max-width: 700px;
          line-height: 1.3;
        }

        .fullname {
          border-bottom: 4px solid black;
          font-size: 50px !important;
          font-weight: bold;
          text-transform: uppercase;
          text-align: center;
          padding-bottom: 5px;
          margin: ${layout.nameTop}px auto 20px auto;
          max-width: 650px;
        }

        .bolded {
          font-weight: bold;
          font-size: 20px !important;
          line-height: 1.5;
          text-align: center;
          margin: ${layout.boldedMarginTop}px auto;
          max-width: 680px;
          padding: 0 30px;
        }

        .mourning-svg-container {
          text-align: center;
          margin: 25px 0 15px 0;
        }

        .mourning-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin: ${layout.mourningTextMarginTop}px 0 10px 0;
        }

        .mourning {
          font-size: 16px !important;
          font-weight: bold;
          text-align: center;
        }

        .mourning-content {
          text-align: center;
          font-size: 18px !important;
          margin: 10px auto;
          max-width: 700px;
          line-height: 1.4;
        }

        .leafs-container {
          width: 100%;
          text-align: center;
        }

        p {
          margin: 0;
          padding: 0;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <img src="data:image/jpeg;base64,${image.base64}" alt="Photograph" />

        <div class="cross-svg">
          <svg style="position: absolute; top:calc(50% + ${layout.crossTop}px); left:${layout.crossLeft}px;" xmlns="http://www.w3.org/2000/svg" width="72" height="96">
            ${cross}
          </svg>
        </div>

        <p class="birth-death-years">
          ${settedValues[3]}. - ${onlyYearsOfDeath}.
        </p>

        <p class="light-text">
          Родбини, комшијама и пријатељима јављамо тужну вијест да је ${
            male ? "наш драги и никад прежаљени" : "наша драга и никад прежаљена"
          }
        </p>

        <p class="fullname">${name} ${surname}</p>

        <p class="bolded">
          ${male ? "Преминуо" : "Преминула"} дана ${settedValues[4]}. у ${
    settedValues[2]
  }. години живота, након ${getDeathTypeText(
    settedValues[1]
  )} Сахрана ће се обавити ${settedValues[6]}. године у ${
    settedValues[7]
  } часова. Спровод креће ${settedValues[5]}, на гробље у ${settedValues[8]}.
        </p>

        <div class="mourning-svg-container">
          <svg style="position:absolute; top:calc(50% + ${layout.mourningTop}px); left:${layout.mourningLeft}px;" xmlns="http://www.w3.org/2000/svg" width="223" height="19">
            ${mourning}
          </svg>
        </div>

        <p class="mourning">ОЖАЛОШЋЕНИ</p>
        <p class="mourning-content">${settedValues[9]}</p>

        <div class="leafs-container">
          <div class="leafs-svg">
            <svg style="position:absolute; top:calc(50% + ${layout.ozalosceniLeft}px); left:422px;" xmlns="http://www.w3.org/2000/svg" width="113" height="21">
              ${leafs}
            </svg>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
};
