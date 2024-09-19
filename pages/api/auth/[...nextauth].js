import NextAuth, {getServerSession} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import {Admin} from "@/models/Admin";


async function isAdminEmail(email){
    return true;
    return !! (await Admin.find({email}));
}

export const authOptions={

    providers: [

        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
    ],
        adapter: MongoDBAdapter(clientPromise),
    callbacks:{
    session:async ({session,token,user})=>{
        if (await isAdminEmail(session?.user?.email)){
            return session;
        }
        return false;
    },
},
};


export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
    const session= await getServerSession(req,res,authOptions);
    console.log(session?.user?.email);
    if (!(await isAdminEmail(session?.user?.email))){
        res.status(401);
        res.end();
        throw 'not an admin';
    }
}