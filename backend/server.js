
const env = require("./config/env");
const app = require("./app");

app.listen(env.PORT, () => {
    console.log(
        `Server running in ${env.NODE_ENV} on http://localhost:${env.PORT}`
    );
});

