export default function CategoriesSection() {
  const categories = [
    { id: 1, name: "Face Wash", productCount: 8, status: "Active" },
    { id: 2, name: "Bath Salt", productCount: 6, status: "Active" },
    { id: 3, name: "Ubtan", productCount: 5, status: "Active" },
    { id: 4, name: "Soap", productCount: 12, status: "Active" },
    { id: 5, name: "Gel", productCount: 4, status: "Active" },
    { id: 6, name: "Fragrance Balm", productCount: 3, status: "Active" },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-light text-foreground">
          <span className="font-semibold">Categories</span>
        </h2>
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90">
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">{category.name}</h3>
            <p className="text-3xl font-bold text-primary mb-4">{category.productCount}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                {category.status}
              </span>
              <button className="text-primary font-medium hover:underline text-sm">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
