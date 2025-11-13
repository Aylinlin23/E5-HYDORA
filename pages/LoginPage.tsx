import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { DropIcon } from '../ui/Icons';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Mostrar mensaje de éxito si viene de registro
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Limpiar el estado para que no se muestre en futuras visitas
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.email || !formData.password) {
        setError('Por favor completa todos los campos');
        setLoading(false);
        return;
      }

  console.log('LoginPage - Iniciando login...');
  const loginResult = await login(formData.email, formData.password);
  console.log('LoginPage - Resultado del login:', loginResult);

      if (loginResult.success) {
  console.log('LoginPage - Login exitoso, navegando a dashboard...');
        
        // Mostrar mensaje especial si el usuario está pendiente de verificación
        if (loginResult.user?.status === 'PENDING_VERIFICATION') {
          setSuccessMessage('Login exitoso. Tu cuenta está pendiente de verificación de email.');
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          navigate('/dashboard');
        }
      } else {
  console.log('LoginPage - Login falló:', loginResult.message);
        setError(loginResult.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    setLoading(true);
    setError('');

    try {
      const demoCredentials: Record<string, { email: string; password: string }> = {
        citizen: { email: 'ciudadano@hydora.com', password: 'password123' },
        authority: { email: 'autoridad@hydora.com', password: 'password123' },
        admin: { email: 'admin@hydora.com', password: 'password123' }
      };

      const credentials = demoCredentials[role];
  console.log('LoginPage - Demo login para rol:', role, 'con email:', credentials.email);

      const loginResult = await login(credentials.email, credentials.password);
  console.log('LoginPage - Resultado del demo login:', loginResult);

      if (loginResult.success) {
  console.log('LoginPage - Demo login exitoso, navegando a dashboard...');
        navigate('/dashboard');
      } else {
  console.log('LoginPage - Demo login falló:', loginResult.message);
        setError(loginResult.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      setError('Error de conexión. Verifica tu conexión a internet.');
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
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '30px' }}>
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
            marginBottom: '8px'
          }}>
            Bienvenido de vuelta
          </h2>
          <p style={{ color: '#6B7280' }}>
            Inicia sesión para acceder a tu cuenta
          </p>
        </div>

        {successMessage && (
          <div style={{
            backgroundColor: '#F0F9FF',
            border: '1px solid #0EA5E9',
            color: '#0EA5E9',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {successMessage}
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              textAlign: 'left'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@hydora.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              textAlign: 'left'
            }}>
              Contraseña
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
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

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
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              flex: '1',
              height: '1px',
              backgroundColor: '#E5E7EB'
            }}></div>
            <span style={{
              padding: '0 16px',
              color: '#6B7280',
              fontSize: '0.9rem'
            }}>
              o prueba con una cuenta demo
            </span>
            <div style={{
              flex: '1',
              height: '1px',
              backgroundColor: '#E5E7EB'
            }}></div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            <button
              onClick={() => handleDemoLogin('citizen')}
              disabled={loading}
              style={{
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Ciudadano
            </button>
            <button
              onClick={() => handleDemoLogin('authority')}
              disabled={loading}
              style={{
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Autoridad
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              style={{
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Enlace a registro */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#6B7280'
          }}>
            ¿No tienes una cuenta?{' '}
            <Link to="/register" style={{
              color: '#1F6FEB',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div style={{
          fontSize: '0.8rem',
          color: '#9CA3AF',
          marginTop: '20px'
        }}>
          © 2024 Hydora. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 
