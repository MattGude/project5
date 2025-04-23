import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '../types';
import { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';

export default function CategoryPage() {
  const { category, subcategory } = useParams();
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  
  const categoryData = categories.find(
    (c) => c.name.toLowerCase() === category?.toLowerCase()
  );
  
  const subcategoryData = categoryData?.subcategories.find(
    (s) => s.name.toLowerCase() === subcategory?.toLowerCase()
  );

  useEffect(() => {
    if (category && subcategory) {
      fetch(`/api/listings?category=${category}&subcategory=${subcategory}`)
        .then((res) => res.json())
        .then(setListings)
        .catch(console.error);
    }
  }, [category, subcategory]);
  

  if (!categoryData || !subcategoryData) {
    return <div>Category not found</div>;
  }

  const handleCreateListing = () => {
    navigate(`/category/${category}/${subcategory}/create`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{subcategoryData.name}</h1>
        <p className="text-gray-600 mt-2">Browse listings in {categoryData.name} → {subcategoryData.name}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Required Information</h2>
        <ul className="grid grid-cols-2 gap-4">
          {subcategoryData.attributes.map((attribute) => (
            <li key={attribute} className="flex items-center text-gray-700">
              <span className="w-4 h-4 bg-blue-100 rounded-full mr-2"></span>
              {attribute}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        {listings.length > 0 ? (
          <div className="grid gap-6">
            {listings.map((listing: any) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {Object.entries(listing.attributes).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium text-gray-600">{key}: </span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600 mb-4">No listings found in this category yet.</p>
            <button
              onClick={handleCreateListing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create First Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}