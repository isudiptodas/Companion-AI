import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/config/connectDB";
import { User } from "@/models/userModel";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const query = req.url.split('=')[1];

    await connectDb();

    if (query === 'register') {

        const { name, email, password } = body;
        try {
            const found = await User.findOne({ email });

            if (found) {
                return NextResponse.json({
                    success: false,
                    message: 'User already exists'
                }, { status: 400 });
            }

            const hashed = await bcrypt.hash(password, 10);

            const newUser = new User({
                name, email, password: hashed
            });

            await newUser.save();

            return NextResponse.json({
                success: true,
                message: "User registered",
                newUser
            }, { status: 200 });
        } catch (err) {
            console.error(err);
            return NextResponse.json({
                success: false,
                message: "Something went wrong",
            }, { status: 500 });
        }

    }
    else if (query === 'login') {
        const { email, password } = body;

        try {
            const found = await User.findOne({ email });

            if (!found) {
                return NextResponse.json({
                    success: false,
                    message: 'User not exists'
                }, { status: 404 });
            }

            const matched = await bcrypt.compare(password, found.password);

            if (!matched) {
                return NextResponse.json({
                    success: false,
                    message: 'Invalid Password'
                }, { status: 400 });
            }

            const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
            const res = NextResponse.json({
                success: true,
                message: 'Login Successfull'
            }, { status: 200 });

            res.cookies.set('token', token, {
                sameSite: 'strict',
                httpOnly: true,
                secure: true,
                maxAge: 86400
            });

            return res;

        } catch (err) {
            console.error(err);
            return NextResponse.json({
                success: false,
                message: "Something went wrong",
            }, { status: 500 });
        }
    }
    else if (query === 'otp') {
        const { email, otp, name } = body;

        try {
            const mail = process.env.COMPANION_EMAIL as string;
            const pass = process.env.COMPANION_PASSWORD as string;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: mail,
                    pass: pass,
                },
            });

            const mailOptions = {
                from: mail,
                to: email,
                subject: "ACCOUNT VERIFICATION",
                text: `Greetings from Companion AI. \n Hello ${name} your one-time password for account verification is ${otp}.`,
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.log(error);
                }
            });

            return NextResponse.json({
                success: true,
                message: "OTP sent"
            }, {status: 200});

        } catch (err) {
            return NextResponse.json({
                success: false,
                message: "Something went wrong"
            }, {status: 500});
        }
    }

}