'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Leaf, ChartCandlestickIcon, Clock, ShoppingBag, CheckCircle } from 'lucide-react'
import { useGSAP } from '@/hooks/useGSAP'

export default function Home() {
  const { heroRef, parallaxRef, counterRef } = useGSAP()
  const canvasRef = useRef(null)
  const aboutImgRef = useRef(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [vegProducts, setVegProducts] = useState([])
  const [nonVegProducts, setNonVegProducts] = useState([])

  const testimonials = [
    '⭐ "Best Mughlai & Chinese! Always fresh." – Priya',
    '⭐ "Great catering for our wedding!" – Verma family',
    '⭐ "Butter chicken is out of the world." – Rajat',
  ]

  const aboutImages = [
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  ]

  // Fetch real products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        
        if (data.success) {
          setProducts(data.products)
          
          // Filter and limit to 4 veg and 4 non-veg
          const veg = data.products.filter(p => p.isVeg).slice(0, 4)
          const nonVeg = data.products.filter(p => !p.isVeg).slice(0, 4)
          
          setVegProducts(veg)
          setNonVegProducts(nonVeg)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback to dummy data if API fails
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Steam canvas effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let particles = []

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    const initParticles = () => {
      const w = canvas.width
      const h = canvas.height
      particles = []
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * w * 0.7 + w * 0.15,
          y: Math.random() * h * 0.4 + h * 0.5,
          r: 10 + Math.random() * 25,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -0.3 - Math.random() * 0.3,
          o: 0.1 + Math.random() * 0.3
        })
      }
    }

    const drawSteam = () => {
      const w = canvas.width
      const h = canvas.height
      
      if (!w || !h) return

      ctx.clearRect(0, 0, w, h)
      
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.o *= 0.999
        p.r *= 0.999

        if (p.y < -50 || p.o < 0.01 || p.x < 0 || p.x > w) {
          p.x = Math.random() * w * 0.7 + w * 0.15
          p.y = h * 0.8 + Math.random() * h * 0.1
          p.r = 15 + Math.random() * 30
          p.o = 0.15 + Math.random() * 0.25
          p.vy = -0.3 - Math.random() * 0.2
        }

        ctx.beginPath()
        const grad = ctx.createRadialGradient(p.x, p.y, 2, p.x + 8, p.y - 6, p.r * 1.3)
        grad.addColorStop(0, `rgba(255,245,200,${p.o})`)
        grad.addColorStop(1, `rgba(200,170,120,0)`)
        ctx.fillStyle = grad
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })
      animationFrameId = requestAnimationFrame(drawSteam)
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    initParticles()
    drawSteam()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Random about image
  useEffect(() => {
    if (aboutImgRef.current) {
      const randomImage = aboutImages[Math.floor(Math.random() * aboutImages.length)]
      aboutImgRef.current.style.backgroundImage = `url('${randomImage}')`
    }
  }, [])

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Get display price (first variant or show range if multiple)
  const getDisplayPrice = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return <span className="text-[#daa520]">₹{product.price || 0}</span>;
    }
    
    if (product.variants.length === 1) {
      return <span className="text-[#daa520]">₹{product.variants[0].price}</span>;
    }
    
    // Multiple variants - show price range
    const prices = product.variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    return (
      <div className="flex flex-col items-start">
        <span className="text-[#daa520] text-2xl font-bold">₹{minPrice}</span>
        {minPrice !== maxPrice && (
          <span className="text-[#a9a48c] text-xs">to ₹{maxPrice}</span>
        )}
      </div>
    );
  };

  // Get available sizes
  const getSizes = (product) => {
    if (!product.variants || product.variants.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mb-3">
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
      className="gsap-card group bg-[#242a26] rounded-3xl overflow-hidden border border-[#3c463e]/50 shadow-2xl hover:border-[#daa520] hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 bg-gradient-to-b from-[#2a332a]/50 to-transparent"
    >
      <Link href={`/products/${product._id}`}>
        <div className="relative h-64 md:h-72 lg:h-80 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 cursor-pointer" 
             style={{ backgroundImage: `url('${product.image}')` }}>
          
          {/* Category Badge */}
          {product.category && product.category.name && (
            <div className="absolute top-4 left-4">
              <span className="bg-[#daa520]/90 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                {product.category.name}
              </span>
            </div>
          )}
          
          {/* Veg/Non-Veg Badge */}
          <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
            {product.isVeg ? (
              <Leaf className="w-6 h-6 text-green-600" />
            ) : (
              <ChartCandlestickIcon className="w-6 h-6 text-red-500" />
            )}
          </div>
          
          {/* Availability Badge */}
          {product.isAvailable ? (
            <div className="absolute bottom-4 left-4 bg-green-500/90 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Available
            </div>
          ) : (
            <div className="absolute bottom-4 left-4 bg-red-500/90 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
              Out of Stock
            </div>
          )}
          
          {/* Preparation Time */}
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {product.preparationTime || 20} min
          </div>
        </div>
      </Link>
      
      <div className="p-6 md:p-8">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-2xl md:text-3xl font-bold text-[#f5d791] mb-2 group-hover:text-[#ffd966] transition-colors line-clamp-2 cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-[#a9a48c] text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        {/* Variants/Sizes */}
        {getSizes(product)}
        
        <div className="flex items-center justify-between mb-6">
          <div className="text-3xl font-bold">
            {getDisplayPrice(product)}
          </div>
          <div className="flex items-center gap-2 text-[#a9a48c] text-sm font-medium">
            <ShoppingBag className="w-4 h-4" />
            {product.variants?.length || 1} size{product.variants?.length !== 1 ? 's' : ''}
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
  )

  return (
    <>
      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="min-h-screen flex items-center relative overflow-hidden pt-20 md:pt-0">
        <div 
          ref={parallaxRef}
          className="absolute -top-[5%] -left-[5%] w-[110%] h-[110%] bg-cover bg-center z-[-2] brightness-[0.75] saturate-[1.2]"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/941869/pexels-photo-941869.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-[-1]" />
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />
        
        <div className="container-custom max-w-6xl px-4 mx-auto flex-1 flex flex-col items-start justify-center">
          <h1 className="gsap-fade text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl leading-tight mb-6 max-w-2xl">
            Authentic Mughlai & Chinese Flavors in Vaishali
          </h1>
          <div className="subhead gsap-fade text-2xl md:text-3xl lg:text-4xl font-light text-[#f5d791] mb-8 max-w-xl">
            Premium Quality • Hygienic Kitchen • Free Home Delivery
          </div>
          <div className="buttons gsap-fade flex flex-wrap gap-4">
            <Link href="/products" className="px-8 py-4 bg-gradient-to-r from-[#daa520] to-[#f5d791] text-black font-bold rounded-3xl text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
              🍽️ Explore Menu
            </Link>
            <Link href="/products" className="px-8 py-4 border-2 border-[#f5d791] text-[#f5d791] font-bold rounded-3xl text-lg hover:bg-[#f5d791] hover:text-black transition-all duration-300">
              🎉 Book Catering
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 bg-[#0a120a]">
        <div className="container-custom max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="about-left">
              <h2 className="section-title text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 bg-gradient-to-r from-[#f5d791] to-white bg-clip-text text-transparent">
                Taste of Tradition Since 2015
              </h2>
              <p className="text-gray-300 text-lg md:text-xl mb-6 leading-relaxed">
                SVH Foods brings the royal flavors of Mughlai cuisine and the sizzling taste of Chinese to your table. 
                Every dish is crafted with premium ingredients and authentic spices.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-4xl font-bold text-[#daa520] mb-2">8+</div>
                  <div className="text-gray-400">Years of Excellence</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#daa520] mb-2">50+</div>
                  <div className="text-gray-400">Premium Dishes</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#daa520] mb-2">10k+</div>
                  <div className="text-gray-400">Happy Customers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#daa520] mb-2">24/7</div>
                  <div className="text-gray-400">Fresh Kitchen</div>
                </div>
              </div>
              <Link href="/about" className="inline-flex items-center gap-4 bg-gradient-to-r from-[#daa520] to-[#f5d791] text-black font-bold px-8 py-4 rounded-3xl text-lg hover:shadow-2xl transition-all group">
                Know More About Us
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            <div 
              ref={aboutImgRef}
              className="about-right h-[400px] md:h-[500px] rounded-3xl bg-cover bg-center shadow-2xl border-4 border-[#daa520]/20"
            />
          </div>
        </div>
      </section>

      {/* Real Products Section */}
      <section id="menu" className="py-24 md:py-32 bg-[#151a17]">
        <div className="container-custom max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="section-title text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-[#f5d791] to-white bg-clip-text text-transparent">
              Fresh From Kitchen
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Discover our handpicked favorites. Real ingredients, real flavors.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {Array(8).fill().map((_, i) => (
                <div key={i} className="animate-pulse bg-[#242a26] rounded-3xl h-96" />
              ))}
            </div>
          ) : (
            <>
              {/* Veg Products */}
              {vegProducts.length > 0 && (
                <div className="mb-20">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="p-4 bg-green-500/10 rounded-2xl">
                      <Leaf className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">Pure Vegetarian</h3>
                    <span className="bg-[#daa520]/20 text-[#daa520] px-4 py-1 rounded-full text-sm ml-auto">
                      {vegProducts.length} items
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {vegProducts.map(renderProductCard)}
                  </div>
                </div>
              )}

              {/* Non-Veg Products */}
              {nonVegProducts.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="p-4 bg-red-500/10 rounded-2xl">
                      <ChartCandlestickIcon className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">Non-Vegetarian Delights</h3>
                    <span className="bg-[#daa520]/20 text-[#daa520] px-4 py-1 rounded-full text-sm ml-auto">
                      {nonVegProducts.length} items
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {nonVegProducts.map(renderProductCard)}
                  </div>
                </div>
              )}

              {/* Explore All Button */}
              <div className="text-center mt-16">
                <Link 
                  href="/products"
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-[#daa520] to-[#f5d791] text-black font-bold px-12 py-6 rounded-3xl text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 group"
                >
                  Explore All Products
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
                <p className="text-gray-400 mt-4 text-lg">{products.length}+ Items Available</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Delivery & Catering Section */}
      <section id="delivery-catering" className="py-24 md:py-32 bg-[#0a120a]">
        <div className="container-custom max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Delivery Card */}
            <div className="bg-gradient-to-br from-[#1a251a] to-[#0f150f] rounded-3xl p-10 border border-[#daa520]/20 hover:border-[#daa520]/40 transition-all group">
              <div className="w-20 h-20 bg-[#daa520]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-[#daa520]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Free Home Delivery</h3>
              <p className="text-gray-400 text-lg mb-8">
                Get your favorite dishes delivered hot and fresh to your doorstep. Free delivery on all orders above ₹299.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>30-45 min delivery time</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Contactless delivery available</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Track your order in real-time</span>
                </li>
              </ul>
              <Link href="/order" className="inline-flex items-center gap-2 text-[#daa520] font-semibold text-lg hover:text-[#f5d791] transition-colors">
                Order Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Catering Card */}
            <div className="bg-gradient-to-br from-[#1a251a] to-[#0f150f] rounded-3xl p-10 border border-[#daa520]/20 hover:border-[#daa520]/40 transition-all group">
              <div className="w-20 h-20 bg-[#daa520]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-[#daa520]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Catering Services</h3>
              <p className="text-gray-400 text-lg mb-8">
                Make your events memorable with our premium catering services. Weddings, parties, corporate events - we serve it all.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Customized menu options</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Professional catering staff</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Flexible packages for all budgets</span>
                </li>
              </ul>
              <Link href="/catering" className="inline-flex items-center gap-2 text-[#daa520] font-semibold text-lg hover:text-[#f5d791] transition-colors">
                Inquire Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 md:py-32 bg-[#151a17]">
        <div className="container-custom max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 bg-gradient-to-r from-[#f5d791] to-white bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          <div className="bg-[#1a251a] rounded-3xl p-10 border border-[#daa520]/20">
            <p className="text-2xl md:text-3xl text-[#f5d791] mb-6 transition-all duration-500">
              {testimonials[currentTestimonial]}
            </p>
            <div className="flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial ? 'w-8 bg-[#daa520]' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}