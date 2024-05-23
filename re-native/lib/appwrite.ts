import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.kamran.potato',
  projectId: '664eb6bc0012c178957a',
  databaseId: '664eb7e600374fbd993f',
  userCollectionId: '664eb810000df6028a13',
  videoCollectionId: '664eb82600319848abf3',
  storageId: '664eb9a30002ece91aa0',
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
  ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


export const createUser = async (email: string, password: string, username: string) => {

  try {
    const newAccount = await account.create(
      ID.unique(), email, password, username
    );

    if (!newAccount) throw Error;

    const avatarURL = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarURL
      }
    );

    return newUser;
  } catch (err: any) {
    console.log(err);
    throw new Error(err);
  }

};

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (err: any) {
    throw new Error(err);

  }

}