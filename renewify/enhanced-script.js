import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger")
  const navList = document.querySelector(".nav-list")

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navList.classList.toggle("active")

      const bars = hamburger.querySelectorAll(".bar")
      if (hamburger.classList.contains("active")) {
        bars[0].style.transform = "translateY(8px) rotate(45deg)"
        bars[1].style.opacity = "0"
        bars[2].style.transform = "translateY(-8px) rotate(-45deg)"
      } else {
        bars[0].style.transform = "none"
        bars[1].style.opacity = "1"
        bars[2].style.transform = "none"
      }
    })
  }

  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navList.classList.contains("active")) {
        hamburger.click()
      }
    })
  })

  const header = document.querySelector(".header")
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  const filterBtns = document.querySelectorAll(".filter-btn")
  const productCardsFilter = document.querySelectorAll(".product-card")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((btn) => btn.classList.remove("active"))

      this.classList.add("active")

      const filter = this.getAttribute("data-filter")

      productCardsFilter.forEach((card, index) => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          gsap.to(card, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            delay: index * 0.1,
            ease: "back.out(1.7)",
            clearProps: "all",
            onStart: () => {
              card.style.display = "block"
            },
          })
        } else {
          gsap.to(card, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              card.style.display = "none"
            },
          })
        }
      })
    })
  })
  const addToCartBtns = document.querySelectorAll(".add-to-cart-btn")

  addToCartBtns.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
      })
    })

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      })
    })
  })

  const productCards = document.querySelectorAll(".product-card")

  productCards.forEach((card) => {
    const image = card.querySelector(".product-image img")
    const actions = card.querySelector(".product-actions")

    card.addEventListener("mouseenter", () => {
      gsap.to(image, {
        scale: 1.1,
        duration: 0.4,
        ease: "power2.out",
      })

      gsap.to(actions, {
        y: -5,
        duration: 0.3,
        ease: "power2.out",
      })
    })

    card.addEventListener("mouseleave", () => {
      gsap.to(image, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      })

      gsap.to(actions, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      })
    })
  })

  const testimonials = document.querySelectorAll(".testimonial")
  const dots = document.querySelectorAll(".dot")
  const prevBtn = document.querySelector(".testimonial-btn.prev")
  const nextBtn = document.querySelector(".testimonial-btn.next")
  let currentTestimonial = 0

  function showTestimonial(index) {
    testimonials.forEach((testimonial) => {
      testimonial.classList.remove("active")
    })

    dots.forEach((dot) => {
      dot.classList.remove("active")
    })

    if (testimonials[index]) {
      testimonials[index].classList.add("active")
      if (dots[index]) {
        dots[index].classList.add("active")
      }
    }
  }

  if (testimonials.length > 0) {
    showTestimonial(currentTestimonial)

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentTestimonial++
        if (currentTestimonial >= testimonials.length) {
          currentTestimonial = 0
        }
        showTestimonial(currentTestimonial)
      })
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentTestimonial--
        if (currentTestimonial < 0) {
          currentTestimonial = testimonials.length - 1
        }
        showTestimonial(currentTestimonial)
      })
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        currentTestimonial = index
        showTestimonial(currentTestimonial)
      })
    })

    setInterval(() => {
      if (nextBtn) {
        nextBtn.click()
      }
    }, 5000)
  }

  function animateStats() {
    const stats = document.querySelectorAll(".stat-number")

    stats.forEach((stat) => {
      const target = Number.parseInt(stat.getAttribute("data-count"))
      const duration = 2000
      const step = (target / duration) * 10 
      let current = 0

      const counter = setInterval(() => {
        current += step
        if (current >= target) {
          clearInterval(counter)
          stat.textContent = target
        } else {
          stat.textContent = Math.floor(current)
        }
      }, 10)
    })
  }

  const statsContainers = document.querySelectorAll(".stats-container, .impact-stats")
  if (statsContainers.length > 0) {
    statsContainers.forEach((container) => {
      ScrollTrigger.create({
        trigger: container,
        start: "top 80%",
        onEnter: animateStats,
        once: true,
      })
    })
  }


  const pageHeaders = document.querySelectorAll(".page-header, .hero-content")
  if (pageHeaders.length > 0) {
    gsap.from(pageHeaders, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
  }

  const productCardsAnimation = document.querySelectorAll(".product-card")
  if (productCardsAnimation.length > 0) {
    ScrollTrigger.batch(productCardsAnimation, {
      interval: 0.1,
      batchMax: 3,
      onEnter: (batch) => {
        gsap.from(batch, {
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
        })
      },
      start: "top 85%",
    })
  }

  const priceRange = document.getElementById("price-range")
  const priceValue = document.getElementById("price-value")
  if (priceRange && priceValue) {
    priceRange.addEventListener("input", function () {
      priceValue.textContent = `$${this.value}`
    })
  }

  gsap.utils.toArray(".section-title").forEach((title) => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    })
  })

  const heroBackground = document.querySelector(".hero-background")
  if (heroBackground) {
    gsap.to(heroBackground, {
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
      y: -100,
      ease: "none",
    })
  }
})

function formatPrice(price) {
  return `$${price.toFixed(2)}`
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const debouncedSearch = debounce((searchTerm) => {
  const productCards = document.querySelectorAll(".product-card")

  productCards.forEach((card) => {
    const title = card.querySelector(".product-title").textContent.toLowerCase()
    const creator = card.querySelector(".product-creator").textContent.toLowerCase()
    const description = card.querySelector(".product-description").textContent.toLowerCase()

    const matches = title.includes(searchTerm) || creator.includes(searchTerm) || description.includes(searchTerm)

    if (matches || searchTerm === "") {
      gsap.to(card, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        onStart: () => {
          card.style.display = "block"
        },
      })
    } else {
      gsap.to(card, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        onComplete: () => {
          card.style.display = "none"
        },
      })
    }
  })
}, 300)

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("product-search-input")
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      debouncedSearch(e.target.value.toLowerCase())
    })
  }
})
