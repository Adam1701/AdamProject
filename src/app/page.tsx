import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import ProductImage from "@/components/ui/ProductImage";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function Home(props: {
  // Next 15: searchParams may be a Promise
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  const pageSize = 24;
  const raw = props.searchParams;
  const sp: SearchParams | undefined = raw && typeof (raw as any).then === 'function'
    ? await (raw as Promise<SearchParams>)
    : (raw as SearchParams | undefined);
  const pageParam = Array.isArray(sp?.page) ? sp?.page[0] : sp?.page;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);

  const where = {
    price: { gt: 0 },
    variants: { some: { images: { some: { url: { not: { contains: 'images.unsplash.com' } } } } } },
  } as const;

  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const skip = (page - 1) * pageSize;

  const products = await prisma.product.findMany({
    where,
    include: { variants: { include: { images: true, stocks: true } } },
    orderBy: { createdAt: 'desc' },
    take: pageSize,
    skip,
  });
  
  // debug désactivé
  
  return (
    <div className="space-y-12">
      <div className="text-center py-16 bg-slate-50 rounded-2xl">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Bienvenue chez Adam'sneakers
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {total} paires sélectionnées avec soin.
        </p>
        <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
          Reste fidèle à ton style, chaque pas compte.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((p) => {
          // Avis déterministes (visuels) basés sur l'id pour rester stables
          const hash = Array.from(p.id).reduce((a, c) => a + c.charCodeAt(0), 0);
          const rating = 3.5 + ((hash % 15) / 10); // 3.5 → 5.0
          const fullStars = Math.floor(rating);
          const hasHalf = rating - fullStars >= 0.5;
          const count = 20 + (hash % 480); // 20 → 500
          return (
          <Link key={p.id} href={`/product/${p.id}`} className="group">
            <Card hover className="overflow-hidden group-hover:shadow-lg transition-all duration-300">
              <div className="aspect-square relative bg-slate-100">
                <ProductImage
                  src={p.variants[0]?.images[0]?.url}
                  alt={p.name}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">{p.brand}</div>
                <h3 className="font-semibold text-slate-900 mt-2 line-clamp-2 group-hover:text-slate-700 transition-colors">{p.name}</h3>
                <div className="mt-2 flex items-center gap-2" aria-label={`Note ${rating.toFixed(1)} sur 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < fullStars ? 'text-amber-400' : (i === fullStars && hasHalf ? 'text-amber-300' : 'text-slate-300')}>
                      {i < fullStars ? '★' : i === fullStars && hasHalf ? '★' : '☆'}
                    </span>
                  ))}
                  <span className="text-xs text-slate-700 font-medium">{rating.toFixed(1)}/5</span>
                  <span className="text-xs text-slate-500">({count} avis)</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-slate-900">
                    {p.price} {p.currency}
                  </span>
                  <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
                    {p.category}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
          )
        })}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex items-center justify-center gap-2">
        {page > 1 && (
          <Link
            href={`/?page=${page - 1}`}
            className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Précédent
          </Link>
        )}

        {/* Page numbers */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/?page=${p}`}
              className={`px-3 py-2 rounded-lg border text-sm ${
                p === page
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>

        {page < totalPages && (
          <Link
            href={`/?page=${page + 1}`}
            className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Suivant
          </Link>
        )}
      </div>
    </div>
  );
}
