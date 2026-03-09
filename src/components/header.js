"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  Menu,
  X,
  ChevronDown,
  LogIn,
  User,
  LogOut,
  Mail,
  Lock,
  UserPlus,
  MapPin,
  Settings,
  ShoppingCart,
  Loader2,
  Home,
  Info,
  Utensils,
  PartyPopper,
  PhoneCall,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setEmail, setVerified } from "@/store/home_Slices/emailLogin";
import { Badge } from "@/components/ui/badge";
import { CartSheet } from "./cartSheet";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("login");
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form states
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxEmail = useSelector((state) => state.emailLogin.email);
  const isVerified = useSelector((state) => state.emailLogin.isVerified);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsAuthLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        setIsLoggedIn(true);
        dispatch(setVerified(true));

        // Store token if it's returned in response
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // Update Redux state
        dispatch(setEmail(data.user.email));

        // Fetch cart after successful auth
        fetchCart();
      } else {
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("svh_user");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      // Clear token on error
      localStorage.removeItem("token");
      localStorage.removeItem("svh_user");
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    // Listen for cart updates
    const handleCartUpdate = () => {
      if (isLoggedIn) {
        fetchCart();
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [isLoggedIn]);

  useEffect(() => {
    // Listen for auth dialog open event
    const handleOpenAuth = () => {
      setIsAuthOpen(true);
    };

    window.addEventListener("openAuthDialog", handleOpenAuth);
    return () => window.removeEventListener("openAuthDialog", handleOpenAuth);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Transform cart items to handle different data structures
        const items = data.cart.items || [];
        const transformedItems = items.map((item) => ({
          ...item,
          variantId:
            typeof item.variantId === "object"
              ? item.variantId
              : {
                  name: item.variantName || "Regular",
                  price: item.price || 0,
                  pieces: item.pieces || 1,
                },
          productId:
            typeof item.productId === "object"
              ? item.productId
              : {
                  _id: item.productId,
                  name: item.name || "Product",
                  image: item.image || "",
                },
        }));
        setCartItems(transformedItems);
        calculateTotal(transformedItems);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const price = item.variantId?.price || item.price || 0;
      return sum + price * item.quantity;
    }, 0);
    setCartTotal(total);
  };

  const updateCartItem = async (itemId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/cart/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            itemId,
            quantity: newQuantity,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const items = data.cart.items || [];
        const transformedItems = items.map((item) => ({
          ...item,
          variantId:
            typeof item.variantId === "object"
              ? item.variantId
              : {
                  name: item.variantName || "Regular",
                  price: item.price || 0,
                  pieces: item.pieces || 1,
                },
          productId:
            typeof item.productId === "object"
              ? item.productId
              : {
                  _id: item.productId,
                  name: item.name || "Product",
                  image: item.image || "",
                },
        }));
        setCartItems(transformedItems);
        calculateTotal(transformedItems);
        window.dispatchEvent(new Event("cartUpdated"));
        return true;
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
      return false;
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/cart/remove`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            itemId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const items = data.cart.items || [];
        const transformedItems = items.map((item) => ({
          ...item,
          variantId:
            typeof item.variantId === "object"
              ? item.variantId
              : {
                  name: item.variantName || "Regular",
                  price: item.price || 0,
                  pieces: item.pieces || 1,
                },
          productId:
            typeof item.productId === "object"
              ? item.productId
              : {
                  _id: item.productId,
                  name: item.name || "Product",
                  image: item.image || "",
                },
        }));
        setCartItems(transformedItems);
        calculateTotal(transformedItems);
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Item removed from cart");
        return true;
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast.error("Failed to remove item");
      return false;
    }
  };

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        const userData = data.user;
        const token = data.token;

        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("svh_user", JSON.stringify(userData));

        setUser(userData);
        setIsLoggedIn(true);

        // Update Redux state
        dispatch(setEmail(userData.email));
        dispatch(setVerified(userData.isVerified || false));

        toast.success("Success!", {
          description: "You have successfully logged in.",
        });

        setIsAuthOpen(false);
        resetForms();
        fetchCart();

        // Verify with me endpoint
        checkAuthStatus();
      } else {
        toast.error("Login Failed", {
          description: data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register Form Submit
  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerPassword !== registerConfirmPassword) {
      toast.error("Validation Error", {
        description: "Passwords do not match",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: registerName,
            email: registerEmail,
            password: registerPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Registration Successful!", {
          description: "Your account has been created. Please login.",
        });

        setActiveTab("login");
        setLoginEmail(registerEmail);
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterConfirmPassword("");
      } else {
        toast.error("Registration Failed", {
          description: data.message || "Could not create account",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: error.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCartItems([]);
    localStorage.removeItem("svh_user");
    localStorage.removeItem("token");
    dispatch(setEmail(""));
    dispatch(setVerified(false));
    toast.success("Logged Out", {
      description: "You have been successfully logged out.",
    });
  };

  const resetForms = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    setActiveTab("login");
  };

  const handleDialogClose = (open) => {
    setIsAuthOpen(open);
    if (!open) {
      resetForms();
    }
  };

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { href: "/about", label: "About", icon: <Info className="w-5 h-5" /> },
    {
      href: "/menu",
      label: "Menu",
      icon: <Menu className="w-5 h-5" />,
      icon: <Utensils className="w-5 h-5" />,
      hasDropdown: true,
      dropdownItems: [
        { href: "/products", label: "Non-veg", icon: "🍛" },
        { href: "/products", label: "Veg", icon: "🥡" },
      ],
    },
    {
      href: "/catering",
      label: "Catering",
      icon: <PartyPopper className="w-5 h-5" />,
    },
    {
      href: "/contact",
      label: "Contact",
      icon: <PhoneCall className="w-5 h-5" />,
    },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Show loading state while checking auth
  if (isAuthLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a120a]/95 backdrop-blur-xl py-2">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center justify-between">
            <span className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#daa520] to-[#f5c542] bg-clip-text text-transparent">
              SVH Foods
            </span>
            <div className="w-10 h-10 rounded-full bg-[#1a251a] animate-pulse" />
          </Link>
        </nav>
      </header>
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a120a]/95 backdrop-blur-xl py-2 shadow-2xl"
            : "bg-transparent py-4"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative group">
              <span className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#daa520] to-[#f5c542] bg-clip-text text-transparent tracking-tight">
                SVH Foods
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#daa520] to-[#f5c542] group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              <ul className="flex items-center gap-1">
                {navItems.map((item) => (
                  <li key={item.label}>
                    {item.hasDropdown ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={`relative px-4 py-2 font-medium text-sm tracking-wide transition-all duration-300 rounded-lg hover:bg-white/5 group flex items-center ${
                              isActive(item.href)
                                ? "text-[#daa520]"
                                : "text-[#f0e5d0] hover:text-[#daa520]"
                            }`}
                          >
                            {item.label}
                            <ChevronDown className="w-4 h-4 ml-1  transition-transform" />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="bg-[#0f150f] border border-[#daa520]/20 text-white mt-2">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <DropdownMenuItem key={dropdownItem.label} asChild>
                              <Link
                                href={dropdownItem.href}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-[#1a251a]"
                              >
                                <span>{dropdownItem.icon}</span>
                                {dropdownItem.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Link
                        href={item.href}
                        className={`relative px-4 py-2 font-medium text-sm tracking-wide transition-all duration-300 rounded-lg hover:bg-white/5 ${
                          isActive(item.href)
                            ? "text-[#daa520]"
                            : "text-[#f0e5d0] hover:text-[#daa520]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* Desktop Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Cart Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 bg-[#1a251a] hover:bg-[#2a352a] border border-[#daa520]/30 rounded-full text-[#daa520] hover:text-[#f5d791] transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[#daa520] text-black text-xs font-bold rounded-full">
                      {cartItemCount}
                    </Badge>
                  )}
                </button>

                {/* User Menu */}
                {isLoggedIn && user ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center gap-2 px-3 py-2 bg-[#1a251a] hover:bg-[#2a352a] border border-[#daa520]/30 rounded-full text-[#daa520] hover:text-[#f5d791] transition-all duration-300 group">
                        <Avatar className="w-8 h-8 border-2 border-[#daa520]/50 group-hover:border-[#daa520] transition-colors">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="bg-[#2a352a] text-[#daa520] text-sm font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {user?.name?.split(" ")[0] || "User"}
                        </span>
                        <ChevronDown className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-64 p-0 bg-[#0f150f] border border-[#daa520]/20 rounded-2xl shadow-2xl overflow-hidden"
                      align="end"
                      sideOffset={8}
                    >
                      <div className="p-4 bg-gradient-to-r from-[#1a251a] to-[#0f150f] border-b border-[#daa520]/20">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12 border-2 border-[#daa520]">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback className="bg-[#2a352a] text-[#daa520] text-lg font-bold">
                              {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-semibold">
                              {user?.name}
                            </p>
                            <p className="text-[#8a8470] text-xs">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <Link
                          href="/user/profile"
                          className="flex items-center gap-3 px-4 py-3 text-[#f0e5d0] hover:text-[#daa520] hover:bg-[#1a251a] rounded-xl transition-all"
                        >
                          <User className="w-5 h-5 text-[#6a6558] group-hover:text-[#daa520]" />
                          <span className="text-sm font-medium">
                            My Profile
                          </span>
                        </Link>

                        <Link
                          href="/user/orders"
                          className="flex items-center gap-3 px-4 py-3 text-[#f0e5d0] hover:text-[#daa520] hover:bg-[#1a251a] rounded-xl transition-all"
                        >
                          <ShoppingCart className="w-5 h-5 text-[#6a6558] group-hover:text-[#daa520]" />
                          <span className="text-sm font-medium">My Orders</span>
                        </Link>

                        <Link
                          href="/user/addresses"
                          className="flex items-center gap-3 px-4 py-3 text-[#f0e5d0] hover:text-[#daa520] hover:bg-[#1a251a] rounded-xl transition-all"
                        >
                          <MapPin className="w-5 h-5 text-[#6a6558] group-hover:text-[#daa520]" />
                          <span className="text-sm font-medium">
                            Saved Addresses
                          </span>
                        </Link>

                        <Link
                          href="/user/settings"
                          className="flex items-center gap-3 px-4 py-3 text-[#f0e5d0] hover:text-[#daa520] hover:bg-[#1a251a] rounded-xl transition-all"
                        >
                          <Settings className="w-5 h-5 text-[#6a6558] group-hover:text-[#daa520]" />
                          <span className="text-sm font-medium">Settings</span>
                        </Link>
                      </div>

                      <div className="h-px bg-[#daa520]/20 mx-2" />

                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
                        >
                          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#daa520]/10 hover:bg-[#daa520]/20 border border-[#daa520]/30 rounded-full text-[#daa520] hover:text-[#f5c542] transition-all duration-300"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Login</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Header Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Mobile Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-[#1a251a] border border-[#daa520]/30 rounded-full text-[#daa520]"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[#daa520] text-black text-xs font-bold rounded-full">
                    {cartItemCount}
                  </Badge>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#1a251a] border border-[#daa520]/30 text-[#daa520]"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden fixed inset-x-0 top-[73px] transition-all duration-500 ease-in-out transform ${
              isOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10 pointer-events-none"
            }`}
          >
            <div className="bg-[#0f150f]/95 backdrop-blur-xl border-t border-b border-[#daa520]/20 shadow-2xl max-h-[calc(100vh-73px)] overflow-y-auto">
              <div className="container mx-auto px-4 py-6">
                {/* Mobile User Section */}
                <div className="mb-6 pb-6 border-b border-[#daa520]/20">
                  {isLoggedIn && user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-[#daa520]">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="bg-[#2a352a] text-[#daa520]">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[#daa520] font-semibold">
                            {user?.name}
                          </p>
                          <p className="text-[#8a8470] text-xs">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500/10 rounded-lg text-red-500 text-sm font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsAuthOpen(true);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-[#daa520]/10 to-[#daa520]/5 border border-[#daa520]/30 rounded-xl text-[#daa520] hover:bg-[#daa520]/20 transition-all"
                    >
                      <LogIn className="w-5 h-5" />
                      <span className="font-semibold">Login / Register</span>
                    </button>
                  )}
                </div>

                {/* Mobile Navigation */}
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <div key={item.label}>
                      {item.hasDropdown ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-full flex items-center justify-between px-4 py-4 text-[#f0e5d0] hover:text-[#daa520] font-medium bg-white/5 rounded-xl transition-all">
                              <span className="flex items-center gap-3">
                                {item.icon}
                                {item.label}
                              </span>
                              <ChevronDown className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-full bg-[#1a251a] border border-[#daa520]/20">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <DropdownMenuItem
                                key={dropdownItem.label}
                                asChild
                              >
                                <Link
                                  href={dropdownItem.href}
                                  className="flex items-center gap-3 px-4 py-3 text-[#f0e2b0] hover:text-[#daa520] w-full"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <span className="text-xl">
                                    {dropdownItem.icon}
                                  </span>
                                  <span>{dropdownItem.label}</span>
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-4 text-[#f0e5d0] hover:text-[#daa520] font-medium bg-white/5 rounded-xl transition-all"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Cart Sheet */}
      <CartSheet
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        cartItems={cartItems}
        cartLoading={cartLoading}
        cartTotal={cartTotal}
        onUpdate={updateCartItem}
        onRemove={removeCartItem}
      />

      {/* Auth Dialog */}
      <Dialog open={isAuthOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[450px] bg-[#0f150f] border border-[#daa520]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair text-[#daa520] text-center">
              Welcome to SVH Foods
            </DialogTitle>
            <DialogDescription className="text-[#a8a08c] text-center">
              Login to your account or create a new one
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-[#daa520]/20 border border-[#daa520]">
              <TabsTrigger
                value="login"
                className="text-[#daa520] data-[state=active]:bg-[#daa520] data-[state=active]:text-[#0a120a] data-[state=active]:font-semibold"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="text-[#daa520] data-[state=active]:bg-[#daa520] data-[state=active]:text-[#0a120a] data-[state=active]:font-semibold"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="bg-transparent border-none">
                <CardContent className="p-0 pt-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-white">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6558]" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10 bg-[#1a251a] border-[#daa520]/30 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-white">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6558]" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10 bg-[#1a251a] border-[#daa520]/30 text-white"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#daa520] to-[#f5c542] text-black font-semibold"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="bg-transparent border-none">
                <CardContent className="p-0 pt-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-white">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6558]" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          className="pl-10 bg-[#1a251a] border-[#daa520]/30 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-white">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6558]" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="Enter your email"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="pl-10 bg-[#1a251a] border-[#daa520]/30 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-white">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6558]" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Create a password"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="pl-10 bg-[#1a251a] border-[#daa520]/30 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="register-confirm-password"
                        className="text-white"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6558]" />
                        <Input
                          id="register-confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={registerConfirmPassword}
                          onChange={(e) =>
                            setRegisterConfirmPassword(e.target.value)
                          }
                          className="pl-10 bg-[#1a251a] border-[#daa520]/30 text-white"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#daa520] to-[#f5c542] text-black font-semibold"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-center text-[#6a6558] mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};
