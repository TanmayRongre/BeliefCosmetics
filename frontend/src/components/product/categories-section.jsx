import { useState, useEffect } from "react";
import axiosInstance from "../../lib/axios";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Face Wash", productCount: 0, status: "Active" },
    { id: 2, name: "Bath Salt", productCount: 0, status: "Active" },
    { id: 3, name: "Ubtan", productCount: 0, status: "Active" },
    { id: 4, name: "Soap", productCount: 0, status: "Active" },
    { id: 5, name: "Gel", productCount: 0, status: "Active" },
    { id: 6, name: "Fragrance Balm", productCount: 0, status: "Active" },
  ]);

  useEffect(() => {
    let isMounted = true;
    const fetchCategoryCounts = async () => {
      try {
        const res = await axiosInstance.get("/products/categories");
        if (isMounted && Array.isArray(res.data)) {
          const mapped = res.data.map((cat, idx) => ({
            id: cat.productId || idx + 1,
            name: cat.name,
            productCount: cat.count || 0,
            status: cat.count > 0 ? "Active" : "Empty",
          }));
          setCategories(mapped);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategoryCounts();
    return () => {
      isMounted = false;
    };
  }, []);

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
