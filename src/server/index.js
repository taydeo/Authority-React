const express = require('express');
let cookie_parser = require('cookie-parser');

const app = express();

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
