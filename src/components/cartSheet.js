// components/CartSheet.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Loader2,
  ArrowRight,
} from "lucide-react";

export const CartSheet = ({ isOpen, onOpenChange, cartItems, cartLoading, cartTotal, onUpdate, onRemove }) => {
  const router = useRouter();
  const [updatingItems, setUpdatingItems] = useState({});

  const handleUpdateQuantity = async (itemId, newQuantity, maxPieces) => {
    if (newQuantity < 1 || newQuantity > maxPieces) return;
    
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
    await onUpdate(itemId, newQuantity);
    setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
    await onRemove(itemId);
    setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
  };

  // Safely get variant info
  const getVariantInfo = (item) => {
    if (item.variantId && typeof item.variantId === 'object') {
      return {
        name: item.variantId.name || 'Regular',
        price: item.variantId.price || 0,
        pieces: item.variantId.pieces || 1
      };
    }
    return {
      name: item.variantName || 'Regular',
      price: item.price || 0,
      pieces: item.pieces || 1
    };
  };

  // Safely get product info
  const getProductInfo = (item) => {
    if (item.productId && typeof item.productId === 'object') {
      return {
        id: item.productId._id,
        name: item.productId.name || 'Product',
        image: item.productId.image || ''
      };
    }
    return {
      id: item.productId || item._id,
      name: item.name || 'Product',
      image: item.image || ''
    };
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg bg-[#0f150f] border-l border-[#daa520]/20 text-white p-0">
        <SheetHeader className="p-6 border-b border-[#daa520]/20">
          <SheetTitle className="text-2xl font-playfair text-[#daa520] flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Your Cart
          </SheetTitle>
        </SheetHeader>
        
        {cartLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#daa520] animate-spin mx-auto mb-4" />
              <p className="text-[#a9a48c]">Loading your cart...</p>
            </div>
          </div>
        ) : !cartItems || cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center p-6">
            <div className="w-24 h-24 rounded-full bg-[#1a251a] flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-[#6a6558]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
            <p className="text-[#a9a48c] mb-8 max-w-sm">
              Looks like you haven't added anything to your cart yet
            </p>
            <Button
              onClick={() => {
                onOpenChange(false);
                router.push('/products');
              }}
              className="bg-gradient-to-r from-[#daa520] to-[#f5d791] text-black font-semibold px-8 py-6 rounded-xl hover:shadow-lg hover:shadow-[#daa520]/30 transition-all group"
            >
              Browse Products
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[calc(100vh-360px)] px-6">
              <div className="space-y-4 py-4">
                {cartItems.map((item) => {
                  const variant = getVariantInfo(item);
                  const product = getProductInfo(item);
                  const isUpdating = updatingItems[item._id];
                  
                  return (
                    <div
                      key={item._id}
                      className="flex gap-4 bg-[#1a251a] rounded-xl p-4 border border-[#daa520]/20 hover:border-[#daa520]/40 transition-all relative"
                    >
                      {isUpdating && (
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-[#daa520] animate-spin" />
                        </div>
                      )}
                      
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">
                          {product.name}
                        </h4>
                        <p className="text-sm text-[#a9a48c]">
                          {variant.name} • {variant.pieces} pcs
                        </p>
                        <p className="text-[#daa520] font-bold mt-1">
                          ₹{(variant.price * item.quantity).toFixed(2)}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1, variant.pieces)}
                              disabled={item.quantity <= 1 || isUpdating}
                              className="w-8 h-8 rounded-lg bg-[#0f150f] border border-[#daa520]/30 text-[#daa520] hover:bg-[#daa520] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4 mx-auto" />
                            </button>
                            <span className="text-white font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1, variant.pieces)}
                              disabled={item.quantity >= variant.pieces || isUpdating}
                              className="w-8 h-8 rounded-lg bg-[#0f150f] border border-[#daa520]/30 text-[#daa520] hover:bg-[#daa520] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            disabled={isUpdating}
                            className="text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            
            <div className="border-t border-[#daa520]/20 p-6 bg-[#0a120a]">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#a9a48c]">Subtotal</span>
                  <span className="text-white font-medium">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#a9a48c]">Delivery Fee</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>
                <Separator className="bg-[#daa520]/20 my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-[#daa520] font-bold text-xl">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                onClick={() => {
                  onOpenChange(false);
                  router.push('/checkout');
                }}
                className="w-full bg-gradient-to-r  from-[#daa520] to-[#f5d791] text-black font-semibold py-6 rounded-xl hover:shadow-lg hover:shadow-[#daa520]/30 transition-all mt-6 group"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};