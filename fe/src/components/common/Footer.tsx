import Link from "next/link";
import { Car, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-xl font-bold mb-4">
              <Car className="w-6 h-6" />
              <span>AutoDrive</span>
            </div>
            <p className="text-gray-400">
              Dịch vụ cho thuê xe tự lái uy tín, chất lượng hàng đầu Việt Nam
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Dịch Vụ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/cars" className="hover:text-white transition">
                  Thuê xe theo ngày
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-white transition">
                  Thuê xe theo tháng
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-white transition">
                  Thuê xe du lịch
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ Trợ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/policy" className="hover:text-white transition">
                  Chính sách
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>1900 xxxx</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>info@autodrive.vn</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Hà Nội, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AutoDrive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
