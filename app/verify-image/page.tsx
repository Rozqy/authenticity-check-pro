'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';

interface UploadedFile {
  file: File;
  preview: string;
  name: string;
  size: string;
}

export default function VerifyImagePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [codesFromImage, setCodesFromImage] = useState({
    batchNumber: '',
    serialNumber: '',
    barcode: '',
    manufacturingDate: '',
  });

  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => setBrands(data.brands || []))
      .catch(err => console.error(err));
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: formatFileSize(file.size),
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one image');
      return;
    }
    
    if (!selectedBrand) {
      alert('⚠️ Please select the brand. This is required for fake detection.');
      return;
    }
    
    if (!codesFromImage.batchNumber || !codesFromImage.serialNumber || !codesFromImage.barcode) {
      alert('⚠️ CRITICAL: Please enter batch number, serial number, and barcode. Without these codes, fake products cannot be detected accurately.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    uploadedFiles.forEach((uf) => {
      formData.append('images', uf.file);
    });

    // Add brand and codes if provided
    if (selectedBrand) {
      formData.append('brand', selectedBrand);
    }
    if (codesFromImage.batchNumber) {
      formData.append('batchNumber', codesFromImage.batchNumber);
    }
    if (codesFromImage.serialNumber) {
      formData.append('serialNumber', codesFromImage.serialNumber);
    }
    if (codesFromImage.barcode) {
      formData.append('barcode', codesFromImage.barcode);
    }
    if (codesFromImage.manufacturingDate) {
      formData.append('manufacturingDate', codesFromImage.manufacturingDate);
    }

    try {
      const response = await fetch('/api/verify/image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      // Build result URL with all data
      const params = new URLSearchParams({
        method: 'image',
        result: data.result || 'pending',
        score: (data.score || 0).toString(),
      });
      
      if (selectedBrand) params.append('brand', selectedBrand);
      if (codesFromImage.batchNumber) params.append('batchNumber', codesFromImage.batchNumber);
      if (codesFromImage.serialNumber) params.append('serialNumber', codesFromImage.serialNumber);
      if (codesFromImage.barcode) params.append('barcode', codesFromImage.barcode);
      
      router.push(`/result?${params.toString()}`);
    } catch (error) {
      console.error('Verification error:', error);
      alert('Error verifying image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Product Authenticity
          </h1>
          <p className="text-gray-600 mb-8">
            Upload photos of the product. <strong className="text-red-600">IMPORTANT:</strong> For accurate fake detection, you must enter the batch number, serial number, and barcode visible in the image.
          </p>
          
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Image-Only Verification is Limited</h3>
                <p className="text-sm text-yellow-800">
                  Without product codes, we cannot detect fakes accurately. Image analysis alone cannot verify authenticity. 
                  <strong className="block mt-1">Please enter the batch number, serial number, and barcode from the product for reliable fake detection.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Brand Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand <span className="text-red-600">*</span> (Required for fake detection)
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select brand (required)</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-red-600 mt-1 font-medium">
              ⚠️ Brand selection is required for fake detection. Without brand and codes, fake products may not be detected.
            </p>
          </div>

          {/* Codes from Image (Required) */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-medium text-red-900 mb-3">
              Codes Visible in Image <span className="text-red-600">*</span> (REQUIRED for Fake Detection)
            </h3>
            <p className="text-xs text-red-800 mb-4 font-medium">
              ⚠️ <strong>CRITICAL:</strong> Without these codes, we CANNOT detect fake products. Image analysis alone is not sufficient. 
              Please enter the batch number, serial number, and barcode visible on the product.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-red-900 mb-1">
                  Batch Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={codesFromImage.batchNumber}
                  onChange={(e) => setCodesFromImage({ ...codesFromImage, batchNumber: e.target.value })}
                  placeholder="e.g., HN123456"
                  className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-red-900 mb-1">
                  Serial Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={codesFromImage.serialNumber}
                  onChange={(e) => setCodesFromImage({ ...codesFromImage, serialNumber: e.target.value })}
                  placeholder="e.g., SN789012"
                  className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-red-900 mb-1">
                  Barcode <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={codesFromImage.barcode}
                  onChange={(e) => setCodesFromImage({ ...codesFromImage, barcode: e.target.value })}
                  placeholder="13-digit barcode"
                  className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  value={codesFromImage.manufacturingDate}
                  onChange={(e) => setCodesFromImage({ ...codesFromImage, manufacturingDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center">
              <svg className="w-16 h-16 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drag & drop your images here, or
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Upload photos of the bottle, label, cap, and box. PNG, JPG up to 10MB.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors"
              >
                Select Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Uploaded Files ({uploadedFiles.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      ×
                    </button>
                    <div className="mt-2 text-xs text-gray-600">
                      <p className="truncate">{file.name}</p>
                      <p>{file.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          {uploadedFiles.length > 0 && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {loading ? 'Analyzing...' : 'Start Analysis'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}




