require("dotenv").config();

const express = require("express");
const volleyball = require("volleyball");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");

const app = express();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { auth } = require("./routes/ìndex")
const { transactions } = require("./routes/ìndex")
// const { auth, tags, users, posts, comments } = require("./routes");
const { User } = require("./models");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log(error));

app.use(express.json());
app.use(volleyball);
app.use(helmet());
app.use(cors({ origin: "*" }));
passport.use(
  new Strategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload._id);
        if (!user) {
          done(new Error("User not found"));
          return;
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Cash App API",
      version: "1.0.0",
      description: "API для управления транзакциями с JWT авторизацией"
    },
    servers: [
      { url: "http://localhost:3000" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./routes/*.js"], // пути к твоим файлам с эндпоинтами
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.listen(process.env.PORT, () => {
    console.log("Server Listening on PORT:", process.env.PORT);
});

app.use("/api/auth", auth);
app.use("/api/transactions", transactions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;