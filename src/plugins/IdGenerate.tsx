import { desc, like } from "drizzle-orm";

export async function generateCustomId(db, table, prefix) {
  // Example result: "PRO-%"
  const pattern = `${prefix}-%`;

  const lastId = await db
    .select({ id: table.id })
    .from(table)
    .where(like(table.id, pattern))
    .orderBy(desc(table.id))
    .limit(1);

  if (!lastId.length) {
    return `${prefix}-0001`;
  }

  // Extract number
  const currentNumber = parseInt(lastId[0].id.split("-")[1]);
  const nextNumber = String(currentNumber + 1).padStart(4, "0");

  return `${prefix}-${nextNumber}`;
}
