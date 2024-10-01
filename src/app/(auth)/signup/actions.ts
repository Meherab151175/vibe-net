"use server"

import {hash} from "@node-rs/argon2";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { generateIdFromEntropySize } from "lucia";
import prisma from "@/lib/db";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function signup(credentials: SignUpValues):Promise<{error:string}> {
    try {
        const {email, username, password} = signUpSchema.parse(credentials);
        const passwordHash = await hash(password,{
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        const userId = generateIdFromEntropySize(10)

        const existingUser = await prisma.user.findFirst({
            where:{
                email,
                username:{
                    equals: username,
                    mode:"insensitive"
                }
            }
        })

        if(existingUser){
            return{
                error: "User already exists!"
            }
        }

        await prisma.user.create({
            data:{
                id:userId,
                email,
                username,
                passwordHash,
                displayName: username
            }
        })

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        return redirect("/");
    } catch (error) {
        if(isRedirectError(error)) throw error;
        console.log(error);
        return{
            error: "Something went wrong.Please try again!"
        }
    }
}