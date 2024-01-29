import { customInitApp } from "@/libs/firebase-admin-config";
import { auth } from "firebase-admin";

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
    return Response.json(user)
  } catch (error: any) {
    return Response.json({error:error.message},{status:500})
  }
};