
type CardProps = {
  title: string
  price: number
  image: string
}

export function Card({ title, price, image }: CardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 w-64">
      
      <img 
        src={image} 
        alt={title} 
        className="w-full h-40 object-cover rounded-xl"
      />

      <h2 className="text-lg font-semibold mt-2">
        {title}
      </h2>

      <p className="text-gray-600">
        R$ {price.toFixed(2)}
      </p>

      <button className="bg-blue-500 text-white w-full mt-3 py-2 rounded-lg hover:bg-blue-600">
        Comprar
      </button>

    </div>
  )
}