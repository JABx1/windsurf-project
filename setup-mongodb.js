const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: './backend/.env' });

// Configuración de la API de MongoDB Atlas
const MONGODB_ATLAS_API_KEY = process.env.MONGODB_ATLAS_PUBLIC_KEY;
const MONGODB_ATLAS_PRIVATE_KEY = process.env.MONGODB_ATLAS_PRIVATE_KEY;
const MONGODB_ATLAS_GROUP_ID = process.env.MONGODB_ATLAS_GROUP_ID;

const API_BASE_URL = 'https://cloud.mongodb.com/api/atlas/v1.0';

const api = axios.create({
  baseURL: API_BASE_URL,
  auth: {
    username: MONGODB_ATLAS_PUBLIC_KEY,
    password: MONGODB_ATLAS_PRIVATE_KEY
  },
  headers: {
    'Content-Type': 'application/json'
  }
});

async function setupMongoDB() {
  try {
    console.log('Configurando MongoDB Atlas...');
    
    // 1. Crear un usuario de base de datos
    console.log('Creando usuario de base de datos...');
    await api.post(`/groups/${MONGODB_ATLAS_GROUP_ID}/databaseUsers`, {
      databaseName: 'admin',
      username: 'abitare-user',
      roles: [{
        databaseName: 'admin',
        roleName: 'readWriteAnyDatabase'
      }],
      password: generateRandomPassword()
    });

    // 2. Configurar acceso desde cualquier IP
    console.log('Configurando acceso desde cualquier IP...');
    await api.post(`/groups/${MONGODB_ATLAS_GROUP_ID}/accessList`, [
      {
        ipAddress: '0.0.0.0',
        comment: 'Allow access from anywhere'
      }
    ]);

    // 3. Obtener la cadena de conexión
    console.log('Obteniendo cadena de conexión...');
    const { data: cluster } = await api.get(`/groups/${MONGODB_ATLAS_GROUP_ID}/clusters`);
    const connectionString = `mongodb+srv://abitare-user:${process.env.MONGODB_ATLAS_DB_PASSWORD}@${cluster[0].name}.mongodb.net/abitare?retryWrites=true&w=majority`;
    
    // Actualizar el archivo .env
    console.log('Actualizando archivo .env...');
    updateEnvFile(connectionString);
    
    console.log('✅ Configuración de MongoDB Atlas completada con éxito');
    console.log('🔗 Cadena de conexión:', connectionString);
    
  } catch (error) {
    console.error('❌ Error al configurar MongoDB Atlas:', error.response?.data || error.message);
    process.exit(1);
  }
}

function generateRandomPassword() {
  const password = Math.random().toString(36).slice(-10);
  // Guardar la contraseña en las variables de entorno
  process.env.MONGODB_ATLAS_DB_PASSWORD = password;
  return password;
}

function updateEnvFile(connectionString) {
  const envPath = './backend/.env';
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Actualizar MONGODB_URI
  if (envContent.includes('MONGODB_URI=')) {
    envContent = envContent.replace(
      /MONGODB_URI=.*/,
      `MONGODB_URI=${connectionString}`
    );
  } else {
    envContent += `\nMONGODB_URI=${connectionString}\n`;
  }
  
  // Escribir el archivo actualizado
  fs.writeFileSync(envPath, envContent);
}

// Ejecutar la configuración
setupMongoDB();
