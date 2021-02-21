module.exports = {
    FIREBASE_CONFIG: process.env.REACT_APP_FIREBASE_CONFIG
    //We get process.env.REACT_APP_FIREBASE_CONFIG value either from .env file in client dir (if in dev mode) or from environment var of server (if in prod mode). Make sure that the code you deploy dosen't have the .env file as then react may take value from that file wich will be visible in the sorce code and our secret data will no longer be secret
}