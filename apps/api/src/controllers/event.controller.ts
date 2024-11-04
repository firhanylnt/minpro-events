import { Request, Response, NextFunction} from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class EventController {

    async getAllEvent(req: Request, res: Response, next: NextFunction) {
        try {
            interface IFilter {
                keyword?: string;
                page: number;
                pageSize: number;
            }

            console.log(req.query);
    
            const {page, pageSize} = req.query;
    
            const filter: IFilter = {
                page: parseInt(page as string) || 1,
                pageSize: parseInt(pageSize as string) || 10,
            };
    
            const data = await prisma.events.findMany({
                where: {
                    // fullname : {
                    //     contains : filter.fullname
                    // }
                    OR: [
                        {
                            name : {
                                contains : filter.keyword
                            }
                        },
                        {
                            location: {
                                contains : filter.keyword
                            }
                        },
                    ],
                    AND: [
                        {
                            deletedAt:{
                                not : null
                            }
                        }
                    ]
                },
                skip: filter.page != 1 ? (filter.page - 1) * filter.pageSize : 0,
                take: filter.pageSize,
                
            })
    
            prisma.$executeRaw`select * from`
    
            res.status(200).send({
                message: 'Get All Event Data',
                data
            })
        } catch (error) {
            next(error);
        }
    }
}