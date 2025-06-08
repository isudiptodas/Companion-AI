import nodemailer from 'nodemailer';
import { User } from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    const { otp, email } = await req.json();

    try {
        const found = await User.findOne({ email });

        if (!found) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
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
            subject: "PASSWORD RECOVERY",
            text: `Greetings from Companion AI. \n Your one-time password for password recovery is ${otp}.`,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log(error);
            }
        });

        return NextResponse.json({
            success: true,
            message: "OTP sent"
        }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { password, email } = await req.json();

    try {
        const found = await User.findOne({ email });

        if (!found) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
        
        const hashed = await bcrypt.hash(password, 10);
        found.password = hashed;

        await found.save();

        return NextResponse.json({
            success: true,
            message: "Password changed"
        }, { status: 201 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
}