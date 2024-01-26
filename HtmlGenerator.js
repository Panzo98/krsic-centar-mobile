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

  const age = calculateYears(settedValues[2], settedValues[3]) + 1;
  // <img src="data:image/jpeg;base64,${image.base64}" />

  return `
    <html>
    <head>
      <style>
        body {
          text-align: center;
          position: relative;
        }
  
        img {
          width: 260px !important;
          height: 354px !important;
          object-fit: cover !important;
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          z-index: 1 !important;
        }
  
        .content {
          /* Dodajte stilove za ostale elemente kao što su <p> i <div> */
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
        }

        .bolded {
            font-weight: bold;
        }
        .fullname {
            width: 54%;
            border-bottom: 2px solid black;
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 20px;
            text-transform: uppercase;
            text-align: center;

        }
        .mourning {
            margin-top: 7px;
            padding-bottom: 15px;
        }
        .mourning-content {
            width: 54%;
            text-aling: center;
        }
        .light-text {
            font-weight: 200 !important;
        }
      </style>
    </head>
  
    <body>
  
      <div class="content">
        <p class="light-text">Родбини, комшијама и пријатељима јављамо тужну вијест</p>
        <p class="light-text">да је ${
          male ? "наш драги и никад прежаљени" : "наша драга и никад прежаљена"
        }</p>
        <p class="fullname">${name} ${surname}</p>
        <p class="bolded">${male ? "Преминуо" : "Преминула"} дана ${
    settedValues[3]
  } у ${age}. години живота, након ${
    settedValues[1] === "Nakon krace bolesti"
      ? "краће болести."
      : settedValues[1] === "Nakon duze bolesti"
      ? "дуже болести."
      : "неочекиваних околности."
  }</p>
        <p class="bolded">Сахрана ће се обавити ${settedValues[5]}. године у ${
    settedValues[6]
  } часова.
Спровод креће <br/> испред куће жалости у ${settedValues[4]}, на гробље у ${
    settedValues[7]
  }. </p>
        <p class="mourning">ОЖАЛОШЋЕНИ</p>
        <p class="mourning-content">${settedValues[8]}</p>
      </div>
    </body>
  </html>
  
      `;
};
