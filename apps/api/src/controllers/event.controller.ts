import { Request, Response, NextFunction} from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class EventController {

    constructor() {
        this.createEvent = this.createEvent.bind(this);
    }

    private randomString(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

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
                include: {
                    eventCategory: true,
                    eventType: true,
                    cities: true,
                },
                where: {
                    AND: [
                        {
                          OR: [
                            { name: { contains: filter.keyword } },
                            { location: { contains: filter.keyword } },
                            { cities: { city_name: { contains: filter.keyword } } },
                          ],
                        },
                        { deletedAt: null }
                    ],
                },
                skip: filter.page != 1 ? (filter.page - 1) * filter.pageSize : 0,
                take: filter.pageSize,
                
            })
    
            // prisma.$executeRaw`select * from`
    
            res.status(200).send({
                message: 'Get All Event Data',
                data
            })
        } catch (error) {
            next(error);
        }
    }

    async getEventById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
    
            const data = await prisma.events.findUnique({
                where: { id: Number(id) }
            })
    
            res.status(200).send({
                message: 'Get Event',
                data
            })
        } catch (error) {
            next(error);
        }
    }

    async getEventBySlug(req: Request, res: Response, next: NextFunction) {
        try {
            const { slug } = req.params;
    
            const data = await prisma.events.findFirst({
                include: {
                    eventCategory: true,
                    eventType: true,
                    cities: true,
                    rating: true,
                },
                where: { slug: slug }
            });
    
            res.status(200).send({
                message: 'Get Event',
                data
            })
        } catch (error) {
            next(error);
        }
    }

    async createEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                name, 
                slug, 
                start_date,
                end_date,
                price,
                discount_price,
                city_id,
                location,
                description,
                seats,
                event_type,
                event_category,
                sale_type,
                created_by,
                organizer_id
            } = req.body;

            const checkSlug = await prisma.events.findFirst({
                where: {slug: slug},
            });
            let usedSlug = slug;
            if(checkSlug){
                usedSlug = slug + this.randomString(4)
            }

            const event = await prisma.events.create({
                data: {
                    name: name,
                    slug: usedSlug,
                    start_date: start_date,
                    end_date: end_date,
                    price: price ?? null,
                    discount_price: discount_price ?? null,
                    city_id: city_id,
                    location: location,
                    description: description,
                    seats: seats ?? null,
                    event_type_id: event_type,
                    event_category_id: event_category,
                    sale_type: sale_type,
                    created_by: created_by,
                    organizer_id: organizer_id,
                },
            });
            res.status(200).send({
                message: 'Success Created Event',
            });
        }catch(err){
            next(err);
        }
    } 

    async updateEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const {
                name, 
                slug, 
                start_date,
                end_date,
                price,
                discount_price,
                city_id,
                location,
                description,
                seats,
                event_type,
                event_category,
                sale_type,
                created_by,
                organizer_id
            } = req.body;

            const checkEvent = await prisma.events.findUnique({
                where: {id: Number(id)}
            });
            
            if(!checkEvent) throw new Error("Event Tidak Ditemukan");

            const update = await prisma.events.update({
                where: {id: Number(id)},
                data: {
                    name: name,
                    start_date: start_date,
                    end_date: end_date,
                    price: price,
                    discount_price: discount_price,
                    city_id: city_id,
                    location: location,
                    description: description,
                    seats: seats,
                    event_type_id: event_type,
                    event_category_id: event_category,
                    sale_type: sale_type,
                },
            })
            
            res.status(200).send({
                message: 'Update Event',
            })
        } catch (error) {
            next(error);
        }
    }
}