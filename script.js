// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize GSAP and ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)

  // Mobile Navigation Toggle
  const hamburger = document.querySelector(".hamburger")
  const navList = document.querySelector(".nav-list")

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navList.classList.toggle("active")

      // Toggle hamburger animation
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

  // Close mobile menu when clicking on a nav link
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navList.classList.contains("active")) {
        hamburger.click()
      }
    })
  })

  // Sticky Header
  const header = document.querySelector(".header")
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Active Navigation Link on Scroll (only for index page)
  if (window.location.pathname === "/" || window.location.pathname.includes("index")) {
    const sections = document.querySelectorAll("section[id]")
    window.addEventListener("scroll", () => {
      let current = ""

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight

        if (pageYOffset >= sectionTop - sectionHeight / 3) {
          current = section.getAttribute("id")
        }
      })

      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${current}` || link.getAttribute("href").includes(`#${current}`)) {
          link.classList.add("active")
        }
      })
    })
  }

  // Product Filtering
  const filterBtns = document.querySelectorAll(".filter-btn")
  const productCardsFilter = document.querySelectorAll(".product-card")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      filterBtns.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      const filter = this.getAttribute("data-filter")

      // Filter products
      productCardsFilter.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          gsap.to(card, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "power1.out",
            clearProps: "all",
            onComplete: () => {
              card.style.display = "block"
            },
          })
        } else {
          gsap.to(card, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power1.out",
            onComplete: () => {
              card.style.display = "none"
            },
          })
        }
      })

      // If filter is 'all', show all products
      if (filter === "all") {
        productCardsFilter.forEach((card) => {
          card.style.display = "block"
        })
      }
    })
  })

  // Testimonial Slider
  const testimonials = document.querySelectorAll(".testimonial")
  const dots = document.querySelectorAll(".dot")
  const prevBtn = document.querySelector(".testimonial-btn.prev")
  const nextBtn = document.querySelector(".testimonial-btn.next")
  let currentTestimonial = 0

  function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach((testimonial) => {
      testimonial.classList.remove("active")
    })

    // Remove active class from all dots
    dots.forEach((dot) => {
      dot.classList.remove("active")
    })

    // Show current testimonial
    if (testimonials[index]) {
      testimonials[index].classList.add("active")
      if (dots[index]) {
        dots[index].classList.add("active")
      }
    }
  }

  // Initialize testimonial slider
  if (testimonials.length > 0) {
    showTestimonial(currentTestimonial)

    // Next button click
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentTestimonial++
        if (currentTestimonial >= testimonials.length) {
          currentTestimonial = 0
        }
        showTestimonial(currentTestimonial)
      })
    }

    // Previous button click
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentTestimonial--
        if (currentTestimonial < 0) {
          currentTestimonial = testimonials.length - 1
        }
        showTestimonial(currentTestimonial)
      })
    }

    // Dot click
    dots.forEach((dot) => {
      dot.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        currentTestimonial = index
        showTestimonial(currentTestimonial)
      })
    })

    // Auto slide testimonials
    setInterval(() => {
      if (nextBtn) {
        nextBtn.click()
      }
    }, 5000)
  }

  // Animate stats counter
  function animateStats() {
    const stats = document.querySelectorAll(".stat-number")

    stats.forEach((stat) => {
      const target = Number.parseInt(stat.getAttribute("data-count"))
      const duration = 2000 // 2 seconds
      const step = (target / duration) * 10 // Update every 10ms
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

  // Trigger stats animation when scrolled into view
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

  // GSAP Animations - Apply to all pages

  // Page intro animations
  const pageHeaders = document.querySelectorAll(".page-header, .hero-content")
  if (pageHeaders.length > 0) {
    gsap.from(pageHeaders, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
  }

  // About section animations
  const aboutContent = document.querySelectorAll(".about-content > *, .story-content > *, .mission-content > *")
  if (aboutContent.length > 0) {
    ScrollTrigger.batch(aboutContent, {
      interval: 0.2,
      batchMax: 3,
      onEnter: (batch) => {
        gsap.from(batch, {
          opacity: 0,
          y: 30,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        })
      },
      start: "top 80%",
    })
  }

  // Steps animations
  const steps = document.querySelectorAll(".step, .mission-goal, .team-member, .contact-card")
  if (steps.length > 0) {
    ScrollTrigger.batch(steps, {
      interval: 0.1,
      batchMax: 4,
      onEnter: (batch) => {
        gsap.from(batch, {
          opacity: 0,
          y: 50,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
        })
      },
      start: "top 80%",
    })
  }

  // Product card animations
  const productCardsAnimation = document.querySelectorAll(".product-card, .story-card")
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

  // Dashboard features animation
  const dashboardFeatures = document.querySelectorAll(".dashboard-feature")
  if (dashboardFeatures.length > 0) {
    ScrollTrigger.batch(dashboardFeatures, {
      interval: 0.1,
      batchMax: 4,
      onEnter: (batch) => {
        gsap.from(batch, {
          opacity: 0,
          x: -30,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
        })
      },
      start: "top 80%",
    })
  }

  // Contact form submission
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const subject = document.getElementById("subject").value
      const message = document.getElementById("message").value

      // Here you would typically send the form data to a server
      // For demo purposes, we'll just log it to the console
      console.log("Form submitted:", { name, email, subject, message })

      // Reset form
      contactForm.reset()

      // Show success message (you can replace this with a proper UI notification)
      alert("Thank you for your message! We will get back to you soon.")
    })
  }

  // Browse page category filter
  const categoryLinks = document.querySelectorAll(".category-list a")
  if (categoryLinks.length > 0) {
    categoryLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()

        // Remove active class from all links
        categoryLinks.forEach((link) => link.classList.remove("active"))

        // Add active class to clicked link
        this.classList.add("active")

        // Get category filter
        const filter = this.getAttribute("data-category")

        // Filter products (if on browse page)
        const browseProducts = document.querySelectorAll(".product-grid .product-card")
        if (browseProducts.length > 0) {
          browseProducts.forEach((product) => {
            if (filter === "all" || product.getAttribute("data-category") === filter) {
              product.style.display = "block"
              gsap.to(product, {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                ease: "power1.out",
              })
            } else {
              gsap.to(product, {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                ease: "power1.out",
                onComplete: () => {
                  product.style.display = "none"
                },
              })
            }
          })
        }
      })
    })
  }

  // Price range slider
  const priceRange = document.getElementById("price-range")
  const priceValue = document.getElementById("price-value")
  if (priceRange && priceValue) {
    priceRange.addEventListener("input", function () {
      priceValue.textContent = `$${this.value}`
    })
  }

  // Featured products carousel for browse page
  const featuredSection = document.querySelector(".featured-products")
  if (featuredSection) {
    const featuredProducts = featuredSection.querySelectorAll(".product-card")
    let currentIndex = 0

    function showFeaturedProducts() {
      featuredProducts.forEach((product, index) => {
        if (index >= currentIndex && index < currentIndex + 4) {
          product.style.display = "block"
        } else {
          product.style.display = "none"
        }
      })
    }

    const prevFeatured = document.querySelector(".featured-prev")
    const nextFeatured = document.querySelector(".featured-next")

    if (prevFeatured && nextFeatured) {
      prevFeatured.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--
          showFeaturedProducts()
        }
      })

      nextFeatured.addEventListener("click", () => {
        if (currentIndex < featuredProducts.length - 4) {
          currentIndex++
          showFeaturedProducts()
        }
      })

      // Initialize
      showFeaturedProducts()
    }
  }
})
  
