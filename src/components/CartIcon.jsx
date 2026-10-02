import { useEffect, useState } from "react";

const CART_KEY = "vwDomainCart";

function readCartCount() {
  try {
    const raw = sessionStorage.getItem(CART_KEY);
    if (!raw) return 0;
    const saved = JSON.parse(raw);
    return Array.isArray(saved?.cart) ? saved.cart.length : 0;
  } catch {
    return 0;
  }
}

export default function CartIcon({ className = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(readCartCount());
  }, []);

  return (
    <a href="/checkout" aria-label="View cart" className={`relative inline-flex items-center ${className}`}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 min-w-[16px] rounded-full bg-primary px-1 text-center text-[10px] font-semibold leading-4 text-primary-foreground">
          {count}
        </span>
      )}
    </a>
  );
}
