import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiHeadphones,
  FiArrowUp,
  FiMail,
  FiCheck,
  FiArrowRight,
  FiGlobe,
  FiLock,
  FiHeart,
} from 'react-icons/fi'
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaDiscord,
} from 'react-icons/fa'
import {
  FaXTwitter,
  FaCcVisa,
  FaCcMastercard,
  FaCcApplePay,
  FaCcPaypal,
  FaCcAmex,
} from 'react-icons/fa6'
import { useToast } from '../../features/toast/useToast'
import { celebrateAction } from '../../lib/confetti'
import { openCartDrawer } from '../../hooks/useCartDrawer'

const TRUST_PILLARS = [
  {
    icon: FiTruck,
    title: 'Global Express Delivery',
    desc: 'Free shipping on orders over $100 with tracked priority dispatch.',
  },
  {
    icon: FiShield,
    title: '2-Year Full Coverage',
    desc: 'Certified authentic items with comprehensive warranty protection.',
  },
  {
    icon: FiRotateCcw,
    title: '30-Day Hassle-Free Returns',
    desc: 'Instant self-service returns with prepaid shipping labels.',
  },
  {
    icon: FiHeadphones,
    title: '24/7 Expert Concierge',
    desc: 'Dedicated product specialists ready via chat, email, or call.',
  },
]

const FOOTER_NAV = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Featured Collection', href: '/' },
    { label: 'Customer Wishlist', href: '/wishlist' },
    { label: 'Shopping Bag', action: 'openCart' },
    { label: 'Special Offers', href: '/products' },
  ],
  account: [
    { label: 'My Account', href: '/account' },
    { label: 'Order Tracking', href: '/account' },
    { label: 'Saved Wishlist', href: '/wishlist' },
    { label: 'Sign In', href: '/login' },
    { label: 'Create Account', href: '/register' },
  ],
  company: [
    { label: 'About Nexora', href: '/' },
    { label: 'Sustainability & Ethics', href: '/' },
    { label: 'Careers', href: '/', badge: "We're hiring" },
    { label: 'Press & Media', href: '/' },
    { label: 'Partner Program', href: '/' },
  ],
  support: [
    { label: 'Help Center & FAQ', href: '/' },
    { label: 'Shipping & Delivery', href: '/' },
    { label: 'Return Policy', href: '/' },
    { label: 'Privacy Policy', href: '/' },
    { label: 'Terms of Service', href: '/' },
  ],
}

const SOCIAL_LINKS = [
  { icon: FaXTwitter, href: 'https://twitter.com', label: 'X (Twitter)', hoverBg: 'hover:bg-slate-800' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram', hoverBg: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:to-fuchsia-600' },
  { icon: FaGithub, href: 'https://github.com', label: 'GitHub', hoverBg: 'hover:bg-slate-800' },
  { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn', hoverBg: 'hover:bg-[#0A66C2]' },
  { icon: FaDiscord, href: 'https://discord.com', label: 'Discord', hoverBg: 'hover:bg-[#5865F2]' },
]

export default function Footer() {
  const { success, error: toastError } = useToast()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toastError('Please enter a valid email address.')
      return
    }

    setSubscribed(true)
    success('Welcome to Nexora! Check your inbox for your 15% discount code.')
    celebrateAction()
    setEmail('')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative mt-auto border-t border-slate-800 bg-slate-950 text-slate-300 overflow-hidden isolate">
      {/* Background ambient glow effect */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[700px] -translate-x-1/2 rounded-full bg-primary-600/10 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-cyan-500/5 blur-[100px]"
        aria-hidden="true"
      />

      {/* ── 1. PRE-FOOTER: Trust Pillars ── */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-10 lg:py-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <div
                  key={idx}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-5 transition-all duration-300 hover:border-slate-700 hover:bg-slate-850 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-950/80 border border-primary-500/20 text-primary-400 shadow-inner transition-colors duration-300 group-hover:border-primary-500/50 group-hover:bg-primary-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{pillar.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{pillar.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── 2. NEWSLETTER VIP CLUB BANNER ── */}
      <div className="border-b border-slate-800/80 bg-gradient-to-b from-transparent to-slate-900/60">
        <div className="container mx-auto px-4 py-12 lg:py-14">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-primary-950/40 p-8 md:p-12 shadow-2xl">
            <div className="absolute right-0 top-0 -z-10 h-full w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent" />
            
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 px-3.5 py-1 text-xs font-semibold text-primary-300 backdrop-blur">
                  <FiHeart className="h-3.5 w-3.5 text-primary-400" />
                  Nexora Insider Club
                </span>
                <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl tracking-tight">
                  Unlock 15% off your next order
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
                  Join our curated newsletter for private drops, member-only discounts, and seasonal essentials. No spam, ever.
                </p>
              </div>

              <div className="lg:col-span-5">
                {subscribed ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <FiCheck className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-bold text-white">You're on the list!</p>
                      <p className="text-xs text-emerald-400/80">Check your inbox for your 15% promo code.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-2.5">
                    <div className="relative flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                          className="w-full rounded-xl border border-slate-700 bg-slate-850 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 transition focus:border-primary-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-600/20 transition-all hover:bg-primary-500 active:scale-95 shrink-0"
                      >
                        <span>Join Club</span>
                        <FiArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <FiLock className="h-3 w-3 text-slate-500" />
                      We respect your privacy. Unsubscribe anytime in one click.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN NAVIGATION COLUMNS ── */}
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-12 lg:gap-12">
          {/* Brand Identity & Mission */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-2.5 font-display text-2xl font-semibold tracking-tight text-white transition hover:opacity-90">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
                <FiShoppingBag className="h-5 w-5" />
              </span>
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Nexora
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Curated everyday essentials meticulously crafted for modern living. Uncompromising quality, transparent pricing, and instant global delivery.
            </p>

            {/* Live Operational Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>All systems operational · Instant dispatch</span>
            </div>

            {/* Social Icons */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Connect With Us</p>
              <div className="flex flex-wrap items-center gap-2.5">
                {SOCIAL_LINKS.map((soc, idx) => {
                  const Icon = soc.icon
                  return (
                    <a
                      key={idx}
                      href={soc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={soc.label}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 transition-all duration-300 hover:border-slate-700 hover:text-white hover:scale-105 ${soc.hoverBg}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_NAV.shop.map((link, idx) => (
                <li key={idx}>
                  {link.action === 'openCart' ? (
                    <button
                      onClick={openCartDrawer}
                      className="text-slate-400 hover:text-primary-400 transition-colors duration-200 text-left"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      to={link.href!}
                      className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_NAV.account.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_NAV.company.map((link, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                  {link.badge && (
                    <span className="rounded-full bg-primary-500/10 border border-primary-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-primary-300">
                      {link.badge}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_NAV.support.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── 4. BOTTOM COPYRIGHT & TRUST BAR ── */}
      <div className="border-t border-slate-800/80 bg-slate-950/90 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Copyright & Region */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6 text-center sm:text-left text-xs text-slate-500">
              <p>© {new Date().getFullYear()} Nexora Global, Inc. All rights reserved.</p>
              <div className="flex items-center gap-1.5 text-slate-400">
                <FiGlobe className="h-3.5 w-3.5 text-slate-400" />
                <span>United States (USD $) · English</span>
              </div>
            </div>

            {/* Payment Method Badges */}
            <div className="flex items-center gap-3 text-slate-400">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider hidden sm:inline">Secure Payment:</span>
              <div className="flex items-center gap-2">
                <span className="flex h-7 px-2 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-300" title="Visa">
                  <FaCcVisa className="h-4 w-4" />
                </span>
                <span className="flex h-7 px-2 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-300" title="Mastercard">
                  <FaCcMastercard className="h-4 w-4" />
                </span>
                <span className="flex h-7 px-2 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-300" title="Apple Pay">
                  <FaCcApplePay className="h-4 w-4" />
                </span>
                <span className="flex h-7 px-2 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-300" title="PayPal">
                  <FaCcPaypal className="h-4 w-4" />
                </span>
                <span className="flex h-7 px-2 items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-slate-300" title="American Express">
                  <FaCcAmex className="h-4 w-4" />
                </span>
              </div>
            </div>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white active:scale-95"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <FiArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
