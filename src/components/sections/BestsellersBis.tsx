import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/lib/data/products';

export default function BestsellersBis() {
  // Récupérer les 3 premiers produits comme best-sellers
  const bestsellers = products.slice(0, 3);

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[95%] mx-auto px-6 lg:px-10">
        
        {/* Titre */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-wider text-gray-500">Populaire</p>
          <h2 className="mt-2 text-2xl md:text-3xl lg:text-6xl font-semibold text-gray-900">
            Nos best-sellers !
          </h2>
        </div>

        {/* Grille produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestsellers.map((product) => (
            <Link 
              key={product.id}
              href={`/collections/${product.slug}`} 
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center">
                <Image 
                  src={product.image} 
                  alt={`${product.title} - ${product.description}`}
                  width={1000}
                  height={200}
                  className="object-contain rounded-lg"
                />
              </div>
              <p className="mt-4 text-base font-medium text-gray-900">{product.title}</p>
              <p className="text-sm text-gray-500">{product.price}€</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
