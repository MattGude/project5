import { useParams } from 'react-router-dom';
import { categories } from '../types';

export default function CategoryPage() {
  const { category, subcategory } = useParams();
  
  const categoryData = categories.find(
    (c) => c.name.toLowerCase() === category?.toLowerCase()
  );
  
  const subcategoryData = categoryData?.subcategories.find(
    (s) => s.name.toLowerCase() === subcategory?.toLowerCase()
  );

  if (!categoryData || !subcategoryData) {
    return <div>Category not found</div>;
  }

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
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">No listings found in this category yet.</p>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Create First Listing
          </button>
        </div>
      </div>
    </div>
  );
}