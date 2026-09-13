# 📋 Project Overview

**Project Name:** Mini E-commerce Store  
**Technology Stack:** React + Vite  
**API:** FakeStore API (https://fakestoreapi.com)  
**Pages:** 4 Main Pages  
**Target:** Fully functional mini online store with product browsing and cart management

---

## 🎯 Core Features

### 1. Home Page (/)
- Hero section with welcome message and call-to-action
- Featured products section (display 4-6 products)
- Categories overview with navigation to products page
- Modern, attractive design with animations

### 2. Products Page (/products)
- Display all products from FakeStore API
- Filter by category (electronics, jewelery, men's clothing, women's clothing)
- Search functionality to find products by name
- Product grid layout (responsive: 1 col mobile, 2-3 cols tablet, 4 cols desktop)
- Loading state while fetching data
- Each product card shows:
  - Product image
  - Product title
  - Price
  - Rating
  - "Add to Cart" button
  - "View Details" button

### 3. Product Details Page (/product/:id)
- Full product information:
  - Large product image
  - Product title
  - Full description
  - Price
  - Rating and review count
  - Category
  - Quantity selector
  - "Add to Cart" button
  - "Back to Products" navigation
- Related products section (same category)

### 4. Cart Page (/cart)
- List of all items in cart
- For each item show:
  - Product image (thumbnail)
  - Product name
  - Price per unit
  - Quantity controls (+/-)
  - Subtotal
  - Remove button
- Cart summary:
  - Total items count
  - Subtotal
  - Tax (optional)
  - Total price
  - "Continue Shopping" button
  - "Checkout" button (can show success message for MVP)
- Empty cart state with message and link to products

---

## 🏗️ Technical Architecture

### Folder Structure
```
mini-ecommerce/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/          # Images, icons, fonts
│   ├── app/             # App shell, routes, and entry point
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── components/      # Shared UI grouped by responsibility
│   │   ├── catalog/     # Product catalog UI
│   │   ├── common/      # Loader and animation primitives
│   │   └── layout/      # Navbar and Footer
│   ├── features/cart/   # Cart context and cart hook
│   ├── pages/           # Route-level TSX pages
│   ├── services/        # Typed API client
│   ├── types/           # Shared TypeScript domain types
│   ├── utils/           # Small cross-feature helpers
│   └── styles/          # Global CSS
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

### State Management
- React Context API for cart management
- Local Storage to persist cart data
- useState/useEffect for component-level state

### Routing
- React Router DOM v6 for navigation
- Routes:
  - `/` → Home
  - `/products` → Products
  - `/product/:id` → Product Details
  - `/cart` → Cart

### API Integration (Simplified for Beginners)
**FakeStore API Endpoints:**
- `GET https://fakestoreapi.com/products` - All products
- `GET https://fakestoreapi.com/products/:id` - Single product (replace :id with number like 1, 2, 3...)
- `GET https://fakestoreapi.com/products/categories` - All categories
- `GET https://fakestoreapi.com/products/category/:category` - Products by category

**Simple API Usage Example:**
```javascript
// In your component, just use fetch like this:
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {
      setProducts(data);
      setLoading(false);
    })
    .catch(error => {
      console.log('Error:', error);
      setLoading(false);
    });
}, []);
```

---

## 🎨 Design Requirements

### Color Scheme
- **Primary:** Purple gradient (#8b5cf6 to #7c3aed) - configured in Tailwind
- **Secondary:** Complementary accent colors from Tailwind palette
- **Background:** Clean white/light gray (Tailwind gray-50, gray-100)
- **Text:** Dark gray for readability (Tailwind gray-900, gray-700)
- **Accents:** Success green (Tailwind green), error red (Tailwind red)

### Typography
- **Font Family:** Inter (Google Fonts) - configured in Tailwind
- **Headings:** Bold, larger sizes using Tailwind text utilities
- **Body:** Regular weight, readable size (16px base)

### UI/UX Principles
- **Responsive Design:** Mobile-first approach with Tailwind breakpoints (sm, md, lg, xl)
- **Smooth Animations:** Hover effects using Tailwind transition utilities
- **Loading States:** Skeleton loaders or spinners
- **Error Handling:** User-friendly error messages
- **Accessibility:** Semantic HTML, ARIA labels

### Key Visual Elements
- Glassmorphism effects using Tailwind backdrop-blur and bg-opacity
- Smooth hover animations with Tailwind transition classes
- Gradient backgrounds using Tailwind gradient utilities
- Modern button styles with Tailwind shadow utilities
- Clean, spacious layout with Tailwind spacing scale

---

## 📦 Dependencies

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0"
}
```

### Styling
```json
{
  "tailwindcss": "^3.x",
  "postcss": "^8.x",
  "autoprefixer": "^10.x"
}
```

### Optional Enhancements
- **Icons:** react-icons or lucide-react
- **Notifications:** react-hot-toast or react-toastify
- **Animations:** framer-motion (optional)

---

## 🔄 User Flows

### Flow 1: Browse and Add to Cart
1. User lands on Home page
2. Clicks "Shop Now" or navigates to Products
3. Browses products, uses filters/search
4. Clicks on product to view details
5. Selects quantity and adds to cart
6. Sees success notification
7. Cart icon updates with item count

### Flow 2: Manage Cart
1. User clicks cart icon in navbar
2. Views all cart items
3. Can update quantities (+/-)
4. Can remove items
5. Sees updated totals in real-time
6. Clicks "Checkout" (shows success message for MVP)

### Flow 3: Category Filtering
1. User on Products page
2. Selects category from filter
3. Products list updates to show only selected category
4. Can clear filter to see all products

---

## ✅ MVP Checklist

### Phase 1: Setup & Foundation
- [ ] Initialize Vite + React project
- [ ] Install dependencies (React Router, icons library)
- [ ] Setup folder structure
- [ ] Create basic routing structure
- [ ] Setup CSS variables and global styles

### Phase 2: Core Components
- [ ] Navbar with cart icon and counter
- [ ] Footer
- [ ] ProductCard component
- [ ] Loader component
- [ ] Hero section

### Phase 3: Context & API
- [ ] Create CartContext with add/remove/update functions
- [ ] Implement local storage persistence
- [ ] Create API utility functions
- [ ] Create useFetch custom hook

### Phase 4: Pages Implementation
- [ ] Home page with hero and featured products
- [ ] Products page with filtering and search
- [ ] Product Details page
- [ ] Cart page with full functionality

### Phase 5: Polish & Styling
- [ ] Add animations and transitions
- [ ] Implement responsive design

---

## 🚀 Implementation Plan

### Step 1: Project Initialization
```bash
npm create vite@latest mini-ecommerce -- --template react
cd mini-ecommerce
npm install
npm install react-router-dom react-icons
```

### Step 2: Create Folder Structure
Create all folders and placeholder files as per structure above.

### Step 3: Setup Routing
Configure React Router in App.jsx with all routes.

### Step 4: Build Cart Context
Implement CartContext with:
- `cart` state (array of items)
- `addToCart(product, quantity)`
- `removeFromCart(productId)`
- `updateQuantity(productId, newQuantity)`
- `clearCart()`
- `getCartTotal()`
- `getCartItemsCount()`

### Step 5: API Integration (Simple Approach)
No need for complex utilities! Just use `fetch()` directly in your components with `useState` and `useEffect`. See the API Integration section above for examples.

### Step 6: Build Components
Start with reusable components, then pages.

### Step 7: Styling
Apply modern CSS with gradients, animations, and responsive design.

### Step 8: Testing & Refinement
Test all features, fix bugs, optimize performance.

---

## 🎯 Success Criteria

- ✅ All 4 pages functional and navigable
- ✅ Products load from FakeStore API
- ✅ Cart persists across page refreshes
- ✅ Filtering and search work correctly
- ✅ Responsive on mobile, tablet, desktop
- ✅ Modern, attractive design
- ✅ Smooth user experience with no major bugs

---

## 🔮 Future Enhancements (Post-MVP)

- User authentication
- Wishlist functionality
- Product reviews and ratings
- Checkout with payment integration
- Order history
- Admin panel for product management
- Advanced filtering (price range, ratings)
- Product comparison feature
- Dark mode toggle

---

## 📝 Notes

- FakeStore API is free and doesn't require authentication
- API returns 20 products total across 4 categories
- For MVP, checkout will just show a success message (no real payment)
- Focus on clean code and component reusability
- Use semantic HTML for better SEO and accessibility

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-26  
**Status:** Ready for Implementation 🚀
