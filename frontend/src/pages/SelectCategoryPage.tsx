import { categories } from '../types';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function SelectCategoryPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Home
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Select a Category
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Choose the category that best fits what you're listing
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {categories.map((category) => (
            <div key={category.name} className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{category.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {category.subcategories.map((subcategory) => (
                  <button
                    key={subcategory.name}
                    onClick={() => navigate(`/category/${category.name.toLowerCase()}/${subcategory.name.toLowerCase()}/create`)}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-150 group"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                        {subcategory.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {subcategory.attributes.length} required fields
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}