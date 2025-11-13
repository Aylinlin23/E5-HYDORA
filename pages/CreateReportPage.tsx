import React, { useState, useEffect } from 'react';
import { CheckIcon, WarningIcon, CameraIcon } from '../ui/Icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useStats } from '../store/StatsContext';
import Layout from '../components/Layout';
import NotificationToast from '../components/NotificationToast';
import { reportService } from '../services/api';

const CreateReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshStats } = useStats();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    priority: 'MEDIUM',
    photos: [] as File[]
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Obtener ubicación actual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error obteniendo ubicación:', error);
        }
      );
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...files].slice(0, 5) // Máximo 5 fotos
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
    }

    if (!location) {
      newErrors.location = 'Debe permitir el acceso a la ubicación';
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
      // Preparar datos del reporte
      const reportData = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        latitude: location!.latitude,
        longitude: location!.longitude,
        priority: formData.priority,
        photos: formData.photos.map(file => URL.createObjectURL(file)).join(',')
      };

      // Llamar al servicio de API
      const response = await reportService.create(reportData);
      
      if (response.success) {
        setSuccessMessage('Reporte creado exitosamente. Las autoridades han sido notificadas.');
        setShowSuccessToast(true);
        
        // Actualizar estadísticas globales
        await refreshStats();
        
        // Limpiar formulario
        setFormData({
          title: '',
          description: '',
          address: '',
          priority: 'MEDIUM',
          photos: []
        });
        
        // Redirigir después de un breve delay
        setTimeout(() => {
          navigate('/my-reports');
        }, 2000);
      } else {
        setErrors({ submit: response.message || 'Error al crear el reporte. Inténtalo de nuevo.' });
      }
    } catch (error) {
      console.error('Error creando reporte:', error);
      setErrors({ submit: 'Error de conexión. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

    return (
    <Layout>
      <div style={{
        padding: '24px'
      }}>
          {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        padding: '16px 24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(31,41,55,0.08)',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ←
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937' }}>
              Crear Nuevo Reporte
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              Reporta una fuga o desvío de agua
                </p>
              </div>
            </div>
          </div>

          {/* Formulario */}
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {/* Título */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Título del Reporte *
            </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
              placeholder="Ej: Fuga de agua en la esquina de Reforma y Juárez"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${errors.title ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errors.title && (
              <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                {errors.title}
              </p>
            )}
                </div>

          {/* Descripción */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Descripción Detallada *
            </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
              placeholder="Describe la fuga o desvío de agua. Incluye detalles como el tamaño, si hay agua estancada, si afecta el tránsito, etc."
                    rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${errors.description ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
            {errors.description && (
              <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                {errors.description}
              </p>
            )}
                </div>

          {/* Dirección */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Dirección *
            </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
              placeholder="Dirección exacta donde se encuentra la fuga"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${errors.address ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {errors.address && (
              <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                {errors.address}
              </p>
            )}
                </div>

          {/* Prioridad */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Prioridad
            </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            >
              <option value="LOW">Baja - Fuga menor</option>
              <option value="MEDIUM">Media - Fuga moderada</option>
              <option value="HIGH">Alta - Fuga importante</option>
              <option value="URGENT">Urgente - Desbordamiento</option>
                  </select>
                </div>

          {/* Ubicación */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Ubicación GPS
            </label>
            <div style={{
              padding: '16px',
              backgroundColor: location ? '#F0F9FF' : '#FEF2F2',
              border: `1px solid ${location ? '#0EA5E9' : '#FECACA'}`,
              borderRadius: '8px'
            }}>
              {location ? (
                <div>
                  <p style={{ color: '#0EA5E9', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckIcon size={14} /> Ubicación obtenida
                  </p>
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>
                    Coordenadas: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </p>
                  </div>
              ) : (
                <div>
                  <p style={{ color: '#EF4444', fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <WarningIcon size={14} /> Ubicación no disponible
                  </p>
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>
                    Permite el acceso a la ubicación para mejor precisión
                  </p>
                </div>
              )}
            </div>
            {errors.location && (
              <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '4px' }}>
                {errors.location}
              </p>
            )}
              </div>

              {/* Fotos */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Fotos (opcional)
            </label>
            <div style={{
              border: '2px dashed #D1D5DB',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#F9FAFB'
            }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
                id="photo-upload"
              />
                <label htmlFor="photo-upload" style={{
                cursor: 'pointer',
                color: '#1F6FEB',
                fontWeight: '500'
              }}>
                <CameraIcon size={16} /> Seleccionar fotos (máximo 5)
              </label>
              <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>
                Las fotos ayudan a las autoridades a evaluar mejor la situación
              </p>
            </div>

            {/* Vista previa de fotos */}
            {formData.photos.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                  Fotos seleccionadas ({formData.photos.length}/5):
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '8px'
                }}>
                  {formData.photos.map((photo, index) => (
                    <div key={index} style={{
                      position: 'relative',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Foto ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          backgroundColor: '#EF4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>

          {/* Botones */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'flex-end',
            marginTop: '32px'
          }}>
              <button
                type="button"
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: '#6B7280',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
              className="button"
              style={{
                padding: '12px 24px',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Creando reporte...' : 'Crear Reporte'}
              </button>
            </div>

          {errors.submit && (
            <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '16px', textAlign: 'center' }}>
              {errors.submit}
            </p>
          )}
          </form>
      </div>
      </div>

      {/* Notificación de éxito */}
      <NotificationToast
        message={successMessage}
        type="success"
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        duration={3000}
      />
    </Layout>
  );
};

export default CreateReportPage; 
