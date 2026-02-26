import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Row: Internal Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-sm">
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-blue-400">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="hover:text-blue-400">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-blue-400">
                  Cookies
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-blue-400">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="/data-policy" className="hover:text-blue-400">
                  Data Policy
                </Link>
              </li>
              <li>
                <Link to="/safe" className="hover:text-blue-400">
                  Safety
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-blue-400">
                  Guidelines
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-blue-400">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/dmca" className="hover:text-blue-400">
                  DMCA Policy
                </Link>
              </li>
              <li>
                <Link to="/earnings-disclaimer" className="hover:text-blue-400">
                  Earnings Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-blue-400">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Artisans</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/artisan-signup" className="hover:text-blue-400">
                  Register as Artisan
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-blue-400">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row: Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Lagos Artisans. All rights
            reserved.
          </p>
          <p className="mt-1">
            Connecting Lagosians with trusted local professionals.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
