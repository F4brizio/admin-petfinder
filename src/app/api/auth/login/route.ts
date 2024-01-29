// import { customInitApp } from "@/libs/firebase-admin-config";
import { auth } from "firebase-admin";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { email, password } = body;
    if(email==="ADMIN" && password==="ADMIN"){
      return Response.json({token: "ADMIN"}, { status: 200 })
    }
    return Response.json({error: "Invalid credentials"}, { status: 401 })
    
  } catch (error: any) {
    return Response.json({error: error.message}, { status: 500 })
  }
};
