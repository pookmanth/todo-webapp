import { createConnection } from "../utils/db";

export default defineEventHandler(async (event) => {
  const connection = await createConnection();
  const [rows] = await connection.query("SELECT * FROM todo ORDER BY time ASC");
  return rows;
});
