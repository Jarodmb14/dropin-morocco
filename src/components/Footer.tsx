import { MapPin, Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <span className="text-sm font-bold text-accent-foreground">D</span>
              </div>
              <span className="text-xl font-bold">Drop-In</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Your gateway to fitness freedom across Morocco. Access premium venues without the commitment.
            </p>
            <div className="flex space-x-3">
              <div className="h-8 w-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 cursor-pointer transition-colors">
                <Instagram className="h-4 w-4" />
              </div>
              <div className="h-8 w-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 cursor-pointer transition-colors">
                <Facebook className="h-4 w-4" />
              </div>
              <div className="h-8 w-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 cursor-pointer transition-colors">
                <Twitter className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Browse Clubs</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Activities</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Support</a></li>
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h4 className="font-semibold mb-4">For Partners</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Become a Partner</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Partner Portal</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Marketing Tools</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Analytics</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Commission Info</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Casablanca, Morocco</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@drop-in.ma</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+212 5XX XXX XXX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>&copy; 2024 Drop-In Morocco. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;