import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';
import { User } from "@/models/userModel";
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {

    try {
        //const token = req.headers.get('cookie')?.split('token=')[1];
        const token = (await cookies()).get('token')?.value;

        //console.log(token);

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token as string, secret);
        const found = await User.findOne({ email: payload.email });

        if (!found) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "User details fetched",
            found
        }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const res = NextResponse.json({
        success: true,
        message: "User logged out",
    }, { status: 201 });

    res.cookies.set('token', '', {
        sameSite: 'strict',
        httpOnly: true,
        secure: true,
        maxAge: 0
    });

    return res;
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const query = req.url.split('=')[1];

    if (query === 'update') {
        const { email, name } = body;

        try {
            const found = await User.findOne({ email });

            if (!found) {
                return NextResponse.json({
                    success: false,
                    message: "User not found"
                }, { status: 404 });
            }

            found.name = name;
            await found.save();

            return NextResponse.json({
                success: true,
                message: "Name updated"
            }, { status: 201 });
        } catch (err) {
            console.log(err);
            return NextResponse.json({
                success: false,
                message: "Something went wrong"
            }, { status: 500 });
        }
    }
    else {
        const { email, currentPassword, newPassword } = body;

        try {
            const found = await User.findOne({ email });

            if (!found) {
                return NextResponse.json({
                    success: false,
                    message: "User not found"
                }, { status: 404 });
            }

            const matched = await bcrypt.compare(currentPassword, found.password);

            if (!matched) {
                return NextResponse.json({
                    success: false,
                    message: "Password Incorrect"
                }, { status: 400 });
            }

            const hashed = await bcrypt.hash(newPassword, 10);
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
}