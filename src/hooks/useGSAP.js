'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useGSAP = () => {
  const heroRef = useRef(null)
  const parallaxRef = useRef(null)
  const counterRef = useRef(null)

  useEffect(() => {
    // Fade animations
    gsap.utils.toArray('.gsap-fade').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
      })
    })

    gsap.utils.toArray('.gsap-reveal').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 30,
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
      })
    })

    gsap.utils.toArray('.gsap-card').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
        },
      })
    })

    // Parallax effect
    if (parallaxRef.current) {
      gsap.to(parallaxRef.current, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }

    // Counter animation
    let counterTriggered = false
    ScrollTrigger.create({
      trigger: counterRef.current,
      start: 'top 80%',
      onEnter: () => {
        if (!counterTriggered && counterRef.current) {
          counterTriggered = true
          const obj = { val: 850 }
          gsap.to(obj, {
            val: 1020,
            duration: 2,
            ease: 'power2',
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.innerText = Math.floor(obj.val) + '+'
              }
            },
          })
        }
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return { heroRef, parallaxRef, counterRef }
}