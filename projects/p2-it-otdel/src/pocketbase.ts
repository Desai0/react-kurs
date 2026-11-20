import PocketBase from 'pocketbase'

export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090')
export const requestsCollection = pb.collection('it_requests')
