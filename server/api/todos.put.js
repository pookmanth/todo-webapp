import { readBody, defineEventHandler, createError } from "h3";
import { createConnection } from "../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // console.log(body);
  const query = getQuery(event);

  const connection = await createConnection();

  const [result] = await connection.execute(
    "UPDATE todo SET description = ? , done = ? WHERE num = ?;",
    [body.description, body.done, body.num]
  );
});
