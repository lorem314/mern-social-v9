const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3009,
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    "mongodb://" +
      (process.env.IP || "127.0.0.1") +
      ":" +
      (process.env.MONGO_PORT || 27017) +
      "/mern-project-v9",

  access_secret: "c1efd8aebe154ee36754ed6e6ecdb427",
  access_expiry: "15m",
  refresh_secret: "b737c507cdd6620dfc9690065fbbb941",
  refresh_expiry: "2d",
}

export default config
