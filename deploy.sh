#!/bin/bash

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Iniciando despliegue de ABITARE...${NC}"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
  echo -e "${RED}❌ Error: No se encuentra la estructura del proyecto. Asegúrate de ejecutar este script desde la raíz del proyecto.${NC}"
  exit 1
fi

# 1. Configurar variables de entorno
if [ ! -f "backend/.env" ]; then
  echo -e "${YELLOW}⚠️  Creando archivo .env de ejemplo...${NC}"
  cp backend/.env.example backend/.env
  
  # Generar un secreto JWT seguro
  JWT_SECRET=$(openssl rand -base64 32 | tr -d '\n')
  echo "JWT_SECRET=$JWT_SECRET" >> backend/.env
  
  echo -e "${GREEN}✅ Archivo .env creado con éxito${NC}"
fi

# 2. Instalar dependencias del backend
echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"
cd backend
npm install
cd ..

# 3. Instalar dependencias del frontend
echo -e "${YELLOW}📦 Instalando dependencias del frontend...${NC}"
cd frontend
npm install
cd ..

# 4. Configurar MongoDB Atlas
echo -e "${YELLOW}🌐 Configurando MongoDB Atlas...${NC}"
if [ -z "$MONGODB_ATLAS_PUBLIC_KEY" ] || [ -z "$MONGODB_ATLAS_PRIVATE_KEY" ] || [ -z "$MONGODB_ATLAS_GROUP_ID" ]; then
  echo -e "${YELLOW}⚠️  Variables de entorno de MongoDB Atlas no encontradas. Configurando con valores por defecto...${NC}"
  
  # Crear archivo .env temporal para MongoDB Atlas
  echo "MONGODB_ATLAS_PUBLIC_KEY=your_public_key" > .env.mongodb
  echo "MONGODB_ATLAS_PRIVATE_KEY=your_private_key" >> .env.mongodb
  echo "MONGODB_ATLAS_GROUP_ID=your_group_id" >> .env.mongodb
  
  echo -e "${YELLOW}📝 Por favor, edita el archivo .env.mongodb con tus credenciales de MongoDB Atlas y ejecuta:${NC}"
  echo -e "${YELLOW}   $ source .env.mongodb && npm run setup:mongodb${NC}"
else
  npm run setup:mongodb
fi

# 5. Iniciar servicios localmente
echo -e "${YELLOW}🚀 Iniciando servicios localmente...${NC}"
echo -e "${GREEN}✅ Configuración local completada!${NC}"
echo -e "\nPara iniciar los servicios, ejecuta en terminales separados:"
echo -e "1. ${YELLOW}cd backend && npm run dev${NC} - Para el backend"
echo -e "2. ${YELLOW}cd frontend && npm run dev${NC} - Para el frontend"
echo -e "\n🌐 Accede a la aplicación en: ${GREEN}http://localhost:3000${NC}"

# 6. Instrucciones para despliegue en la nube
echo -e "\n${YELLOW}☁️  Para desplegar en la nube:${NC}"
echo "1. Crea una cuenta en Render (https://render.com) y Vercel (https://vercel.com)"
echo "2. Conecta tu repositorio de GitHub"
echo "3. Sigue las instrucciones en el archivo DEPLOYMENT.md"

echo -e "\n${GREEN}✨ ¡Configuración completada con éxito! ✨${NC}"
