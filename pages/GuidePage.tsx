import { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import MainNavigation from '../components/MainNavigation';

const GuidePage: React.FC = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');

  const guideData = {
    filtros: [
      {
        id: 1,
        title: 'Filtros de Arena',
        description: 'Sistemas naturales que purifican el agua usando capas de arena, grava y carbÃ³n activado.',
        benefits: ['Elimina partÃ­culas suspendidas', 'Reduce turbidez', 'Bajo costo de mantenimiento'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        difficulty: 'FÃ¡cil',
        cost: 'Bajo'
      },
      {
        id: 2,
        title: 'Filtros de CarbÃ³n',
        description: 'Utilizan carbÃ³n activado para absorber contaminantes quÃ­micos y mejorar el sabor del agua.',
        benefits: ['Elimina cloro y quÃ­micos', 'Mejora el sabor', 'Efectivo contra pesticidas'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        difficulty: 'FÃ¡cil',
        cost: 'Medio'
      },
      {
        id: 3,
        title: 'Filtros de Membrana',
        description: 'Sistemas avanzados que filtran partÃ­culas microscÃ³picas y bacterias del agua.',
        benefits: ['Elimina bacterias y virus', 'Agua de alta pureza', 'Ideal para consumo'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        difficulty: 'Intermedio',
        cost: 'Alto'
      }
    ],
    humedales: [
      {
        id: 4,
        title: 'Humedales Superficiales',
        description: 'Sistemas que simulan humedales naturales para tratar aguas residuales de forma ecolÃ³gica.',
        benefits: ['Tratamiento natural', 'Bajo consumo energÃ©tico', 'Biodiversidad local'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        difficulty: 'Intermedio',
        cost: 'Medio'
      },
      {
        id: 5,
        title: 'Humedales Subsuperficiales',
        description: 'Sistemas donde el agua fluye bajo la superficie, ideal para espacios urbanos.',
        benefits: ['Sin mosquitos', 'Menor espacio requerido', 'Tratamiento eficiente'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        difficulty: 'Intermedio',
        cost: 'Medio'
      }
    ],
    recomendaciones: [
      {
        id: 6,
        title: 'ReÃºso DomÃ©stico',
        description: 'TÃ©cnicas para reutilizar agua en el hogar de manera segura y eficiente.',
        benefits: ['Reduce consumo de agua potable', 'Ahorro econÃ³mico', 'Sostenibilidad'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        difficulty: 'FÃ¡cil',
        cost: 'Bajo'
      },
      {
        id: 7,
        title: 'Riego Inteligente',
        description: 'Sistemas de riego que optimizan el uso del agua en jardines y cultivos.',
        benefits: ['Riego eficiente', 'Ahorro de agua', 'Plantas mÃ¡s saludables'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        difficulty: 'FÃ¡cil',
        cost: 'Bajo'
      },
      {
        id: 8,
        title: 'CaptaciÃ³n de Lluvia',
        description: 'Sistemas para recolectar y almacenar agua de lluvia para uso posterior.',
        benefits: ['Agua gratuita', 'Independencia hÃ­drica', 'ReducciÃ³n de escorrentÃ­a'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        difficulty: 'Intermedio',
        cost: 'Medio'
      }
    ]
  };

  const allCards = [
    ...guideData.filtros,
    ...guideData.humedales,
    ...guideData.recomendaciones
  ];

  const getFilteredCards: React.FC = () => {
    if (activeCategory === 'all') return allCards;
    return guideData[activeCategory] || [];
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'FÃ¡cil':
        return 'bg-green-100 text-green-800';
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCostColor = (cost) => {
    switch (cost) {
      case 'Bajo':
        return 'bg-green-100 text-green-800';
      case 'Medio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Alto':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              GuÃ­a de ReÃºso de Agua
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Aprende tÃ©cnicas y mÃ©todos para reutilizar el agua de manera sostenible y eficiente
            </p>
          </div>

          {/* Filtros de categorÃ­as */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Todas las CategorÃ­as
              </button>
              <button
                onClick={() => setActiveCategory('filtros')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'filtros'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Filtros Naturales
              </button>
              <button
                onClick={() => setActiveCategory('humedales')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'humedales'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Humedales Artificiales
              </button>
              <button
                onClick={() => setActiveCategory('recomendaciones')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'recomendaciones'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Recomendaciones de Uso
              </button>
            </div>
          </div>

          {/* Tarjetas informativas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredCards().map((card) => (
              <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {card.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Beneficios:</h4>
                    <ul className="space-y-1">
                      {card.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <svg className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(card.difficulty)}`}>
                      {card.difficulty}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCostColor(card.cost)}`}>
                      Costo: {card.cost}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SecciÃ³n de consejos adicionales */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Consejos para el ReÃºso de Agua
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Ahorro EnergÃ©tico</h3>
                </div>
                <p className="text-gray-600">
                  Los sistemas de reÃºso de agua pueden reducir significativamente el consumo energÃ©tico asociado al tratamiento de agua potable.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Impacto Ambiental</h3>
                </div>
                <p className="text-gray-600">
                  Cada litro de agua reutilizada contribuye a la conservaciÃ³n de recursos hÃ­dricos y reduce la contaminaciÃ³n.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Ahorro EconÃ³mico</h3>
                </div>
                <p className="text-gray-600">
                  Implementar sistemas de reÃºso puede generar ahorros significativos en las facturas de agua a largo plazo.
                </p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-12 bg-indigo-600 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Â¿Tienes dudas sobre el reÃºso de agua?
            </h2>
            <p className="text-indigo-100 mb-6">
              Nuestro equipo estÃ¡ aquÃ­ para ayudarte a implementar soluciones sostenibles en tu hogar o comunidad.
            </p>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Contactar Especialista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePage; 
