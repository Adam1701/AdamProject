import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Administration</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/admin/products" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Gestion des Produits</h2>
          <p className="text-gray-600">Importer et gérer les produits Nike</p>
        </Link>
        
        <Link 
          href="/admin/orders" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Commandes</h2>
          <p className="text-gray-600">Voir et gérer les commandes</p>
        </Link>
        
        <Link 
          href="/admin/stocks" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Stocks</h2>
          <p className="text-gray-600">Gérer les stocks et inventaire</p>
        </Link>
      </div>
    </div>
  );
}
