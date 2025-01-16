import clientPromise from './mongodb'
import { Db } from 'mongodb'

let db: Db | null = null

export async function getDb() {
    if (db) {
        return db
    }

    const client = await clientPromise
    db = client.db('ezyrent')
    return db
}

export async function getCollection(collectionName: string) {
    const database = await getDb()
    return database.collection(collectionName)
}