'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function ProductsAdminPage() {
  const [isImporting, setIsImporting] = useState(false);
  const [isImportingMulti, setIsImportingMulti] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  const handleImportNike = async () => {
    setIsImporting(true);
    setImportResult(null);

    try {
      const response = await fetch('/api/products/import-nike', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pages: 2,
          productsPerPage: 20
        })
      });

      const result = await response.json();
      setImportResult(result);
    } catch (error) {
      setImportResult({
        success: false,
        error: 'Erreur lors de l\'importation',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportMultiBrands = async () => {
    setIsImportingMulti(true);
    setImportResult(null);

    try {
      const response = await fetch('/api/products/import-multi-brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      setImportResult(result);
    } catch (error) {
      setImportResult({
        success: false,
        error: 'Erreur lors de l\'importation multi-marques',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setIsImportingMulti(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des Produits</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Importation Nike */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Importation Nike</h2>
          <p className="text-gray-600 mb-4">
            Importez des produits Nike depuis l'API KicksCrew.
          </p>
          
          <Button
            onClick={handleImportNike}
            disabled={isImporting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            {isImporting ? 'Importation en cours...' : 'Importer Nike'}
          </Button>
        </div>

        {/* Importation Multi-marques */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Importation Multi-marques</h2>
          <p className="text-gray-600 mb-4">
            Importez 100+ produits de 5 marques : Nike, Adidas, New Balance, Converse, Puma.
          </p>
          
          <Button
            onClick={handleImportMultiBrands}
            disabled={isImportingMulti}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            {isImportingMulti ? 'Importation en cours...' : 'Importer 100+ Produits'}
          </Button>
        </div>
      </div>

      {importResult && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Résultats de l'importation</h3>
          
          <div className={`p-4 rounded-md ${
            importResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <h4 className="font-semibold">
              {importResult.success ? '✅ Importation réussie !' : '❌ Erreur d\'importation'}
            </h4>
            
            {importResult.success ? (
              <div className="mt-2">
                <p><strong>Total produits importés:</strong> {importResult.totalProducts || 0}</p>
                <p><strong>Erreurs:</strong> {importResult.totalErrors || 0}</p>
                
                {importResult.results && (
                  <div className="mt-3">
                    <h5 className="font-medium mb-2">Détail par marque:</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      {importResult.results.map((result: any, index: number) => (
                        <div key={index} className="bg-white bg-opacity-50 p-2 rounded">
                          <strong>{result.brand}:</strong> ✅ {result.success} produits
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-2">
                <p><strong>Erreur:</strong> {importResult.error}</p>
                {importResult.details && (
                  <p className="text-sm mt-1 opacity-75">
                    Détails: {importResult.details}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-xl font-semibold mb-4">Actions disponibles</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Importation automatique</h3>
              <p className="text-sm text-gray-600">Récupère les dernières sneakers Nike depuis l'API</p>
            </div>
            <Button 
              onClick={handleImportNike}
              disabled={isImporting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isImporting ? 'Importation...' : 'Importer'}
            </Button>
          </div>
          
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Voir tous les produits</h3>
              <p className="text-sm text-gray-600">Consulter le catalogue complet</p>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Voir le catalogue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
