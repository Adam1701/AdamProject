import Image from 'next/image'

interface ProductImageProps {
  src?: string
  alt: string
  className?: string
}

export default function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  if (!src || src === '/placeholder.jpg') {
    return (
      <div className={`bg-slate-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-300 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 font-medium">Image produit</p>
        </div>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
    />
  )
}
