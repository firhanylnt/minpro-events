import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { User } from "../custom";
const prisma = new PrismaClient();

export class TransactionController {
  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, startMonth, endMonth, startYear, endYear } = req.query;
      const { organizer } = req.user as User;

      const filters: Prisma.TransactionsWhereInput = {
        status: 1,
      };

      if (startDate && endDate) {
        filters.createdAt = {
            gte: new Date(startDate as string),
            lte: (() => {
                const endDateObj = new Date(endDate as string);
                endDateObj.setDate(endDateObj.getDate() + 1);
                return endDateObj;
            })(),
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

      console.log(filters);

      const report = await prisma.$queryRaw<
        { date: string; transactionCount: number }[]
        >(
        Prisma.sql`
            SELECT 
                DATE(t.createdAt) AS date, 
                COUNT(t.id) AS transactionCount
            FROM Transactions t
            join Events e on e.id = t.event_id
            WHERE t.status = ${filters.status} and e.organizer_id = ${organizer}
            ${
            typeof filters.createdAt === "object" && "gte" in filters.createdAt
                ? Prisma.sql`AND t.createdAt >= ${filters.createdAt.gte}`
                : Prisma.empty
            }
            ${
            typeof filters.createdAt === "object" && "lte" in filters.createdAt
                ? Prisma.sql`AND t.createdAt <= ${filters.createdAt.lte}`
                : Prisma.empty
            }
            GROUP BY DATE(t.createdAt)
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
