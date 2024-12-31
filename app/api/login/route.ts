import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from 'bcrypt'
import jwt  from "jsonwebtoken";
import { error } from "console";

const SECRET_KEY = "secretKey";
export async function POST(request:Request) {
    const {username, password} = await request.json();

    const admin = await prisma.user.findFirst({
        where:{
            username
        },
    });
    console.log("User Found",admin);

    if(admin){
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if(isPasswordValid){
            const token = jwt.sign(
                {id:admin.id, name:admin.username, pass:admin.password, type:admin.type, user:admin.name},
                SECRET_KEY,
                {expiresIn:'20y'}
            );
            return NextResponse.json({token},{status:200});

        }
    }
    return NextResponse.json({error:"Invalid Credentials.. Please Try Again"}, {status:401});
    
}
