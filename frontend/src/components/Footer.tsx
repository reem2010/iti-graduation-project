import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="grid md:grid-cols-3 gap-8 justify-center"> */}
          <div className="space-y-2">
            <div className="flex justify-center items-center">
              <div className="w-15 h-15 rounded-lg flex items-center justify-center">
                <Image
                  src={"/siraj_logo.svg"}
                  alt="Logo"
                  width={52}
                  height={52}
                  className="rounded-lg"
                />
              </div>
              <span className="text-2xl font-bold">SIRAJ</span>
            </div>
            <p className="text-gray-400 text-center">
              Empowering mental wellness through professional,
              culturally-sensitive care.
            </p>
          </div>

          {/* <div className="space-y-4">
            <h4 className="text-lg font-semibold">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/doctor"
                  className="hover:text-white transition-colors"
                >
                  Individual Therapy
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="hover:text-white transition-colors"
                >
                  Therapist Blogs
                </Link>
              </li>
            </ul>
          </div> */}

          {/* <div className="space-y-4">
            <h4 className="text-lg font-semibold">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Mental Health Blogs
                </a>
              </li>
            </ul>
          </div> */}

          {/* <div className="space-y-4">
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
          </div> */}
        {/* </div> */}

        <div className="mt-2 text-center text-gray-400">
          <p>&copy; 2024 Siraj Mental Health Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
