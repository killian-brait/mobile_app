import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.kab.betterrecs',
    projectId: '66aae5a70024828562da',
    databaseId: '66aae782002895f60110',
    userCollectionId: '66aae7a90028d45384ad',
    videoCollectionId: '66aae7c8001d59d4e005',
    storageId: '66aaf48d003101f63721'
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = appwriteConfig;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;

// Backend w/ Appwrite
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email:string, password:string, username:string
) => {
    // Register User
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw new Error('Error registering: newAccount is null');

        await signIn(email, password);

        const avatarUrl = avatars.getInitials(username);

        // console.log("New account ID: ", newAccount.$id);

        const newUser = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(), 
        {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avatarUrl
        });

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(`Error registering: ${error}`);
    }
}

export const signIn = async (email:string, password:string) => {
    try {
        const sessions = await account.getSession('current');

        // Check if user already has an active session
        if (sessions) {
            console.log(`${email} already has an active session. Sessions: ${sessions.userId}`);
            return;
        }

        // Create new session if none exists
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        console.log(error);
        throw new Error(`Error signing in: ${error}`);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;
    
        // BUG FIX: use listDocuments instead of getDocument since
        // get document requires the document ID
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0]; // Only need one user
    } catch (error) {
        console.log("Error getting current user in function: ", error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        );

        return posts.documents;
    } catch (error: Error | unknown) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error(String(error));
        }
      }
}

// for trending section (so maybe rename to getTrendingPosts)
export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        );

        return posts.documents;
    } catch (error: Error | unknown) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error(String(error));
        }
      }
}