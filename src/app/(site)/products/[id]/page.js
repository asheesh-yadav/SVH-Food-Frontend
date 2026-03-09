"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  Leaf,
  ChartCandlestickIcon,
  Clock,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Minus,
  Plus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Get auth state from Redux
  const isVerified = useSelector((state) => state.emailLogin.isVerified);
  const userEmail = useSelector((state) => state.emailLogin.email);

  const productId = params.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/products/${productId}`
        );
        const data = await response.json();

        if (data.success) {
          setProduct(data.product);
          // Set default variant as the first one
          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedVariant(data.product.variants[0]);
          }
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when variant changes
  };

  const handleQuantityChange = (type) => {
    if (!selectedVariant) return;

    if (type === "increase") {
      if (quantity < selectedVariant.pieces) {
        setQuantity((prev) => prev + 1);
      }
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    // Check if user is logged in using Redux state
    const token = localStorage.getItem("token");

    if (!isVerified) {
      // Open login dialog by dispatching an event that Header can listen to
      window.dispatchEvent(new CustomEvent("openAuthDialog"));
      toast.info("Please login to add items to cart");
      return;
    }

    try {
      setAddingToCart(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product._id,
            variantId: selectedVariant._id,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        // Dispatch custom event for cart update
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Added to cart successfully!");
      } else {
        toast.error(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    //
    try {
      alert("Buy Successful");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a120a] pt-24 pb-20">
        <div className="container-custom max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-[#1a251a] rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-[500px] bg-[#1a251a] rounded-3xl"></div>
              <div className="space-y-6">
                <div className="h-12 bg-[#1a251a] rounded w-3/4"></div>
                <div className="h-6 bg-[#1a251a] rounded w-1/2"></div>
                <div className="h-24 bg-[#1a251a] rounded"></div>
                <div className="h-16 bg-[#1a251a] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0a120a] pt-24 pb-20">
        <div className="container-custom max-w-7xl mx-auto px-4 text-center">
          <div className="bg-[#1a251a] rounded-3xl p-12 border border-[#daa520]/20">
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Product Not Found
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#daa520] text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#f5d791] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a120a] pt-24 pb-20">
      <div className="container-custom max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[#daa520] hover:text-[#f5d791] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideIn">
            <CheckCircle className="w-6 h-6" />
            <span className="font-bold">Added to cart successfully!</span>
          </div>
        )}

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative rounded-3xl overflow-hidden border border-[#daa520]/20 bg-gradient-to-b from-[#1a251a] to-[#0f150f]">
                <div
                  className="h-[500px] bg-cover bg-center"
                  style={{ backgroundImage: `url('${product.image}')` }}
                />

                {/* Type Badge */}
                <div className="absolute top-6 right-6 p-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl">
                  {product.isVeg ? (
                    <div className="flex items-center gap-2">
                      <Leaf className="w-6 h-6 text-green-600" />
                      <span className="text-green-600 font-bold">Pure Veg</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ChartCandlestickIcon className="w-6 h-6 text-red-500" />
                      <span className="text-red-500 font-bold">Non-Veg</span>
                    </div>
                  )}
                </div>

                {/* Availability Badge */}
                {product.isAvailable ? (
                  <div className="absolute bottom-6 left-6 bg-green-500/90 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-xl flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Available Now
                  </div>
                ) : (
                  <div className="absolute bottom-6 left-6 bg-red-500/90 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-xl flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Category & Time Info */}
              <div className="flex items-center justify-between mt-6 bg-[#1a251a] rounded-2xl p-4 border border-[#daa520]/20">
                <div className="flex items-center gap-3">
                  <span className="text-[#a9a48c]">Category:</span>
                  <Link
                    href={`/products?category=${product.category._id}`}
                    className="text-[#daa520] hover:text-[#f5d791] font-medium transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-[#a9a48c]">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">
                    {product.preparationTime} mins
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Title & Price */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {product.name}
              </h1>
              {selectedVariant && (
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-[#daa520]">
                    ₹{selectedVariant.price}
                  </span>
                  <span className="text-[#a9a48c] line-through text-xl">
                    ₹{Math.round(selectedVariant.price * 1.2)}
                  </span>
                  <span className="bg-green-500/20 text-green-500 px-4 py-2 rounded-full text-sm font-bold">
                    20% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-[#1a251a] rounded-2xl p-6 border border-[#daa520]/20">
                <h2 className="text-xl font-bold text-white mb-3">
                  Description
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Variants Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="bg-[#1a251a] rounded-2xl p-6 border border-[#daa520]/20">
                <h2 className="text-xl font-bold text-white mb-4">
                  Select Size
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => handleVariantSelect(variant)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedVariant?._id === variant._id
                          ? "border-[#daa520] bg-[#daa520]/10"
                          : "border-[#daa520]/30 hover:border-[#daa520]/60"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-white font-bold capitalize mb-1">
                          {variant.name}
                        </div>
                        <div className="text-[#daa520] font-bold">
                          ₹{variant.price}
                        </div>
                        <div className="text-sm text-[#a9a48c]">
                          {variant.pieces} pieces
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {selectedVariant && (
              <div className="bg-[#1a251a] rounded-2xl p-6 border border-[#daa520]/20">
                <h2 className="text-xl font-bold text-white mb-4">Quantity</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="w-12 h-12 rounded-xl bg-[#0f150f] border border-[#daa520]/30 text-[#daa520] text-2xl font-bold hover:bg-[#daa520] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-5 h-5 mx-auto" />
                  </button>
                  <span className="text-3xl font-bold text-white w-16 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="w-12 h-12 rounded-xl bg-[#0f150f] border border-[#daa520]/30 text-[#daa520] text-2xl font-bold hover:bg-[#daa520] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= selectedVariant.pieces}
                  >
                    <Plus className="w-5 h-5 mx-auto" />
                  </button>
                </div>
                <p className="text-[#a9a48c] text-sm mt-3">
                  Max available: {selectedVariant.pieces} pieces
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={
                  !selectedVariant || addingToCart || !product.isAvailable
                }
                className="flex-1 bg-gradient-to-r from-transparent via-[#daa520]/20 to-transparent border-2 border-[#daa520] text-[#daa520] px-8 py-5 rounded-2xl font-bold text-lg hover:bg-gradient-to-r hover:from-[#daa520] hover:to-[#f5d791] hover:text-black transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {addingToCart ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ShoppingBag className="w-5 h-5" />
                )}
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={
                  !selectedVariant || addingToCart || !product.isAvailable
                }
                className="flex-1 bg-gradient-to-r from-[#daa520] to-[#f5d791] text-black px-8 py-5 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-[#daa520]/30 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a251a] rounded-xl p-4 border border-[#daa520]/20 text-center">
                <Truck className="w-6 h-6 text-[#daa520] mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Free Delivery</p>
              </div>
              <div className="bg-[#1a251a] rounded-xl p-4 border border-[#daa520]/20 text-center">
                <Shield className="w-6 h-6 text-[#daa520] mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Hygienic</p>
              </div>
              <div className="bg-[#1a251a] rounded-xl p-4 border border-[#daa520]/20 text-center">
                <RefreshCw className="w-6 h-6 text-[#daa520] mx-auto mb-2" />
                <p className="text-white text-sm font-medium">
                  Fresh Every Time
                </p>
              </div>
              <div className="bg-[#1a251a] rounded-xl p-4 border border-[#daa520]/20 text-center">
                <Star className="w-6 h-6 text-[#daa520] mx-auto mb-2" />
                <p className="text-white text-sm font-medium">
                  Premium Quality
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-[#1a251a] rounded-2xl p-6 border border-[#daa520]/20">
              <h2 className="text-xl font-bold text-white mb-4">
                Product Details
              </h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>100% Fresh Ingredients</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Prepared in Hygienic Kitchen</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>No Preservatives Added</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Free Home Delivery</span>
                </li>
              </ul>
            </div>

            {/* Last Updated */}
            <p className="text-[#6a6558] text-sm text-center">
              Last updated:{" "}
              {new Date(product.updatedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
