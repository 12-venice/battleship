export const getHtml = (reactHtml: string, reduxState = {}) => `
    <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>Battleship - play together!</title>
                <link rel="icon" href="/assets/favicon.ico" type="image/x-icon">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link
                    href="https://fonts.googleapis.com/css2?family=Rubik+Wet+Paint&family=Titan+One&display=swap"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
                />
                <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap"
                    rel="stylesheet"
                />
                <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="/styles.css"/>
                <script defer src="/main.js"></script>
            </head>
            <body>
                <div id="root">${reactHtml}</div>
                <script>
                    window.__INITIAL_STATE__ = ${JSON.stringify(reduxState)}
                </script>
            </body>
        </html>
    `;
