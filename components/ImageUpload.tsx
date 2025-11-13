import { useState, useRef } from 'react';

const ImageUpload = ({ onImagesChange, maxImages = 5, maxSize = 5 * 1024 * 1024 }) => {
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones (mÃ¡ximo 800px de ancho)
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a blob con calidad 0.8
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFiles = async (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= maxSize;
      
      if (!isValidType) {
        alert('Solo se permiten archivos de imagen.');
        return false;
      }
      
      if (!isValidSize) {
        alert(`El archivo ${file.name} es demasiado grande. MÃ¡ximo ${maxSize / 1024 / 1024}MB.`);
        return false;
      }
      
      return true;
    });

    if (previews.length + validFiles.length > maxImages) {
      alert(`MÃ¡ximo ${maxImages} imÃ¡genes permitidas.`);
      return;
    }

    const compressedFiles = await Promise.all(
      validFiles.map(file => compressImage(file))
    );

    const newPreviews = compressedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
    onImagesChange([...previews, ...newPreviews].map(p => p.file));
  };

  const removeImage = (id) => {
    setPreviews(prev => {
      const filtered = prev.filter(p => p.id !== id);
      onImagesChange(filtered.map(p => p.file));
      return filtered;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  return (
    <div className="space-y-4">
      {/* Ãrea de drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
            >
              <span>Subir imÃ¡genes</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                ref={fileInputRef}
              />
            </label>
            <p className="pl-1">o arrastrar y soltar</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF hasta {maxSize / 1024 / 1024}MB cada una
          </p>
        </div>
      </div>

      {/* Previews de imÃ¡genes */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview) => (
            <div key={preview.id} className="relative group">
              <img
                src={preview.url}
                alt={preview.name}
                className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <button
                onClick={() => removeImage(preview.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Eliminar imagen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                {preview.name.length > 20 ? `${preview.name.substring(0, 20)}...` : preview.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contador de imÃ¡genes */}
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {previews.length} de {maxImages} imÃ¡genes
      </div>
    </div>
  );
};

export default ImageUpload; 
