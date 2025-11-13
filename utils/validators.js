/**
 * Utilidades para validaciones
 */

// Validar email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar coordenadas
const isValidCoordinates = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
};

// Validar prioridad
const isValidPriority = (priority) => {
  const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  return validPriorities.includes(priority);
};

// Validar estado
const isValidStatus = (status) => {
  const validStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
  return validStatuses.includes(status);
};

// Validar rol
const isValidRole = (role) => {
  const validRoles = ['ADMIN', 'AUTHORITY', 'CITIZEN'];
  return validRoles.includes(role);
};

// Validar contraseña
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validar URLs de fotos
const isValidPhotoUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validar array de URLs de fotos
const isValidPhotoUrls = (photos) => {
  if (!Array.isArray(photos)) return false;
  return photos.every(url => isValidPhotoUrl(url));
};

module.exports = {
  isValidEmail,
  isValidCoordinates,
  isValidPriority,
  isValidStatus,
  isValidRole,
  isValidPassword,
  isValidPhotoUrl,
  isValidPhotoUrls
}; 