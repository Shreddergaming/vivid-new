import NextAuth, { NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { compare } from "bcryptjs"
import { ObjectId } from "mongodb"

interface ExtendedUser extends User {
    id: string;
}

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<ExtendedUser | null> {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials")
                }
                const client = await clientPromise
                const usersCollection = client.db().collection("users")
                const user = await usersCollection.findOne({ email: credentials.email })
                if (!user || !user.password) {
                    throw new Error("User not found")
                }
                const isValid = await compare(credentials.password, user.password)
                if (!isValid) {
                    throw new Error("Invalid password")
                }
                return { id: user._id.toString(), email: user.email, name: user.name }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as ExtendedUser).id = token.id as string
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }