import { customInitApp } from "@/libs/firebase-admin-config";
import { auth } from "firebase-admin";
type Params={
  params:{
    userId:string
  }
}
export const GET = async (request: Request,{params}:Params) => {
    try {
      customInitApp();
      const users = await auth().getUser(params.userId);
      return Response.json(users)
    } catch (error: any) {
      return Response.json({error:error.message},{status:500})
    }
  };

export const PUT = async (request: Request,{params}:Params) => {
    try {
      customInitApp();
      const {email,password,displayName} = await request.json();
      const updatedUser:{email:string,displayName:string,password?:string} = {
        email,
        displayName,
      }
      if(password.trim()!=''){
        updatedUser.password = password;
      }
      const user = await auth().updateUser(params.userId,updatedUser);
      return Response.json(user)
    } catch (error: any) {
      return Response.json({error:error.message},{status:500})
    }
  };
 export const DELETE = async (request: Request,{params}:Params) => {
    try {
      customInitApp();
      await auth().deleteUser(params.userId);
      return Response.json({message:`User ${params.userId} deleted`})
    } catch (error: any) {
      return Response.json({error:error.message},{status:500})
    }
  };
  