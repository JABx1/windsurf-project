const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

async function testConnection() {
  try {
    console.log('🔌 Conectando a MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conexión exitosa a MongoDB Atlas');
    
    // Verificar si la base de datos existe
    const dbs = await mongoose.connection.db.admin().listDatabases();
    const dbExists = dbs.databases.some(db => db.name === 'abitare');
    
    if (dbExists) {
      console.log('✅ La base de datos "abitare" existe');
    } else {
      console.log('ℹ️ La base de datos "abitare" no existe, se creará automáticamente con el primer uso');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB Atlas:', error.message);
    process.exit(1);
  }
}

testConnection();
