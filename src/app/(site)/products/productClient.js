"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Leaf,
  ChartCandlestickIcon,
  ArrowLeft,
  Search,
  Filter,
  X,
  Clock,
  ChevronDown,
  ShoppingBag,
  Star,
  CheckCircle,
} from "lucide-react";

// ─── Inner component (uses useSearchParams safely inside Suspense) ────────────
function ProductsPageContent() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("default");

  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const categoryParam = searchParams.get("category");

  // Set initial filters from URL params
  useEffect(() => {
    if (typeParam === "veg") {
      setSelectedType("veg");
    } else if (typeParam === "nonveg") {
      setSelectedType("nonveg");
    }

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [typeParam, categoryParam]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/products`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
          setFilteredProducts(data.products);

          // Extract unique categories (as objects with id and name)
          const categoryMap = new Map();
          data.products.forEach((product) => {
            if (product.category && product.category._id) {
              categoryMap.set(product.category._id, {
                id: product.category._id,
                name: product.category.name,
                slug: product.category.slug,
              });
            }
          });
          setCategories(Array.from(categoryMap.values()));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    if (selectedType === "veg") {
      result = result.filter((p) => p.isVeg === true);
    } else if (selectedType === "nonveg") {
      result = result.filter((p) => p.isVeg === false);
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category && p.category._id === selectedCategory
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => {
        const priceA =
          a.variants && a.variants.length > 0 ? a.variants[0].price : 0;
        const priceB =
          b.variants && b.variants.length > 0 ? b.variants[0].price : 0;
        return priceA - priceB;
      });
    } else if (sortBy === "price-high") {
      result.sort((a, b) => {
        const priceA =
          a.variants && a.variants.length > 0 ? a.variants[0].price : 0;
        const priceB =
          b.variants && b.variants.length > 0 ? b.variants[0].price : 0;
        return priceB - priceA;
      });
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [products, selectedType, selectedCategory, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("default");
  };

  const getDisplayPrice = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return <span className="text-[#daa520]">₹{product.price || 0}</span>;
    }

    if (product.variants.length === 1) {
      return (
        <span className="text-[#daa520]">₹{product.variants[0].price}</span>
      );
    }

    const prices = product.variants.map((v) => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return (
      <div className="flex flex-col">
        <span className="text-[#daa520] text-2xl font-bold">₹{minPrice}</span>
        {minPrice !== maxPrice && (
          <span className="text-[#a9a48c] text-xs">to ₹{maxPrice}</span>
        )}
      </div>
    );
  };

  const getSizes = (product) => {
    if (!product.variants || product.variants.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mb-2">
        {product.variants.map((variant, index) => (
          <span
            key={variant._id || index}
            className="text-xs bg-[#daa520]/10 text-[#a9a48c] px-2 py-1 rounded-full"
          >
            {variant.name} • {variant.pieces}pcs
          </span>
        ))}
      </div>
    );
  };

  const renderProductCard = (product) => (
    <div
      key={product._id}
      className="group bg-[#242a26] rounded-3xl overflow-hidden border border-[#3c463e]/50 shadow-2xl hover:border-[#daa520] hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 bg-gradient-to-b from-[#2a332a]/50 to-transparent"
    >
      <Link href={`/products/${product._id}`}>
        <div
          className="relative h-64 md:h-72 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 cursor-pointer"
          style={{
            backgroundImage: `url('${
              product.image ||
              "https://images.pexels.com/photos/699521/pexels-photo-699521.jpeg?auto=compress&cs=tinysrgb&w=600"
            }')`,
          }}
        >
          <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
            {product.isVeg ? (
              <Leaf className="w-6 h-6 text-green-600" />
            ) : (
              <ChartCandlestickIcon className="w-6 h-6 text-red-500" />
            )}
          </div>

          {product.category && product.category.name && (
            <div className="absolute top-4 left-4">
              <span className="bg-[#daa520]/90 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                {product.category.name}
              </span>
            </div>
          )}

          {product.isAvailable && (
            <div className="absolute bottom-4 left-4 bg-green-500/90 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Available
            </div>
          )}

          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {product.preparationTime || 20} min
          </div>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <Link href={`/products/${product._id}`} className="flex-1">
            <h3 className="text-2xl font-bold text-[#f5d791] group-hover:text-[#ffd966] transition-colors line-clamp-1 cursor-pointer">
              {product.name}
            </h3>
          </Link>
        </div>

        {product.description && (
          <p className="text-[#a9a48c] mb-3 line-clamp-2 text-sm">
            {product.description}
          </p>
        )}

        {getSizes(product)}

        <div className="flex items-center justify-between mb-6">
          <div className="text-3xl font-bold">{getDisplayPrice(product)}</div>
          <div className="flex items-center gap-2 text-[#a9a48c] text-sm font-medium">
            <Star className="w-4 h-4 fill-[#daa520] text-[#daa520]" />
            4.5 (120+)
          </div>
        </div>

        <Link href={`/products/${product._id}`}>
          <button className="w-full bg-gradient-to-r from-transparent via-[#daa520]/20 to-transparent border-2 border-[#daa520] text-[#daa520] px-6 py-4 rounded-2xl font-bold text-lg hover:bg-gradient-to-r hover:from-[#daa520] hover:to-[#f5d791] hover:text-black transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            View Details
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a120a] pt-24 pb-20">
      <div className="container-custom max-w-7xl mx-auto px-4 mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#daa520] hover:text-[#f5d791] transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white bg-gradient-to-r from-[#f5d791] to-white bg-clip-text text-transparent">
              Our Menu
            </h1>
            <p className="text-xl text-gray-300 mt-2">
              {filteredProducts.length} delicious{" "}
              {filteredProducts.length === 1 ? "item" : "items"} available
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 bg-[#1a251a] border border-[#daa520]/30 text-[#daa520] px-6 py-3 rounded-xl font-medium"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div
          className={`${
            showFilters ? "block" : "hidden md:block"
          } bg-[#1a251a] rounded-3xl p-6 border border-[#daa520]/20 mb-8`}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6a6558]" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#0f150f] border border-[#daa520]/30 rounded-xl text-white placeholder:text-[#6a6558] focus:border-[#daa520] focus:ring-[#daa520]/20 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedType === "all"
                    ? "bg-[#daa520] text-black"
                    : "bg-[#0f150f] text-[#f0e5d0] hover:bg-[#daa520]/20"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType("veg")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedType === "veg"
                    ? "bg-green-600 text-white"
                    : "bg-[#0f150f] text-[#f0e5d0] hover:bg-green-600/20"
                }`}
              >
                <Leaf className="w-5 h-5" />
                Veg
              </button>
              <button
                onClick={() => setSelectedType("nonveg")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedType === "nonveg"
                    ? "bg-red-600 text-white"
                    : "bg-[#0f150f] text-[#f0e5d0] hover:bg-red-600/20"
                }`}
              >
                <ChartCandlestickIcon className="w-5 h-5" />
                Non-Veg
              </button>
            </div>

            {categories.length > 0 && (
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none px-6 py-3 pr-12 bg-[#0f150f] border border-[#daa520]/30 rounded-xl text-white focus:border-[#daa520] focus:ring-[#daa520]/20 outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6a6558] pointer-events-none" />
              </div>
            )}

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-6 py-3 pr-12 bg-[#0f150f] border border-[#daa520]/30 rounded-xl text-white focus:border-[#daa520] focus:ring-[#daa520]/20 outline-none cursor-pointer"
              >
                <option value="default">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6a6558] pointer-events-none" />
            </div>

            {(selectedType !== "all" ||
              selectedCategory !== "all" ||
              searchQuery ||
              sortBy !== "default") && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
              >
                <X className="w-5 h-5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-[#242a26] rounded-3xl h-96"
                />
              ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {(selectedType === "all" || selectedType === "veg") &&
              filteredProducts.filter((p) => p.isVeg).length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-green-500/10 rounded-2xl">
                      <Leaf className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      Vegetarian
                    </h2>
                    <span className="bg-[#daa520]/20 text-[#daa520] px-4 py-1 rounded-full text-sm">
                      {filteredProducts.filter((p) => p.isVeg).length} items
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts
                      .filter((p) => p.isVeg)
                      .map(renderProductCard)}
                  </div>
                </div>
              )}

            {(selectedType === "all" || selectedType === "nonveg") &&
              filteredProducts.filter((p) => !p.isVeg).length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-red-500/10 rounded-2xl">
                      <ChartCandlestickIcon className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      Non-Vegetarian
                    </h2>
                    <span className="bg-[#daa520]/20 text-[#daa520] px-4 py-1 rounded-full text-sm">
                      {filteredProducts.filter((p) => !p.isVeg).length} items
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts
                      .filter((p) => !p.isVeg)
                      .map(renderProductCard)}
                  </div>
                </div>
              )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">😕</div>
            <h3 className="text-3xl font-bold text-white mb-4">
              No items found
            </h3>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              We couldn&apos;t find any items matching your criteria. Try
              adjusting your filters or search query.
            </p>
            <button
              onClick={clearFilters}
              className="bg-[#daa520] text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#f5d791] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton shown while Suspense resolves useSearchParams ──────────────────
function ProductsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a120a] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 w-64 bg-[#242a26] rounded-2xl animate-pulse mb-4" />
        <div className="h-8 w-40 bg-[#242a26] rounded-xl animate-pulse mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-[#242a26] rounded-3xl h-96"
              />
            ))}
        </div>
      </div>
    </div>
  );
}

// ─── Default export wraps inner component in Suspense ────────────────────────
export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsPageContent />
    </Suspense>
  );
}