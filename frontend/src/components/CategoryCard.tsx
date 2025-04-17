import { Link } from 'react-router-dom';
import { CategoryType } from '../types';

interface CategoryCardProps {
  category: CategoryType;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.name}</h3>
        <ul className="space-y-2">
          {category.subcategories.map((subcategory) => (
            <li key={subcategory.name}>
              <Link
                to={`/category/${category.name.toLowerCase()}/${subcategory.name.toLowerCase()}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {subcategory.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}