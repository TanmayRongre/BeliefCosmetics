
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash,
  Upload,
  X,
  Loader,
  Package,
  Image as ImageIcon,
  ShieldCheck,
  FlaskConical,
  Layers,
  ArrowLeft,
} from "lucide-react";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const categories = [
  "Face Wash",
  "Bath Salt",
  "Ubtan",
  "Soap",
  "Gel",
  "Fragrance Balm",
];

const skinTypes = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];

const skinConcerns = [
  "Acne",
  "Breakouts",
  "Blackheads",
  "Large pores",
  "Uneven texture",
  "Pigmentation",
  "Dark spots",
  "Uneven tone",
  "Dullness",
  "Fine lines",
  "Wrinkles",
  "Loss of firmness",
  "Dryness",
  "Flakiness",
  "Redness",
  "Rosacea",
  "Sensitivity",
  "Dark circles",
  "Puffiness",
];

const allergyLabels = [
  "Paraben-free",
  "Alcohol-free",
  "Fragrance-free",
  "Essential-oil-free",
  "Silicone-free",
];

const inputClass =
  "mt-2 w-full rounded-xl border border-[#e7eae3] bg-[#fbfaf6] px-4 py-3 text-sm text-[#172b27] outline-none transition-all placeholder:text-[#a0aaa2] focus:border-[#718477] focus:ring-2 focus:ring-[#718477]/10";

const labelClass =
  "block text-xs font-semibold uppercase tracking-[0.12em] text-[#526b5d]";

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "",
    status: "Active",
    featured: false,
    ingredients: "",
    activeIngredients: "",
    warnings: "",
    skinType: [],
    skinConcerns: [],
    allergyLabels: [],
    images: [],
    variants: [],
  });

  const [newVariant, setNewVariant] = useState({
    name: "",
    stock: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(`/products/${id}`);
      const product = res.data;

      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        discountPrice: product.discountPrice || "",
        stock: product.stock,
        status: product.status || "Active",
        featured: product.featured || false,
        ingredients: Array.isArray(product.ingredients)
          ? product.ingredients.join(", ")
          : product.ingredients || "",
        activeIngredients: Array.isArray(product.activeIngredients)
          ? product.activeIngredients.join(", ")
          : "",
        warnings: Array.isArray(product.warnings)
          ? product.warnings.join(", ")
          : "",
        skinType: product.skinType || [],
        skinConcerns: product.skinConcerns || [],
        allergyLabels: product.allergyLabels || [],
        images: product.images || [],
        variants: product.variants || [],
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (e, field) => {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
      };

      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;

    setNewVariant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewVariant((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };

      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const addVariant = () => {
    if (newVariant.name && newVariant.stock) {
      setFormData((prev) => ({
        ...prev,
        variants: [...prev.variants, newVariant],
      }));

      setNewVariant({
        name: "",
        stock: "",
        price: "",
        image: "",
      });
    } else {
      toast.error("Please fill in variant name and stock");
    }
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const processedData = {
        ...formData,
        ingredients: formData.ingredients
          .split(",")
          .map((item) => item.trim()),
        activeIngredients: formData.activeIngredients
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        warnings: formData.warnings
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (isEditMode) {
        await axiosInstance.put(`/products/${id}`, processedData);
        toast.success("Product updated successfully");
      } else {
        await axiosInstance.post("/products", processedData);
        toast.success("Product created successfully");
      }

      navigate("/admin");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const SectionHeading = ({ icon: Icon, title, description }) => (
    <div className="mb-6 flex items-start gap-3 border-b border-[#e7eae3] pb-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf0e7]">
        <Icon className="h-[18px] w-[18px] text-[#526b5d]" />
      </div>

      <div>
        <h3 className="font-editorial text-2xl font-semibold text-[#172b27]">
          {title}
        </h3>
        <p className="mt-1 text-xs text-[#879188]">{description}</p>
      </div>
    </div>
  );

  const CheckboxPill = ({ value, checked, onChange }) => (
    <label
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-xs transition-all ${checked
        ? "border-[#718477] bg-[#edf0e7] text-[#294b40]"
        : "border-[#e7eae3] bg-white text-[#718477] hover:border-[#aab9aa]"
        }`}
    >
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 accent-[#294b40]"
      />
      {value}
    </label>
  );

  if (loading && isEditMode && !formData.name) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f8f6f0]">
        <div className="text-center">
          <Loader className="mx-auto h-7 w-7 animate-spin text-[#718477]" />
          <p className="mt-3 text-xs text-[#879188]">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f0] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Page heading */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-[#718477] transition-colors hover:text-[#172b27]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>

            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#879188]">
              Belief Cosmetics / Product Management
            </p>

            <h1 className="font-editorial text-4xl font-semibold leading-none text-[#172b27] sm:text-5xl">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#879188]">
              {isEditMode
                ? "Update the product information, ingredients and skin compatibility details."
                : "Add a new product to your collection with its details, ingredients and skin compatibility information."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <section className="rounded-2xl border border-[#e7eae3] bg-white p-5 shadow-sm shadow-[#172b27]/[0.02] sm:p-8">
              <SectionHeading
                icon={Package}
                title="Basic Information"
                description="The essential details of your product."
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className={labelClass}>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe your product..."
                    className={`${inputClass} resize-y`}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="Enter available stock"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Discount Price (₹)</label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    placeholder="Optional"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e7eae3] bg-[#fbfaf6] p-4 transition-colors hover:border-[#aab9aa]">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 accent-[#294b40]"
                    />

                    <div>
                      <p className="text-sm font-semibold text-[#294b40]">
                        Featured Product
                      </p>
                      <p className="mt-0.5 text-xs text-[#879188]">
                        Mark this product as featured.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            {/* Product Images */}
            <section className="rounded-2xl border border-[#e7eae3] bg-white p-5 shadow-sm shadow-[#172b27]/[0.02] sm:p-8">
              <SectionHeading
                icon={ImageIcon}
                title="Product Images"
                description="Upload and manage the images associated with this product."
              />

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#dfe4dc] bg-[#edf0e7] px-5 py-3 text-xs font-semibold text-[#294b40] transition-all hover:border-[#718477] hover:bg-[#e3e9df]">
                <Upload className="h-4 w-4" />
                Upload Image
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </label>

              {formData.images.length > 0 ? (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {formData.images.map((img, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-xl border border-[#e7eae3] bg-[#fbfaf6]"
                    >
                      <div className="flex h-36 items-center justify-center p-3">
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label={`Remove image ${index + 1}`}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#172b27] text-white opacity-100 transition-colors hover:bg-[#a35e55] sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="border-t border-[#e7eae3] px-3 py-2 text-center text-[10px] text-[#879188]">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-[#dfe4dc] bg-[#fbfaf6] text-center">
                  <ImageIcon className="h-7 w-7 text-[#a0aaa2]" />
                  <p className="mt-2 text-xs text-[#879188]">
                    No product images uploaded yet.
                  </p>
                </div>
              )}
            </section>

            {/* Skin Compatibility & Safety */}
            <section className="rounded-2xl border border-[#e7eae3] bg-white p-5 shadow-sm shadow-[#172b27]/[0.02] sm:p-8">
              <SectionHeading
                icon={ShieldCheck}
                title="Skin Compatibility & Safety"
                description="Specify suitable skin types, concerns and product information."
              />

              <div className="space-y-7">
                <div>
                  <label className={labelClass}>Skin Type Compatibility</label>
                  <p className="mb-3 mt-1 text-xs text-[#879188]">
                    Select all applicable skin types.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {skinTypes.map((type) => (
                      <CheckboxPill
                        key={type}
                        value={type}
                        checked={formData.skinType.includes(type)}
                        onChange={(e) => handleArrayChange(e, "skinType")}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Skin Concerns Solved</label>
                  <p className="mb-3 mt-1 text-xs text-[#879188]">
                    Select the concerns this product addresses.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {skinConcerns.map((concern) => (
                      <CheckboxPill
                        key={concern}
                        value={concern}
                        checked={formData.skinConcerns.includes(concern)}
                        onChange={(e) => handleArrayChange(e, "skinConcerns")}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Allergy-Safe Labels</label>
                  <p className="mb-3 mt-1 text-xs text-[#879188]">
                    Select applicable formulation labels.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {allergyLabels.map((label) => (
                      <CheckboxPill
                        key={label}
                        value={label}
                        checked={formData.allergyLabels.includes(label)}
                        onChange={(e) => handleArrayChange(e, "allergyLabels")}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Ingredients */}
            <section className="rounded-2xl border border-[#e7eae3] bg-white p-5 shadow-sm shadow-[#172b27]/[0.02] sm:p-8">
              <SectionHeading
                icon={FlaskConical}
                title="Ingredients & Warnings"
                description="Add the formulation details used for product information and analysis."
              />

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Ingredients</label>
                  <p className="mb-1 mt-1 text-xs text-[#879188]">
                    Full ingredient list (comma separated).
                  </p>

                  <textarea
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Water, Glycerin, Niacinamide..."
                    className={`${inputClass} resize-y`}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Active Ingredients</label>
                    <p className="mb-1 mt-1 text-xs text-[#879188]">
                      Key actives for analysis (comma separated).
                    </p>

                    <input
                      type="text"
                      name="activeIngredients"
                      value={formData.activeIngredients}
                      onChange={handleInputChange}
                      placeholder="Salicylic Acid, Retinol, Vitamin C..."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Warnings / Contraindications
                    </label>
                    <p className="mb-1 mt-1 text-xs text-[#879188]">
                      Usage warnings (comma separated).
                    </p>

                    <input
                      type="text"
                      name="warnings"
                      value={formData.warnings}
                      onChange={handleInputChange}
                      placeholder="Avoid with Retinol, Not for sensitive skin..."
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Variants / Shades */}
            <section className="rounded-2xl border border-[#e7eae3] bg-white p-5 shadow-sm shadow-[#172b27]/[0.02] sm:p-8">
              <SectionHeading
                icon={Layers}
                title="Variants / Shades"
                description="Manage the available variants for this product."
              />

              {/* Add variant */}
              <div className="rounded-xl border border-[#e7eae3] bg-[#fbfaf6] p-4 sm:p-5">
                <h4 className="mb-5 font-editorial text-xl font-semibold text-[#172b27]">
                  Add New Variant
                </h4>

                <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Variant Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newVariant.name}
                      onChange={handleVariantChange}
                      placeholder="e.g. Red, XL"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={newVariant.stock}
                      onChange={handleVariantChange}
                      placeholder="Available quantity"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={newVariant.price}
                      onChange={handleVariantChange}
                      placeholder="Optional"
                      className={inputClass}
                    />
                  </div>

                  <div className="flex gap-2">
                    <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#dfe4dc] bg-white px-3 py-3 text-xs font-medium text-[#526b5d] transition-colors hover:border-[#718477]">
                      <Upload className="h-4 w-4" />
                      Image
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleVariantImageUpload}
                        accept="image/*"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={addVariant}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#172b27] px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#294b40]"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                </div>

                {newVariant.image && (
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src={newVariant.image}
                      alt="Variant Preview"
                      className="h-16 w-16 rounded-lg border border-[#e7eae3] bg-white object-contain p-1"
                    />
                    <span className="text-xs text-[#718477]">
                      Variant image preview
                    </span>
                  </div>
                )}
              </div>

              {/* Variant list */}
              {formData.variants.length > 0 && (
                <div className="mt-6 overflow-hidden rounded-xl border border-[#e7eae3]">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[450px] text-left">
                      <thead className="bg-[#fbfaf6]">
                        <tr>
                          {["Image", "Name", "Stock", "Action"].map(
                            (heading) => (
                              <th
                                key={heading}
                                className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#879188]"
                              >
                                {heading}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {formData.variants.map((variant, index) => (
                          <tr
                            key={index}
                            className="border-t border-[#e7eae3] transition-colors hover:bg-[#fbfaf6]"
                          >
                            <td className="px-5 py-3">
                              {variant.image ? (
                                <img
                                  src={variant.image}
                                  alt={variant.name}
                                  className="h-11 w-11 rounded-lg border border-[#e7eae3] bg-white object-contain p-1"
                                />
                              ) : (
                                <span className="text-xs text-[#a0aaa2]">
                                  No Image
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-3 text-sm font-medium text-[#294b40]">
                              {variant.name}
                            </td>

                            <td className="px-5 py-3 text-sm text-[#718477]">
                              {variant.stock}
                            </td>

                            <td className="px-5 py-3">
                              <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                aria-label={`Remove ${variant.name}`}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-[#a35e55] transition-colors hover:bg-[#f6e9e7]"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>

            {/* Form Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#dfe4dc] pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="rounded-full border border-[#dfe4dc] bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#526b5d] transition-all hover:border-[#172b27] hover:text-[#172b27]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#172b27] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#f8f6f0] transition-all hover:bg-[#294b40] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    {isEditMode ? "Update Product" : "Create Product"}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProduct;
