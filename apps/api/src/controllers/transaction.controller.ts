import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export class TransactionController {
  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, startMonth, endMonth, startYear, endYear } = req.query;

      const filters: Prisma.TransactionsWhereInput = {
        status: 1,
      };

      if (startDate && endDate) {
        filters.createdAt = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      } else if (startMonth && endMonth) {
        const start = new Date(`${startMonth}-01`);
        const end = new Date(`${endMonth}-01`);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);

        filters.createdAt = {
          gte: start,
          lte: end,
        };
      } else if (startYear && endYear) {
        const start = new Date(`${startYear}-01-01`);
        const end = new Date(`${endYear}-12-31`);

        filters.createdAt = {
          gte: start,
          lte: end,
        };
      }

      const report = await prisma.$queryRaw<
        { date: string; transactionCount: number }[]
        >(
        Prisma.sql`
            SELECT 
                DATE(createdAt) AS date, 
                COUNT(id) AS transactionCount
            FROM transactions
            WHERE status = ${filters.status}
            ${
            typeof filters.createdAt === "object" && "gte" in filters.createdAt
                ? Prisma.sql`AND createdAt >= ${filters.createdAt.gte}`
                : Prisma.empty
            }
            ${
            typeof filters.createdAt === "object" && "lte" in filters.createdAt
                ? Prisma.sql`AND createdAt <= ${filters.createdAt.lte}`
                : Prisma.empty
            }
            GROUP BY DATE(createdAt)
            ORDER BY date ASC;
        `
        );


        const formattedReport = report.map((item) => ({
        date: item.date,
        transactionCount: Number(item.transactionCount),
        }));

      res.status(200).send({
        message: 'Transaction Report',
        data: formattedReport
    })
    } catch (error) {
        next(error);
    }
  }
}
