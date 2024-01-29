import { customInitApp } from "@/libs/firebase-admin-config";
import { auth, firestore } from "firebase-admin";

export const GET = async (request: Request) => {
  try {
    customInitApp();
    const firestoreDb = firestore();
    const collection = firestoreDb.collection("Reports");
    const snapshot = await collection.get();
    const response: any[] = [];
    snapshot.forEach((doc) => {
        const docId = doc.id;
        const docData = doc.data();
      response.push({
        _id: docId,
        ...docData,
      });
    });
    return Response.json(response);
  } catch (error: any) {
    return Response.json({error:error.message},{status:500})
  }
};

export const POST = async (request: Request) => {
  try {
    customInitApp();
    const {_id,...post} = await request.json();
    const firestoreDb = firestore();
    const collection = firestoreDb.collection("Reports");
    const postCreated = await collection.add(post)
    const postCreatedData = await postCreated.get();
    const id = postCreatedData.id;
    const data = postCreatedData.data();
    return Response.json({
        _id:id,
        ...data,
    });
  } catch (error: any) {
    return Response.json({error:error.message},{status:500})
  }
};
