import { Request, Response, NextFunction} from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { genSalt, hash, compare } from "bcrypt";
const prisma = new PrismaClient();

export class AuthController {
    constructor() {
        this.createUser = this.createUser.bind(this);
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

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {fullname, email, password, phone_number, role_id, referral_code} = req.body
            const checkUser = await prisma.users.findUnique({
                where: {email},
            });

            if(checkUser) throw new Error("Email sudah terdaftar");

            const salt = await genSalt(10);
            const hashPassword = await hash(password, salt)

            const user = await prisma.users.create({
                data: {
                    fullname: fullname,
                    email: email,
                    phone_number: String(phone_number),
                    password: hashPassword,
                    role_id: role_id,
                    referral_code: role_id === 2 ? this.randomString(8) : null,
                    total_point: 0,
                },
            })

            if(referral_code && referral_code !== '') {
                const ref = await prisma.users.findFirst({
                    where: {referral_code}
                })
                if(ref){
                    await prisma.referral_code_user.create({
                        data: {
                            user_id: user.id,
                            master_user_id: ref.id,
                        }
                    });

                    const expired_at = new Date();
                    expired_at.setMonth(expired_at.getMonth() + 3);

                    await prisma.points.create({
                        data: {
                            user_id: ref.id,
                            point: 10000,
                            expired_at: expired_at
                        }
                    })

                    await prisma.vouchers.create({
                        data: {
                            user_id: user.id,
                            category: 'unique',
                            type: 'percentage',
                            qty: 1,
                            start_date: new Date(),
                            end_date: expired_at,
                            amount: 10,
                            status: true,
                            voucher_code: this.randomString(6)
                        }
                    })
                }
            }
            

            res.status(200).send({
                message: 'Success Create User',
            })
        } catch (error) {
            next(error)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body;

            const user = await prisma.users.findUnique({ where: { email } });
            
            if (!user) {
                return res.status(401).send({
                    message: 'Email Tidak Terdaftar',
                })
            }

            const isPasswordValid = await compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).send({
                    message: 'Password Salah',
                }) 
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role_id, fullname: user.fullname },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).cookie("access_token", token).send({
                message: 'Success Login',
                token: token,
            })

        } catch (error) {
            next(error);
        }
    }
    
    async getUsers(req: Request, res: Response, next: NextFunction) {
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
    
            const data = await prisma.users.findMany({
                where: {
                    OR: [
                        {
                            fullname : {
                                contains : filter.keyword
                            }
                        },
                        {
                            email: {
                                contains : filter.keyword
                            }
                        },
                        {
                            phone_number: {
                                contains : filter.keyword
                            }
                        }
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
                message: 'Get All Users Data',
                data
            })
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const user = await prisma.users.findUnique({
            where: { id: Number(id) },
        });

        res.status(200).send({
            message: 'Get User By Id',
            data: user,
        })

    }
    
}
