import React, { forwardRef } from "react";

const PrintableContent = forwardRef((props, ref) => {
  return (
    <html ref={ref}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />
      </head>
      <body style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "50px",
            fontFamily: "Helvetica Neue",
            fontWeight: "normal",
          }}
        >
          Hello Expo!
        </h1>
        <img
          src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
          style={{ width: "90vw" }}
        />
      </body>
    </html>
  );
});

export default PrintableContent;
