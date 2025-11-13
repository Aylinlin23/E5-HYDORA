import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { DropIcon, DocumentIcon } from '../ui/Icons';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar teléfono (opcional pero si se proporciona debe ser válido)
    if (formData.phone && !/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('RegisterPage - Enviando datos de registro:', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      });

      // Llamada real a la API
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        address: formData.address || undefined
      };

      const result = await authService.register(registerData);
      
  console.log('RegisterPage - Resultado del registro:', result);

      if (result.success) {
  console.log('RegisterPage - Registro exitoso, redirigiendo a login...');
        // Redirigir al login con mensaje de éxito
        navigate('/login', { 
          state: { 
            message: 'Registro exitoso. Ya puedes hacer login con tu cuenta.' 
          }
        });
      } else {
  console.log('RegisterPage - Error en registro:', result.message);
        setErrors({ submit: result.message || 'Error al registrar usuario. Inténtalo de nuevo.' });
      }
    } catch (error) {
      console.error('Error registrando usuario:', error);
      setErrors({ submit: 'Error de conexión. Verifica tu conexión a internet.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 8px 25px rgba(31, 41, 55, 0.12)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#1F6FEB',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px'
          }}>
            <DropIcon size={28} />
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '8px'
          }}>
            Hydora
          </h1>
          <p style={{
            color: '#6B7280',
            fontSize: '0.9rem'
          }}>
            Sistema de Reportes de Fugas de Agua
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Crear Cuenta
          </h2>
          <p style={{ 
            color: '#6B7280',
            textAlign: 'center'
          }}>
            Únete a Hydora para reportar fugas de agua
          </p>
        </div>

        {errors.submit && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Nombre Completo *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Juan Pérez"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${errors.name ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errors.name && (
              <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="juan@ejemplo.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${errors.email ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errors.email && (
              <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${errors.password ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errors.password && (
              <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                {errors.password}
              </p>
            )}
            <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '4px' }}>
              Mínimo 6 caracteres
            </p>
          </div>

          {/* Confirmar Contraseña */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${errors.confirmPassword ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errors.confirmPassword && (
              <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+52 55 1234 5678"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${errors.phone ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errors.phone && (
              <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Dirección */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Dirección (opcional)
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Av. Reforma 123, CDMX"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Botón de registro */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 24px',
              backgroundColor: loading ? '#9CA3AF' : '#1F6FEB',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Enlace a login */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#6B7280'
          }}>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" style={{
              color: '#1F6FEB',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Inicia sesión
            </Link>
          </p>
        </div>

        {/* Información adicional */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#F0F9FF',
          borderRadius: '8px',
          border: '1px solid #0EA5E9'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#0EA5E9',
            margin: 0,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <DocumentIcon size={16} /> Recibirás un email de verificación para activar tu cuenta
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 