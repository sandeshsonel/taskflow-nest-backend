import { registerAs } from '@nestjs/config';

export default registerAs('firebase', () => {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

  // Option 1: Full service account JSON string
  if (serviceAccountJson) {
    return {
      serviceAccount: JSON.parse(serviceAccountJson),
    };
  }

  // Option 2: Individual fields
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    return {
      serviceAccount: {
        projectId,
        clientEmail,
        privateKey,
      },
    };
  }

  return { serviceAccount: null };
});
