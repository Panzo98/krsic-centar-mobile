import { getCross } from "./svg_exports/cross.js";
import { leafs } from "./svg_exports/lisce.js";
import { mourning } from "./svg_exports/mourning.js";
import { PDF_DIMENSIONS, DEFAULT_LAYOUT } from "./config/layoutConfig.js";

export const generateHtml = (image, name, surname, settedValues, customLayout) => {
  const layout = { ...DEFAULT_LAYOUT, ...(customLayout || {}) };
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
        return "након краће болести.";
      case "Nakon duze bolesti":
        return "након дуже болести.";
      case "Nakon teze bolesti":
        return "након теже болести.";
      case "Iznenada":
        return "изненада.";
      case "Tragično":
        return "трагично.";
      default:
        return "неочекиваних околности.";
    }
  };

  const { width, height } = PDF_DIMENSIONS;

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=${width}" />
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
          width: ${width}pt;
          height: ${height}pt;
          overflow: hidden;
          font-family: 'Times New Roman', serif;
        }

        body {
          position: relative;
          padding: 40pt 50pt;
          color: ${layout.textColor};
        }

        .container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        img {
          width: ${layout.imageWidth}pt !important;
          height: ${layout.imageHeight}pt !important;
          object-fit: cover !important;
          position: absolute !important;
          top: ${layout.imageTop}pt;
          left: ${layout.imageLeft}pt;
          border: 2pt solid ${layout.borderColor};
          z-index: 2;
        }

        .cross-svg {
          text-align: center;
          margin-bottom: 10pt;
          margin-left: -1pt;
        }

        /* Krst - baza: calc(50% - 210px), 350px + offset */
        .cross-svg .cross-element {
          position: absolute;
          top: calc(50% - 210px + ${layout.crossTop}px);
          left: calc(350px + ${layout.crossLeft}px);
          transform: scale(${layout.crossScale});
          transform-origin: top left;
        }

        .leafs-under-cross {
          text-align: center;
          margin-bottom: 270pt;
        }

        /* Lišće - override inline stil iz exporta + offset */
        .leafs-under-cross svg {
          top: calc(50% - 120px + ${layout.leafsTop}px) !important;
          left: calc(330px + ${layout.leafsLeft}px) !important;
          transform: scale(${layout.leafsScale}) !important;
          transform-origin: top left !important;
        }

        /* Mourning ornament - override inline stil + offset */
        .mourning-svg-container svg {
          top: calc(50% + 139px + ${layout.mourningTop}px) !important;
          left: calc(268px + ${layout.mourningLeft}px) !important;
          transform: scaleX(${layout.mourningScale}) !important;
          transform-origin: top left !important;
        }

        .birth-death-years {
          font-weight: bold;
          font-size: ${layout.yearsFontSize}pt !important;
          text-align: center;
          margin-left: -10pt;
          margin-top: -160pt;
          transform: translate(${layout.yearsLeft}px, ${layout.yearsTop}px);
        }

        .light-text {
          font-size: ${layout.lightTextFontSize}pt !important;
          text-align: center;
          margin: 8pt auto 15pt 50pt;
          max-width: 700pt;
          line-height: 1.3;
          transform: translate(${layout.lightTextLeft}px, ${layout.lightTextTop}px);
        }

        .fullname {
          border-bottom: 4pt solid ${layout.nameColor};
          font-size: ${layout.nameFontSize}pt !important;
          font-weight: bold;
          text-transform: uppercase;
          text-align: center;
          padding-bottom: 5pt;
          margin: 15pt auto 20pt auto;
          max-width: 650pt;
          color: ${layout.nameColor};
          transform: translate(${layout.nameLeft}px, ${layout.nameTop}px);
        }

        .bolded {
          font-weight: bold;
          font-size: ${layout.boldedFontSize}pt !important;
          line-height: 1.5;
          text-align: center;
          margin: 12pt auto;
          max-width: 680pt;
          padding: 0 30pt;
          transform: translate(${layout.boldedLeft}px, ${layout.boldedTop}px);
        }

        .mourning-svg-container {
          text-align: center;
          margin: 10pt 0 0 0;
        }

        .mourning {
          font-size: ${layout.mourningFontSize}pt !important;
          font-weight: bold;
          text-align: center;
          margin: 18pt 0 10pt 0;
          transform: translate(${layout.mourningTitleLeft}px, ${layout.mourningTitleTop}px);
        }

        .mourning-content {
          text-align: center;
          font-size: ${layout.mourningContentFontSize}pt !important;
          margin: 10pt auto;
          max-width: 700pt;
          line-height: 1.4;
          transform: translate(${layout.mourningContentLeft}px, ${layout.mourningContentTop}px);
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
          <svg class="cross-element" xmlns="http://www.w3.org/2000/svg" width="72" height="96">
            ${getCross(layout.crossColor)}
          </svg>
        </div>

        <div class="leafs-under-cross">
          ${leafs}
        </div>

        <p class="birth-death-years">
          ${settedValues[3]}. - ${onlyYearsOfDeath}.
        </p>

        <p class="light-text">
          Родбини, комшијама и пријатељима јављамо<br> тужну вијест да је ${
            male ? "наш драги и никад прежаљени" : "наша драга и никад прежаљена"
          }
        </p>

        <p class="fullname">${name} ${surname}</p>

        <p class="bolded">
          ${male ? "Преминуо" : "Преминула"} дана ${settedValues[4]}. у ${
    settedValues[2]
  }. години живота, ${getDeathTypeText(
    settedValues[1]
  )} Сахрана ће се обавити ${settedValues[6]}. године у ${
    settedValues[7]
  } часова. Спровод креће ${settedValues[5]}, на гробље у ${settedValues[8]}.
        </p>

        <div class="mourning-svg-container">
          ${mourning}
        </div>

        <p class="mourning">ОЖАЛОШЋЕНИ</p>
        <p class="mourning-content">${settedValues[9]}</p>
      </div>
    </body>
  </html>
  `;
};
