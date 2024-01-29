import { customInitApp } from "@/libs/firebase-admin-config";
import { auth, firestore } from "firebase-admin";
type Params={
  params:{
    postId:string
  }
}
export const GET = async (request: Request,{params}:Params) => {
    try {
      customInitApp();
      const firestoreDb = firestore();
      const collection = firestoreDb.collection("Reports");
      const documentRef = collection.doc(params.postId);
      const documentSnapshot = await documentRef.get();
      if(!documentSnapshot.exists){
        return Response.json({message:"Post not found"},{status:404})
      }
      const documentData = documentSnapshot.data();
      return Response.json({
        _id:documentSnapshot.id,
        ...documentData
      })
    } catch (error: any) {
      return Response.json({error:error.message},{status:500})
    }
  };

export const PUT = async (request: Request,{params}:Params) => {
    try {
      customInitApp();
      const {_id,...post} = await request.json();
      const firestoreDb = firestore();
      const collection = firestoreDb.collection("Reports");
      const documentRef = collection.doc(params.postId);
      await documentRef.update(post);
      const documentSnapshot = await documentRef.get();
      const documentData = documentSnapshot.data();
      
      return Response.json({
        _id:documentSnapshot.id,
        ...documentData
      })
    } catch (error: any) {
      return Response.json({error:error.message},{status:500})
    }
  };

 export const DELETE = async (request: Request,{params}:Params) => {
    try {
       customInitApp();
      const firestoreDb = firestore();
      const collection = firestoreDb.collection("Reports");
      const documentRef = collection.doc(params.postId);
      await documentRef.delete();
      return Response.json({message:`User ${params.postId} deleted`})
    } catch (error: any) {
      // console.log(JSON.stringify(error))
      return new Response(error.message, { status: 500 });
    }
  };
  