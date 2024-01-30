import { customInitApp } from "@/libs/firebase-admin-config";
import { auth, firestore } from "firebase-admin";

export const GET = async (request: Request) => {
  try {
    customInitApp();
    const users = await auth().listUsers();
    return Response.json(users)
  } catch (error: any) {
    return Response.json({error:error.message},{status:500})
  }
};
export const POST = async (request: Request) => {
  try {
    customInitApp();
    const body = await request.json();
    const { email, password, displayName } = body;
    console.log("respuesta: ",email)
    if(!email && !password && !displayName){
      throw new Error("Email, password and displayName are required");
    }
    const user = await auth().createUser({
      email,
      password,
      displayName
    });

    try {
      const userData = {
        address: null,
        email: user.email,
        id: user.uid,
        image: null,
        lastname: "lastname",
        name: "name",
        phone: "123456789",
      };
      const firestoreDb = firestore();
      const docRef = await firestoreDb.collection("Users").add(userData);
      console.log("Documento creado con ID: ", docRef.id);
    } catch (error) {
      console.error("Error al crear documento: ", error);
      throw error;
    }

    return Response.json(user)
  } catch (error: any) {
    return Response.json({error:error.message},{status:500})
  }
};