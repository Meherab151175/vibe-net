"use server"

import prisma from "@/lib/db";
import { loginSchema, LoginValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import {verify} from "@node-rs/argon2";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(credentials:LoginValues):Promise<{error:string}>{
    try {
        const {password, username} = loginSchema.parse(credentials);

        const existUser = await prisma.user.findFirst({
            where:{
                username:{
                    equals: username,
                    mode:"insensitive"
                }
            }
        });

        if(!existUser){
            return{
                error: "User does not exist!"
            }
        }

        const comparePassword = await verify(existUser?.passwordHash!, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        if (!comparePassword) {
            return {
                error: "Incorrect username or password"
            };
        }

        const session = await lucia.createSession(existUser.id, {});
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