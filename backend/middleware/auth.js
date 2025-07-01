const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar el token JWT
exports.verifyToken = async (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acceso denegado. No se proporcionó token de autenticación.' 
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar al usuario y adjuntarlo a la solicitud
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'La sesión ha expirado, por favor inicia sesión de nuevo' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error en el servidor de autenticación' 
    });
  }
};

// Middleware para verificar rol de administrador
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  res.status(403).json({ 
    success: false, 
    message: 'Acceso denegado. Se requieren privilegios de administrador.' 
  });
};
