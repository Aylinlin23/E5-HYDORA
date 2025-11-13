import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, CalendarIcon, ClipboardIcon, WarningIcon, CheckIcon, DownloadIcon, DropIcon } from '../ui/Icons';

interface WaterGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
  duration: string;
  materials: string[];
  steps: {
    title: string;
    description: string;
    image?: string;
    tips?: string[];
    warnings?: string[];
  }[];
  benefits: string[];
  safetyNotes: string[];
}

const mockGuides: WaterGuide[] = [
  {
    id: '1',
    title: 'Filtrado casero de aguas grises',
    description: 'Aprende a crear un sistema básico de filtrado para reutilizar agua de lavado en riego.',
    category: 'Reúso doméstico',
    imageUrl: '/images/gray-water-filter.jpg',
    difficulty: 'Intermedio',
    duration: '2-3 horas',
    materials: ['Contenedor plástico grande', 'Arena fina', 'Grava', 'Carbón activado', 'Tela filtrante', 'Tubería PVC'],
    steps: [
      {
        title: 'Preparación del contenedor',
        description: 'Perfora agujeros en el fondo del contenedor para el drenaje y limpia bien todos los materiales.',
        tips: ['Usa un taladro con broca de 5mm', 'Lija los bordes de los agujeros'],
        warnings: ['Usa gafas de protección al perforar']
      },
      {
        title: 'Creación de capas filtrantes',
        description: 'Coloca en orden: grava gruesa, arena fina, carbón activado y tela filtrante en la parte superior.',
        tips: ['La grava debe ocupar 1/3 del contenedor', 'El carbón activado elimina olores']
      },
      {
        title: 'Instalación del sistema de salida',
        description: 'Conecta la tubería de salida en la parte inferior para recolectar el agua filtrada.',
        warnings: ['Asegúrate de que las conexiones estén bien selladas']
      },
      {
        title: 'Prueba y mantenimiento',
        description: 'Realiza pruebas con agua limpia primero, luego comienza con aguas grises del lavado.',
        tips: ['Cambia el carbón activado cada 3 meses', 'Limpia la arena mensualmente']
      }
    ],
    benefits: [
      'Reduce el consumo de agua potable en un 30%',
      'Aprovecha aguas residuales domésticas',
      'Costo de implementación bajo',
      'Fácil mantenimiento'
    ],
    safetyNotes: [
      'No usar para agua que haya tenido contacto con químicos fuertes',
      'El agua filtrada solo debe usarse para riego, no para consumo',
      'Mantener el sistema limpio para evitar malos olores'
    ]
  },
  {
    id: '2',
    title: 'Captación de agua de lluvia',
    description: 'Sistema sencillo para recolectar y almacenar agua de lluvia desde techos y superficies.',
    category: 'Captación',
    imageUrl: '/images/rainwater-collection.jpg',
    difficulty: 'Fácil',
    duration: '1-2 horas',
    materials: ['Canaletas', 'Contenedor de almacenamiento', 'Filtro de hojas', 'Tubería', 'Llave de paso'],
    steps: [
      {
        title: 'Instalación de canaletas',
        description: 'Asegura que las canaletas estén limpias y dirijan el agua hacia un punto de recolección.',
        tips: ['Verifica que tengan la inclinación correcta', 'Sella cualquier fuga']
      },
      {
        title: 'Colocación del filtro',
        description: 'Instala un filtro de hojas en la bajada para evitar que entren desechos al contenedor.',
        warnings: ['Revisa y limpia el filtro regularmente']
      },
      {
        title: 'Conexión del contenedor',
        description: 'Conecta la tubería desde las canaletas hasta el contenedor de almacenamiento.',
        tips: ['Eleva el contenedor para crear presión natural', 'Asegura que tenga tapa para evitar mosquitos']
      }
    ],
    benefits: [
      'Agua gratuita para riego y limpieza',
      'Reduce la carga en sistemas de drenaje',
      'Independencia del suministro municipal',
      'Contribuye a la sostenibilidad'
    ],
    safetyNotes: [
      'Limpia el techo antes de la temporada de lluvias',
      'No usar para consumo humano sin tratamiento adicional',
      'Mantener contenedores tapados para evitar criaderos de mosquitos'
    ]
  },
  {
    id: '3',
    title: 'Riego por goteo casero',
    description: 'Crea un sistema de riego eficiente que ahorra hasta 50% de agua en jardines y huertos.',
    category: 'Ahorro en jardín',
    imageUrl: '/images/drip-irrigation.jpg',
    difficulty: 'Intermedio',
    duration: '3-4 horas',
    materials: ['Manguera principal', 'Goteros', 'Conectores T', 'Temporizador', 'Filtro de agua'],
    steps: [
      {
        title: 'Planificación del sistema',
        description: 'Mide el área y planifica la distribución de mangueras según las necesidades de cada planta.',
        tips: ['Agrupa plantas con necesidades similares de agua', 'Considera la presión disponible']
      },
      {
        title: 'Instalación de línea principal',
        description: 'Instala la manguera principal conectando desde la fuente de agua hasta el área de riego.',
        warnings: ['Usa reguladores de presión si es necesario']
      },
      {
        title: 'Colocación de goteros',
        description: 'Instala goteros cerca de cada planta según sus necesidades específicas de agua.',
        tips: ['Plantas grandes necesitan 2-3 goteros', 'Ajusta el flujo según la temporada']
      },
      {
        title: 'Programación automática',
        description: 'Configura el temporizador para riego automático en horarios óptimos.',
        tips: ['Riega temprano en la mañana', 'Ajusta tiempos según el clima']
      }
    ],
    benefits: [
      'Ahorro de agua del 40-50%',
      'Mejor crecimiento de plantas',
      'Reduce trabajo manual',
      'Previene enfermedades por exceso de humedad'
    ],
    safetyNotes: [
      'Revisa regularmente que los goteros no estén obstruidos',
      'Ajusta según las condiciones climáticas',
      'Usa temporizador para evitar sobre-riego'
    ]
  },
  {
    id: '4',
    title: 'Aprovechamiento de agua de aire acondicionado',
    description: 'Recolecta y utiliza el agua condensada de aires acondicionados para tareas domésticas.',
    category: 'Reúso doméstico',
    imageUrl: '/images/ac-water-collection.jpg',
    difficulty: 'Fácil',
    duration: '30 minutos',
    materials: ['Contenedor recolector', 'Manguera de drenaje', 'Soporte para contenedor'],
    steps: [
      {
        title: 'Ubicación del drenaje',
        description: 'Identifica el punto de drenaje del aire acondicionado y calcula el volumen de agua.',
        tips: ['Un AC produce 5-20 litros por día', 'Busca el punto más bajo del equipo']
      },
      {
        title: 'Instalación del recolector',
        description: 'Coloca un contenedor bajo el drenaje o conecta una manguera para dirigir el agua.',
        warnings: ['Asegura que el contenedor no se desborde']
      },
      {
        title: 'Filtración básica',
        description: 'Pasa el agua por un filtro simple para eliminar posibles impurezas.',
        tips: ['Usa tela fina o filtro de café', 'Almacena en contenedor limpio']
      }
    ],
    benefits: [
      'Agua destilada de alta calidad',
      'Excelente para planchado y limpieza',
      'Aprovecha un recurso que se desperdicia',
      'Reduce consumo de agua potable'
    ],
    safetyNotes: [
      'El agua de AC es destilada, no potable',
      'Mantener contenedores limpios',
      'Cambiar el agua regularmente para evitar estancamiento'
    ]
  },
  {
    id: '5',
    title: 'Compostaje con control de humedad',
    description: 'Técnica para compostar usando menos agua y aprovechando la humedad natural.',
    category: 'Agricultura sostenible',
    imageUrl: '/images/composting-water.jpg',
    difficulty: 'Intermedio',
    duration: '45 minutos setup',
    materials: ['Contenedor para compost', 'Material orgánico', 'Material seco', 'Termómetro', 'Pala'],
    steps: [
      {
        title: 'Preparación de materiales',
        description: 'Mezcla materiales verdes (húmedos) y marrones (secos) en proporción 3:1.',
        tips: ['Materiales verdes: restos de cocina, césped', 'Materiales marrones: hojas secas, papel']
      },
      {
        title: 'Control de humedad',
        description: 'Mantén la humedad como una esponja exprimida, ni muy seca ni empapada.',
        warnings: ['Demasiada agua puede crear malos olores']
      },
      {
        title: 'Volteo y monitoreo',
        description: 'Voltea el compost cada 2 semanas y monitorea temperatura y humedad.',
        tips: ['Temperatura ideal: 50-65°C', 'Agrega agua solo si está muy seco']
      }
    ],
    benefits: [
      'Mejora la retención de agua en suelos',
      'Reduce necesidad de riego',
      'Aprovecha residuos orgánicos',
      'Mejora la estructura del suelo'
    ],
    safetyNotes: [
      'No compostar carnes o lácteos',
      'Mantener alejado de fuentes de agua potable',
      'Usar guantes al manipular'
    ]
  },
  {
    id: '6',
    title: 'Jardín de lluvia para drenaje',
    description: 'Crea un área de plantación que capture y filtre agua de lluvia naturalmente.',
    category: 'Captación',
    imageUrl: '/images/rain-garden.jpg',
    difficulty: 'Avanzado',
    duration: '1-2 días',
    materials: ['Plantas nativas', 'Arena', 'Compost', 'Grava', 'Pala', 'Nivel'],
    steps: [
      {
        title: 'Selección del sitio',
        description: 'Elige un área baja que reciba escorrentía natural pero no se inunde constantemente.',
        tips: ['10 metros de distancia de estructuras', 'Observa el flujo de agua en lluvias']
      },
      {
        title: 'Excavación y preparación',
        description: 'Excava un área poco profunda (15-20cm) con pendiente suave hacia el centro.',
        warnings: ['Verifica no haya tuberías subterráneas antes de excavar']
      },
      {
        title: 'Mejoramiento del suelo',
        description: 'Mezcla el suelo existente con compost y arena para mejorar drenaje.',
        tips: ['60% suelo original, 30% compost, 10% arena', 'Evita suelos muy arcillosos']
      },
      {
        title: 'Plantación estratégica',
        description: 'Planta especies nativas que toleren tanto sequía como humedad.',
        tips: ['Plantas más altas en el centro', 'Cubre con mulch orgánico']
      }
    ],
    benefits: [
      'Reduce escorrentía e inundaciones',
      'Filtra contaminantes naturalmente',
      'Crea hábitat para vida silvestre',
      'Mejora estética del paisaje'
    ],
    safetyNotes: [
      'No usar en áreas con contaminación química',
      'Mantener drenaje funcional',
      'Monitorear crecimiento de plantas'
    ]
  }
];

const categories = ['Todas', 'Reúso doméstico', 'Captación', 'Ahorro en jardín', 'Agricultura sostenible'];

const WaterGuidesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedGuide, setSelectedGuide] = useState<WaterGuide | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filteredGuides = useMemo(() => {
    return mockGuides.filter(guide => {
      const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guide.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || guide.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleViewGuide = (guide: WaterGuide) => {
    setSelectedGuide(guide);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedGuide(null);
  };

  const handleDownloadPDF = (guide: WaterGuide) => {
    // Simular descarga de PDF
    alert(`Descargando guía: "${guide.title}" en PDF...`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return '#22C55E';
      case 'Intermedio': return '#F59E0B';
      case 'Avanzado': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        {/* Botón de regreso */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#1F6FEB',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(31, 111, 235, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1D4ED8';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(31, 111, 235, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1F6FEB';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(31, 111, 235, 0.2)';
            }}
          >
            <span style={{ fontSize: '16px' }}>←</span>
            Volver al Dashboard
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <DropIcon size={36} />
            Guías de Cuidado y Reúso del Agua
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6B7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Aprende técnicas prácticas y sostenibles para conservar, reutilizar y aprovechar mejor el agua en tu hogar y comunidad.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '16px',
        marginBottom: '32px',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Buscar guías por palabra clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '2px solid #E5E7EB',
              borderRadius: '12px',
              fontSize: '16px',
              transition: 'border-color 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '14px 16px',
            border: '2px solid #E5E7EB',
            borderRadius: '12px',
            fontSize: '16px',
            backgroundColor: 'white',
            minWidth: '200px',
            cursor: 'pointer'
          }}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Results Counter */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>
          {filteredGuides.length} guía{filteredGuides.length !== 1 ? 's' : ''} encontrada{filteredGuides.length !== 1 ? 's' : ''}
          {selectedCategory !== 'Todas' && ` en "${selectedCategory}"`}
          {searchTerm && ` para "${searchTerm}"`}
        </p>
      </div>

      {/* Guides Grid */}
      {filteredGuides.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {filteredGuides.map(guide => (
            <div
              key={guide.id}
              className="card"
              style={{
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid #E5E7EB'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onClick={() => handleViewGuide(guide)}
            >
              {/* Image Placeholder */}
              <div style={{
                height: '200px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '48px',
                position: 'relative'
              }}>
                <DropIcon size={48} />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: getDifficultyColor(guide.difficulty),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {guide.difficulty}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{
                    backgroundColor: '#F0F9FF',
                    color: '#0369A1',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {guide.category}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '8px',
                  lineHeight: '1.4'
                }}>
                  {guide.title}
                </h3>

                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  lineHeight: '1.5',
                  marginBottom: '16px'
                }}>
                  {guide.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}><CalendarIcon size={14} /> {guide.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}><ClipboardIcon size={14} /> {guide.materials.length} materiales</span>
                  </div>
                </div>

                <button
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#22C55E',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#16A34A'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#22C55E'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewGuide(guide);
                  }}
                >
                  Ver guía completa →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div style={{
          textAlign: 'center',
          padding: '60px 24px',
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}><SearchIcon size={48} /></div>
          <h3 style={{ fontSize: '18px', color: '#1F2937', marginBottom: '8px' }}>
            No se encontraron guías
          </h3>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>
            No hay guías que coincidan con tu búsqueda actual.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Todas');
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Ver todas las guías
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedGuide && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '16px'
            }}>
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{
                    backgroundColor: '#F0F9FF',
                    color: '#0369A1',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {selectedGuide.category}
                  </span>
                  <span style={{
                    backgroundColor: getDifficultyColor(selectedGuide.difficulty),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginLeft: '8px'
                  }}>
                    {selectedGuide.difficulty}
                  </span>
                </div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1F2937',
                  marginBottom: '8px'
                }}>
                  {selectedGuide.title}
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#6B7280',
                  lineHeight: '1.5'
                }}>
                  {selectedGuide.description}
                </p>
              </div>
              <button
                onClick={handleCloseDetail}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {/* Info Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
              }}>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}><CalendarIcon size={20} /></div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>Duración</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{selectedGuide.duration}</div>
                </div>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}><ClipboardIcon size={20} /></div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>Materiales</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{selectedGuide.materials.length} elementos</div>
                </div>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}><ClipboardIcon size={20} /></div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>Pasos</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{selectedGuide.steps.length} etapas</div>
                </div>
              </div>

              {/* Materials */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ClipboardIcon size={20} /> Materiales necesarios
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '8px'
                }}>
                  {selectedGuide.materials.map((material, index) => (
                    <div key={index} style={{
                      padding: '8px 12px',
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #DBEAFE',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#1E40AF'
                    }}>
                      ✓ {material}
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ClipboardIcon size={18} /> Pasos a seguir
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {selectedGuide.steps.map((step, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '20px',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{
                        minWidth: '32px',
                        height: '32px',
                        backgroundColor: '#22C55E',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1F2937',
                          marginBottom: '8px'
                        }}>
                          {step.title}
                        </h4>
                        <p style={{
                          fontSize: '14px',
                          color: '#6B7280',
                          lineHeight: '1.5',
                          marginBottom: '12px'
                        }}>
                          {step.description}
                        </p>
                        
                        {step.tips && step.tips.length > 0 && (
                          <div style={{ marginBottom: '8px' }}>
                            <div style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#059669',
                              marginBottom: '4px'
                            }}>
                              <ClipboardIcon size={14} /> Consejos:
                            </div>
                            {step.tips.map((tip, tipIndex) => (
                              <div key={tipIndex} style={{
                                fontSize: '12px',
                                color: '#047857',
                                marginLeft: '16px'
                              }}>
                                • {tip}
                              </div>
                            ))}
                          </div>
                        )}

                        {step.warnings && step.warnings.length > 0 && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#DC2626',
                              marginBottom: '4px'
                            }}>
                              <WarningIcon size={14} /> Advertencias:
                            </div>
                            {step.warnings.map((warning, warningIndex) => (
                              <div key={warningIndex} style={{
                                fontSize: '12px',
                                color: '#B91C1C',
                                marginLeft: '16px'
                              }}>
                                • {warning}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckIcon size={18} /> Beneficios
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '12px'
                }}>
                  {selectedGuide.benefits.map((benefit, index) => (
                    <div key={index} style={{
                      padding: '12px',
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #D1FAE5',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#065F46',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <CheckIcon size={16} />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Notes */}
              {selectedGuide.safetyNotes.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <WarningIcon size={18} /> Notas de seguridad
                  </h3>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '8px'
                  }}>
                    {selectedGuide.safetyNotes.map((note, index) => (
                      <div key={index} style={{
                        fontSize: '14px',
                        color: '#991B1B',
                        marginBottom: index < selectedGuide.safetyNotes.length - 1 ? '8px' : '0',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}>
                        <span style={{ marginTop: '2px' }}><WarningIcon size={14} /></span>
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                paddingTop: '24px',
                borderTop: '1px solid #E5E7EB'
              }}>
                <button
                  onClick={() => handleDownloadPDF(selectedGuide)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <DownloadIcon size={16} /> Descargar PDF
                </button>
                <button
                  onClick={handleCloseDetail}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6B7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterGuidesPage;