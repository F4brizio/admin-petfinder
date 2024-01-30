import * as crypto from 'crypto';
import { customInitApp } from "@/libs/firebase-admin-config";
import { firestore } from "firebase-admin";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Hashea la contraseña usando SHA-3
    const hashedPassword = crypto.createHash('sha3-256').update(password).digest('hex');
    console.log(hashedPassword)
    customInitApp();
    const firestoreDb = firestore();
    const snapshot = await firestoreDb.collection('superadmin').where('username', '==', email).where('password', '==', hashedPassword).get();

    if (!snapshot.empty) {
      // Si se encuentra una coincidencia, retorna un token exitoso
      return Response.json({ token: "ADMIN" }, { status: 200 });
    } else {
      // Si no se encuentra una coincidencia, retorna un error de credenciales inválidas
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }
  } catch (error: any) {
    // Maneja errores
    return Response.json({ error: error.message }, { status: 500 });
  }
};