import { initializeApp, getApps, cert, ServiceAccount, getApp } from 'firebase-admin/app';
import serviceAccountCredentials from './serviceAccountKey.json';

const serviceAccount = serviceAccountCredentials as ServiceAccount;

const firebaseAdminConfig = {
    credential: cert(serviceAccount),
    databaseURL: "https://app-mudate-pe-default-rtdb.firebaseio.com"
}

export const customInitApp=()=>{
    if(!getApps().length){
        initializeApp(firebaseAdminConfig)
    }
}