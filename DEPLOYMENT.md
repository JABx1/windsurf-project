# Guía de Despliegue - ABITARE

Esta guía te ayudará a desplegar la aplicación ABITARE en la nube usando Render para el backend y Vercel para el frontend.

## Requisitos Previos

- Cuenta en [GitHub](https://github.com/)
- Cuenta en [Render](https://render.com/)
- Cuenta en [Vercel](https://vercel.com/)
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Git](https://git-scm.com/) instalado localmente
- [Node.js](https://nodejs.org/) (v14 o superior) instalado

## 1. Configuración Inicial

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/abitare.git
   cd abitare
   ```

2. Instala las dependencias:
   ```bash
   # Instalar dependencias del backend
   cd backend
   npm install
   
   # Instalar dependencias del frontend
   cd ../frontend
   npm install
   cd ..
   ```

## 2. Configuración de MongoDB Atlas

1. Inicia sesión en [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crea un nuevo proyecto llamado "ABITARE"
3. Crea un clúster gratilio
4. En "Database Access", crea un nuevo usuario con los siguientes permisos:
   - Usuario: `abitare-user`
   - Contraseña: [genera una contraseña segura]
   - Privilegios: `readWrite` en la base de datos `abitare`

5. En "Network Access", añade la IP `0.0.0.0/0` para permitir conexiones desde cualquier lugar

6. Obtén la cadena de conexión:
   - Ve a "Database" > "Connect" > "Connect your application"
   - Copia la cadena de conexión (reemplaza `<password>` con la contraseña del usuario)

## 3. Configuración del Backend en Render

1. Inicia sesión en [Render](https://dashboard.render.com/)
2. Haz clic en "New" > "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura el servicio:
   - Name: `abitare-backend`
   - Region: Elige la más cercana a tu ubicación
   - Branch: `main`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node server.js`
   - Environment Variables:
     ```
     NODE_ENV=production
     PORT=10000
     MONGODB_URI=tu_cadena_de_conexion_mongodb
     JWT_SECRET=una_cadena_secreta_segura
     JWT_EXPIRE=30d
     ```

5. Haz clic en "Create Web Service"

## 4. Configuración del Frontend en Vercel

1. Inicia sesión en [Vercel](https://vercel.com/)
2. Haz clic en "Add New" > "Project"
3. Conecta tu repositorio de GitHub
4. Configura el proyecto:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Environment Variables:
     ```
     VITE_API_URL=https://abitare-backend.onrender.com/api
     ```

5. Haz clic en "Deploy"

## 5. Configuración de Dominio Personalizado (Opcional)

### En Vercel:
1. Ve a la configuración de tu proyecto
2. Selecciona "Domains"
3. Añade tu dominio personalizado y sigue las instrucciones para verificar la propiedad

### En tu proveedor de DNS:
1. Añade los registros DNS según las instrucciones de Vercel
2. Configura el SSL automático en la configuración de Vercel

## 6. Configuración de Variables de Entorno

### Backend (.env)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://abitare-user:tu_contraseña@cluster0.xxxxx.mongodb.net/abitare?retryWrites=true&w=majority
JWT_SECRET=una_cadena_secreta_segura
JWT_EXPIRE=30d
```

### Frontend (.env.local)
```
VITE_API_URL=https://abitare-backend.onrender.com/api
```

## 7. Comandos Útiles

### Desarrollo Local
```bash
# Iniciar backend
cd backend
npm run dev

# Iniciar frontend (en otra terminal)
cd frontend
npm run dev
```

### Producción
```bash
# Construir frontend para producción
cd frontend
npm run build

# Iniciar backend en producción
cd backend
npm start
```

## 8. Solución de Problemas

### Error de Conexión a MongoDB
- Verifica que la cadena de conexión sea correcta
- Asegúrate de que la IP esté en la lista blanca de MongoDB Atlas
- Verifica que el usuario tenga los permisos correctos

### Error en el Frontend
- Verifica que la variable `VITE_API_URL` esté configurada correctamente
- Revisa la consola del navegador para ver errores de red

### Error en el Backend
- Revisa los logs en el panel de control de Render
- Verifica que todas las variables de entorno estén configuradas correctamente

## 9. Actualizaciones

Para actualizar la aplicación:

1. Haz push de los cambios a la rama `main`
2. Render y Vercel desplegarán automáticamente los cambios
3. Verifica que todo funcione correctamente en los entornos de desarrollo y producción

## 10. Seguridad

- No expongas las variables de entorno en el código
- Usa HTTPS para todas las conexiones
- Mantén las dependencias actualizadas
- Implementa rate limiting en producción
- Configura un WAF (Web Application Firewall) si es necesario

---

¡Listo! Tu aplicación ABITARE debería estar funcionando correctamente en la nube. Si tienes alguna pregunta o problema, no dudes en abrir un issue en el repositorio.
