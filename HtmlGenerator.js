import { cross } from "./assets/cross";
import { leafs } from "./assets/lisce";
import { mourning } from "./assets/mourning";

export const generateHtml = (image, name, surname, settedValues) => {
  const male = settedValues[0] === "Musko" ? true : false;

  const calculateYears = (dateOfBirth, dateOfDeath) => {
    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split(".");
      return new Date(`${year}-${month}-${day}`);
    };

    const birthDate = parseDate(dateOfBirth);
    const deathDate = parseDate(dateOfDeath);

    const ageInMilliseconds = deathDate - birthDate;
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

    return Math.floor(ageInYears);
  };

  const extractYears = (date) => {
    const [day, month, year] = date.split(".");
    console.log(year);
    return year;
  };

  const onlyYearsOfBirth = extractYears(settedValues[2]);
  const onlyYearsOfDeath = extractYears(settedValues[3]);
  const age = calculateYears(settedValues[2], settedValues[3]) + 1;
  // <img src="data:image/jpeg;base64,${image.base64}" />

  return `
    <html>
    <head>
      <style>
        body {
          text-align: center;
          position: relative;
          width: 77%;
          margin-left: 11.5%;
        }
  
        img {
          width: 145px !important;
          height: 180px !important;
          object-fit: cover !important;
          position: absolute !important;
            top: 160px;
            left: 10px;
          z-index: 1 !important;
        }
        .moruning-svg {
            position: absolute !important;
            bottom: 220px;
            left: 247px;
        }
        .content {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        p {
            margin-top:-15px;
            padding-top:0px;
            font-size: 24px !important;
        }

        .bolded {
            font-weight: bold;
            font-size: 20px !important;
            padding-top: 0px;
            padding-bottom: 0px;
            margin-top: -10px;
            // margin-bottom: px;
            line-height: 1.02;
            width: 80%;
            // margin-left: -45px;
            position: absolute;
            top:calc(50% + 46px);
            left: 60px;



        }
        .fullname {
            width: 80%;
            border-bottom: 4px solid black;
            font-size: 50px !important;
            font-weight: bold;
            margin-bottom: 17px;
            text-transform: uppercase;
            text-align: center;
            // margin-left: -45px;
            position: absolute;
            top:calc(50% - 17px);
            left:60px;

        }
        .mourning {
            position: absolute;
            font-size: 16px !important;
            top: calc(50% + 155px);
            left:320px;
        }
        .mourning-content {
            width: 80%;
            text-align: center;
            position: absolute; /* Dodato */
            overflow: hidden; /* Ovo će sprečiti da dugi tekst izlazi iz okvira .mourning-content */
            white-space: pre-line;
            // margin-left: -45px;
            font-size: 18px !important;
            top: calc(50% + 178px);
            left: 60px;

        }
          
        .light-text {
            font-weight: 200 !important;
            font-size: 17px !important;
            width: 60%;
            position: absolute;
            top: calc(50% - 53px);

        }
        .birth-death-years {
            font-weight: bold;
            font-size: 32px !important;
            position: absolute;
            top:calc(50% - 83px);
            left:291px;
        }
      </style>
    </head>
  
    <body>
  
      <div class="content">
      <img src="data:image/jpeg;base64,${image.base64}" />
      <div>
${cross}
${mourning}
${leafs}
      </div>
      <p class="birth-death-years">${onlyYearsOfBirth}. - ${onlyYearsOfDeath}.</p>
        <p class="light-text">Родбини, комшијама и пријатељима јављамо тужну вијест да је ${
          male ? "наш драги и никад прежаљени" : "наша драга и никад прежаљена"
        }</p>
        <p class="fullname">${name} ${surname}</p>
        <p class="bolded">${male ? "Преминуо" : "Преминула"} дана ${
    settedValues[3]
  }. у ${age}. години живота, након ${
    settedValues[1] === "Nakon krace bolesti"
      ? "краће болести."
      : settedValues[1] === "Nakon duze bolesti"
      ? "дуже болести."
      : "неочекиваних околности."
  } Сахрана ће се обавити ${settedValues[5]}. године у ${
    settedValues[6]
  } часова. Спровод креће испред куће жалости у ${
    settedValues[4]
  }, на гробље у ${settedValues[7]}. </p>
        <p class="mourning">ОЖАЛОШЋЕНИ</p>
        <p class="mourning-content">${settedValues[8]}</p>
      </div>
    </body>
  </html>
  
      `;
};
