import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">Siraj</span>
            </div>
            <p className="text-gray-400">
              Empowering mental wellness through professional,
              culturally-sensitive care.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Individual Therapy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Group Therapy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Crisis Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Wellness Coaching
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Mental Health Articles
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Self-Help Tools
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Support Groups
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Crisis Resources
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Siraj Mental Health Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
