import { PrismaClient } from '@prisma/client';
import express from 'express';
import morgan from 'morgan';
import { nanoid } from 'nanoid';

const db = new PrismaClient({ log: ['error', 'info', 'query', 'warn'] });
const genId = () => nanoid(16);

//? add mock data to DB
const seedDatabase = async () => {
  if ((await db.post.count()) === 0) {
    await db.post.createMany({
      data: [
        {
          id: genId(),
          slug: 'ultimate-node-stack',
          title: 'Ultimate Node Stack 2023',
          publishedAt: new Date(),
        },
        {
          id: genId(),
          slug: 'draft-post',
          title: 'Draft Post 2023',
        },
      ],
    });
  }
};
seedDatabase();

const app = express();
const PORT = Number(process.env.PORT ?? 8080);

app.use(morgan("dev")); //* log with some colors :) */

app.get("/", async (req, res) => {
  const posts = await db.post.findMany();
  res.json(posts);
});

app.listen(PORT, "0.0.0.0", () => {
  //! 0.0.0.0 is for docker (mandatory) */
  console.log(`Server started at http://localhost:${PORT}`);
});
