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

  return `
      <html>
        <body style="text-align: center;">
          <img
            src="data:image/jpeg;base64,${image.base64}"
            style="width: 300px; height: 300px; object-fit: cover;" />
            <p>Родбини, комшијама и пријатељима јављамо тужну вијест да је ${
              male
                ? "наш драги и никад прежаљени"
                : "наша драга и никад прежаљена"
            }</p>
            <p>${name} ${surname}</p>
            <p>${male ? "Преминуо" : "Преминула"} дана ${
    settedValues[3]
  } у ${age}. години живота, након ${
    settedValues[1] === "Nakon krace bolesti"
      ? "краће болести"
      : settedValues[1] === "Nakon duze bolesti"
      ? "дуже болести"
      : "неочекиваних околности."
  }</p>
           <p>Сахрана ће се обавити ${settedValues[5]}. године у ${
    settedValues[6]
  } часова. Поворка креће испред куће жалости у ${
    settedValues[4]
  } на гробље у ${settedValues[7]}</p>
  <p>ОЖАЛОШЋЕНИ</p>
            <p>${settedValues[8]}</p>
           
        </body>
      </html>
    `;
};
