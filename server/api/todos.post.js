import { readBody, defineEventHandler, createError } from "h3";
import { createConnection } from "../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const connection = await createConnection();
  const [result] = await connection.execute(
    "INSERT INTO todo (num,description, done) VALUES (?,?,?)",
    [body.num, body.description, body.done]
  );
  return { success: true, message: "Todo item created successfully" };
});
