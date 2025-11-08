import { NextResponse } from 'next/server';
import type { User } from '@/app/types';
import databaseConnection  from "@/app/database/dbinit";

export const tokenGen = () => {
    return Math.random().toString(36).substring(2);
}

export const POST = async (request: Request) => {
    const { username, password } = await request.json();
    const db = await databaseConnection();
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE username = ? AND password = ?'
        , [username, password]);
    const user = (rows as User[])[0];

    if (!user) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    user.atoken = tokenGen();
    const res = NextResponse.json({ message: 'Login successful', currentUser: user}, { status: 200 });

    res.cookies.set({
        name: 'user',
        value: JSON.stringify(user),
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // one day
    });

    return res;
};
