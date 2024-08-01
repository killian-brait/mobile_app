import { Client, Account, ID, Avatars, Databases } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.kab.betterrecs',
    projectId: '66aae5a70024828562da',
    databaseId: '66aae782002895f60110',
    userCollectionId: '66aae7a90028d45384ad',
    videoCollectionId: '66aae7c8001d59d4e005',
    storageId: '66aaf48d003101f63721'
}

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

export const createUser = async (email, password, username) => {
    // Register User
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if (!newAccount) {
            throw new Error('Error creating user: newAccount is null');
        } else {
            const avatarUrl = avatars.getInitials(username);

            await signIn(email, password);

            const newUser = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, ID.unique(), {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            });

            return newUser;
        }
    } catch (error) {
        console.log(error);
        throw new Error(`Error creating user: ${error}`);
    }
}

export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        console.log(error);
        throw new Error(`Error signing in: ${error}`);
    }
}


