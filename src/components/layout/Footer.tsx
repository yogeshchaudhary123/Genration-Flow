import Link from "next/link";
import { Bot, ArrowRight } from "lucide-react";

const TwitterIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-black/5 dark:bg-black/50 border-t border-black/10 dark:border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-brand-purple/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white font-bold">
                <Bot size={20} />
              </div>
              <span className="font-bold text-2xl tracking-tight">
                Generation<span className="text-gradient">Flow</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              The future of eCommerce is here. Discover, compare, and shop with the power of artificial intelligence.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground dark:hover:text-white">
                <TwitterIcon size={20} />
              </a>
              <a href="#" className="p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground dark:hover:text-white">
                <InstagramIcon size={20} />
              </a>
              <a href="#" className="p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground dark:hover:text-white">
                <GithubIcon size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/products?category=tech" className="text-muted-foreground hover:text-brand-purple transition-colors">Tech & Gadgets</Link></li>
              <li><Link href="/products?category=wearables" className="text-muted-foreground hover:text-brand-purple transition-colors">Wearables</Link></li>
              <li><Link href="/products?category=audio" className="text-muted-foreground hover:text-brand-purple transition-colors">Audio</Link></li>
              <li><Link href="/products" className="text-muted-foreground hover:text-brand-purple transition-colors flex items-center gap-1">All Products <ArrowRight size={14} /></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-brand-purple transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-brand-purple transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-brand-purple transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-brand-purple transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-brand-purple transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-brand-purple transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-brand-purple transition-colors">Shipping Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-brand-purple transition-colors">Refunds</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Generation Flow. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Designed with AI</span>
            <span>Made for Gen-Z</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
