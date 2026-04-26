import { Link } from "react-router-dom";
import { Truck, Shield, RotateCcw, Award } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-espresso text-primary-foreground">
    {/* Trust badges */}
    <div className="border-b border-primary/20">
      <div className="container py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Truck, title: "FREE SHIPPING", desc: "On all orders over $100" },
          { icon: Shield, title: "SECURE PAYMENT", desc: "100% Protected" },
          { icon: RotateCcw, title: "30-DAY RETURNS", desc: "Easy Returns" },
          { icon: Award, title: "2 YEARS WARRANTY", desc: "Worldwide Guarantee" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon className="w-8 h-8 text-gold-light flex-shrink-0" />
            <div>
              <p className="text-xs font-body font-semibold tracking-wider">{title}</p>
              <p className="text-xs text-primary-foreground/60">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="container py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
      <div className="col-span-2 md:col-span-1">
        <img src={logo} alt="ChronoLux" className="h-8 w-auto mb-4 brightness-0 invert" />
        <p className="text-sm text-primary-foreground/60 leading-relaxed">
          We bring you the finest collection of luxury watches and accessories.
        </p>
      </div>
      {[
        { title: "SHOP", links: ["All Watches", "Men Watches", "Women Watches", "Accessories"] },
        { title: "CUSTOMER SERVICE", links: ["Contact Us", "Shipping & Delivery", "Returns", "FAQ"] },
        { title: "INFORMATION", links: ["About Us", "Terms & Conditions", "Privacy Policy", "Warranty"] },
      ].map((section) => (
        <div key={section.title}>
          <h4 className="text-xs font-body font-semibold tracking-widest mb-4">{section.title}</h4>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={link}>
                <Link to="/shop" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div>
        <h4 className="text-xs font-body font-semibold tracking-widest mb-4">FOLLOW US</h4>
        <div className="flex gap-3">
          {["Instagram", "Facebook", "Pinterest"].map((s) => (
            <a key={s} href="#" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              {s.charAt(0)}
            </a>
          ))}
        </div>
      </div>
    </div>

    <div className="border-t border-primary/20">
      <div className="container py-6 text-center text-xs text-primary-foreground/40">
        © 2024 ChronoLux. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
