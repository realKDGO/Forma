import "./config/env.js";
import { app } from "./app.js";
import { prisma } from "./config/prisma.js";
const port = Number(process.env.PORT || 3000);
const server = app.listen(port, () =>
  console.log(`Forma API listening on ${port}`),
);
const stop = async () => {
  server.close();
  await prisma.$disconnect();
};
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
