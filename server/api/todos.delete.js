import { readBody, defineEventHandler, createError } from "h3";
import { createConnection } from "../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const connection = await createConnection();

  const [result] = await connection.execute("DELETE FROM todo WHERE num = ?", [
    query.num,
  ]);
});
