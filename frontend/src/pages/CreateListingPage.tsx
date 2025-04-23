import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { categories } from '../types';
import { mockDb } from '../lib/mockDb';

export default function CreateListingPage() {
  const { category, subcategory } = useParams();
  const { user } = useAuth();
  console.log(user);
  const navigate = useNavigate();
  
  const categoryData = categories.find(
    (c) => c.name.toLowerCase() === category?.toLowerCase()
  );
  
  const subcategoryData = categoryData?.subcategories.find(
    (s) => s.name.toLowerCase() === subcategory?.toLowerCase()
  );

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          Please sign in to create a listing
        </div>
      </div>
    );
  }

  if (!categoryData || !subcategoryData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Category not found
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all fields are filled
    const missingFields = subcategoryData.attributes.filter(
      attr => !formData[attr] || formData[attr].trim() === ''
    );
    
    if (missingFields.length > 0) {
      setError(`Please fill in all fields: ${missingFields.join(', ')}`);
      return;
    }

    await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData['Title'] || formData[subcategoryData.attributes[0]],
          category: categoryData.name,
          subcategory: subcategoryData.name,
          attributes: formData,
          price: formData['Price'] || formData['Rate'],
          description: formData['Description'],
          location: formData['City'] || formData['Address'] || '',
          contact: formData['Phone'] || formData['Contact'] || '',
          user_id: user.id
        })
      });
      
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Create New Listing in {subcategoryData.name}
        </h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {subcategoryData.attributes.map((attribute) => (
            <div key={attribute}>
              <label htmlFor={attribute} className="block text-sm font-medium text-gray-700 mb-1">
                {attribute}
              </label>
              <input
                type={attribute.toLowerCase().includes('price') || attribute.toLowerCase().includes('rate') ? 'number' : 'text'}
                id={attribute}
                value={formData[attribute] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [attribute]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter ${attribute.toLowerCase()}`}
              />
            </div>
          ))}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/category/${category}/${subcategory}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}