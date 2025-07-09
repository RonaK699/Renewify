class ShoppingCart {
  constructor() {
    this.items = []
    this.isOpen = false
    this.init()
    this.loadCartFromStorage()
  }

  init() {
    this.cartToggle = document.getElementById("cart-toggle")
    this.cartSidebar = document.getElementById("cart-sidebar")
    this.cartOverlay = document.getElementById("cart-overlay")
    this.cartClose = document.getElementById("cart-close")
    this.cartCount = document.getElementById("cart-count")
    this.cartItems = document.getElementById("cart-items")
    this.cartEmpty = document.getElementById("cart-empty")
    this.cartSubtotal = document.getElementById("cart-subtotal")
    this.cartShipping = document.getElementById("cart-shipping")
    this.cartTotal = document.getElementById("cart-total")
    this.checkoutBtn = document.getElementById("checkout-btn")
    this.successToast = document.getElementById("success-toast")

    this.bindEvents()

    this.updateCartDisplay()
  }

  bindEvents() {
    this.cartToggle?.addEventListener("click", () => this.toggleCart())
    this.cartClose?.addEventListener("click", () => this.closeCart())
    this.cartOverlay?.addEventListener("click", () => this.closeCart())

    document.addEventListener("click", (e) => {
      if (e.target.closest(".add-to-cart-btn")) {
        e.preventDefault()
        this.handleAddToCart(e.target.closest(".add-to-cart-btn"))
      }
    })

    this.checkoutBtn?.addEventListener("click", () => this.handleCheckout())

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeCart()
      }
    })

    window.addEventListener("beforeunload", () => {
      this.saveCartToStorage()
    })
  }

  handleAddToCart(button) {
    const productData = {
      id: button.getAttribute("data-product-id"),
      name: button.getAttribute("data-name"),
      price: Number.parseFloat(button.getAttribute("data-price")),
      image: button.getAttribute("data-image"),
      creator: button.getAttribute("data-creator"),
    }

    this.addButtonFeedback(button)

    this.addItem(productData)

    this.showToast("Product added to cart!")

    this.saveCartToStorage()
  }

  addButtonFeedback(button) {
    button.classList.add("adding")

    setTimeout(() => {
      button.classList.remove("adding")
      button.classList.add("added")

      setTimeout(() => {
        button.classList.remove("added")
      }, 600)
    }, 200)
  }

  addItem(productData) {
    const existingItem = this.items.find((item) => item.id === productData.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.items.push({
        ...productData,
        quantity: 1,
      })
    }

    this.updateCartDisplay()
    this.animateCartCount()
  }

  removeItem(productId) {
    const itemIndex = this.items.findIndex((item) => item.id === productId)

    if (itemIndex > -1) {
      const cartItemElement = document.querySelector(`[data-cart-item-id="${productId}"]`)

      if (cartItemElement) {
        cartItemElement.classList.add("cart-item-removing")

        setTimeout(() => {
          this.items.splice(itemIndex, 1)
          this.updateCartDisplay()
          this.saveCartToStorage()
        }, 300)
      }
    }
  }

  updateQuantity(productId, newQuantity) {
    const item = this.items.find((item) => item.id === productId)

    if (item) {
      if (newQuantity <= 0) {
        this.removeItem(productId)
      } else {
        item.quantity = newQuantity
        this.updateCartDisplay()
        this.saveCartToStorage()
      }
    }
  }

  updateCartDisplay() {
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0)
    this.cartCount.textContent = totalItems

    if (totalItems > 0) {
      this.cartCount.classList.add("show")
    } else {
      this.cartCount.classList.remove("show")
    }

    if (this.items.length === 0) {
      this.cartItems.style.display = "none"
      this.cartEmpty.style.display = "block"
      this.checkoutBtn.disabled = true
    } else {
      this.cartItems.style.display = "block"
      this.cartEmpty.style.display = "none"
      this.checkoutBtn.disabled = false
      this.renderCartItems()
    }

    this.updateCartTotals()
  }

  renderCartItems() {
    this.cartItems.innerHTML = ""

    this.items.forEach((item) => {
      const cartItemElement = this.createCartItemElement(item)
      this.cartItems.appendChild(cartItemElement)
    })
  }

  createCartItemElement(item) {
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item cart-item-enter"
    cartItem.setAttribute("data-cart-item-id", item.id)

    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-creator">${item.creator}</div>
        <div class="cart-item-controls">
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? "disabled" : ""}>
              <i class="fas fa-minus"></i>
            </button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          <button class="remove-item" onclick="cart.removeItem('${item.id}')" title="Remove item">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `

    return cartItem
  }

  updateCartTotals() {
    const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal > 0 ? 5.99 : 0
    const total = subtotal + shipping

    this.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`
    this.cartShipping.textContent = subtotal >= 50 ? "FREE" : `$${shipping.toFixed(2)}`
    this.cartTotal.textContent = `$${(subtotal >= 50 ? subtotal : total).toFixed(2)}`
  }

  toggleCart() {
    if (this.isOpen) {
      this.closeCart()
    } else {
      this.openCart()
    }
  }

  openCart() {
    this.isOpen = true
    this.cartSidebar.classList.add("active")
    this.cartOverlay.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  closeCart() {
    this.isOpen = false
    this.cartSidebar.classList.remove("active")
    this.cartOverlay.classList.remove("active")
    document.body.style.overflow = ""
  }

  animateCartCount() {
    this.cartCount.classList.add("animate")
    setTimeout(() => {
      this.cartCount.classList.remove("animate")
    }, 600)
  }

  showToast(message) {
    const toastMessage = this.successToast.querySelector(".toast-message")
    toastMessage.textContent = message

    this.successToast.classList.add("show")

    setTimeout(() => {
      this.successToast.classList.remove("show")
    }, 3000)
  }

  handleCheckout() {
    if (this.items.length === 0) return

    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    alert(
      `Proceeding to checkout with ${totalItems} items (Total: $${subtotal.toFixed(2)})\n\nIn a real application, this would redirect to the checkout page.`,
    )
  }

  saveCartToStorage() {
    try {
      localStorage.setItem("renewify_cart", JSON.stringify(this.items))
    } catch (error) {
      console.warn("Could not save cart to localStorage:", error)
    }
  }

  loadCartFromStorage() {
    try {
      const savedCart = localStorage.getItem("renewify_cart")
      if (savedCart) {
        this.items = JSON.parse(savedCart)
        this.updateCartDisplay()
      }
    } catch (error) {
      console.warn("Could not load cart from localStorage:", error)
      this.items = []
    }
  }

  clearCart() {
    this.items = []
    this.updateCartDisplay()
    this.saveCartToStorage()
    this.showToast("Cart cleared!")
  }

  getCartSummary() {
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return {
      items: this.items,
      totalItems,
      subtotal,
      shipping: subtotal >= 50 ? 0 : 5.99,
      total: subtotal >= 50 ? subtotal : subtotal + 5.99,
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.cart = new ShoppingCart()
  const gsap = window.gsap // Declare gsap variable

  const searchInput = document.getElementById("product-search-input")
  const productCards = document.querySelectorAll(".product-card")
  const categoryLinks = document.querySelectorAll(".category-list a")
  const sortOptions = document.querySelectorAll("[data-sort]")

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()

      productCards.forEach((card) => {
        const title = card.querySelector(".product-title").textContent.toLowerCase()
        const creator = card.querySelector(".product-creator").textContent.toLowerCase()
        const description = card.querySelector(".product-description").textContent.toLowerCase()

        const matches = title.includes(searchTerm) || creator.includes(searchTerm) || description.includes(searchTerm)

        if (matches || searchTerm === "") {
          card.style.display = "block"
          gsap.to(card, { opacity: 1, scale: 1, duration: 0.3 })
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
    })
  }

  if (categoryLinks.length > 0) {
    categoryLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()

        categoryLinks.forEach((l) => {
          l.classList.remove("active")
          gsap.to(l, { x: 0, duration: 0.3 })
        })

        link.classList.add("active")
        gsap.to(link, { x: 5, duration: 0.3 })

        const category = link.getAttribute("data-category")
        const productGrid = document.querySelector(".product-grid")

        productGrid.classList.add("loading")

        setTimeout(() => {
          productCards.forEach((card, index) => {
            const cardCategory = card.getAttribute("data-category")

            if (category === "all" || cardCategory === category) {
              card.style.display = "block"
              gsap.fromTo(
                card,
                { opacity: 0, y: 30, scale: 0.9 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "back.out(1.7)",
                },
              )
            } else {
              gsap.to(card, {
                opacity: 0,
                y: -20,
                scale: 0.9,
                duration: 0.3,
                onComplete: () => {
                  card.style.display = "none"
                },
              })
            }
          })

          setTimeout(() => {
            productGrid.classList.remove("loading")
          }, 300)
        }, 200)
      })
    })
  }

  const paginationLinks = document.querySelectorAll(".pagination a:not(.next)")
  const nextBtn = document.querySelector(".pagination a.next")

  paginationLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      paginationLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")

      gsap.fromTo(
        productCards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        },
      )

      document.querySelector(".product-listing").scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  })

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault()

      const currentActive = document.querySelector(".pagination a.active")
      const currentPage = Number.parseInt(currentActive.textContent)

      if (currentPage < 3) {
        const nextPage = currentPage + 1
        const nextLink = Array.from(paginationLinks).find((link) => Number.parseInt(link.textContent) === nextPage)

        if (nextLink) {
          nextLink.click()
        }
      }
    })
  }
  sortOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault()
      const sortType = option.getAttribute("data-sort")
      sortProducts(sortType)
    })
  })

  function sortProducts(sortType) {
    const productGrid = document.querySelector(".product-grid")
    const products = Array.from(productCards)

    products.sort((a, b) => {
      switch (sortType) {
        case "price-low":
          return getPrice(a) - getPrice(b)
        case "price-high":
          return getPrice(b) - getPrice(a)
        case "newest":
          return Math.random() - 0.5
        case "popular":
          return getRating(b) - getRating(a)
        default:
          return 0
      }
    })

    products.forEach((product) => {
      productGrid.appendChild(product)
    })

    gsap.from(products, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
    })
  }

  function getPrice(productCard) {
    const priceText = productCard.querySelector(".product-price").textContent
    return Number.parseFloat(priceText.replace(/[^0-9.]/g, ""))
  }

  function getRating(productCard) {
    const ratingText = productCard.querySelector(".product-rating span").textContent
    return Number.parseFloat(ratingText.replace(/[()]/g, ""))
  }
})
