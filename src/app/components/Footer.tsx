import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Linkedin, } from 'lucide-react'

const TikTok = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
    <path d="M22.5 7.5c1.2 1.7 2.9 2.7 4.8 2.8v4.1c-2.2-.1-4.3-.8-6-2v8.7c0 4.2-3.4 7.6-7.6 7.6S6 25.3 6 21.1c0-4.2 3.4-7.6 7.6-7.6.3 0 .6 0 .9.1v4.1c-.3-.1-.6-.1-.9-.1-2 0-3.6 1.6-3.6 3.6s1.6 3.6 3.6 3.6 3.6-1.6 3.6-3.6V2.5h4.3v5z"/>
  </svg>
)

export function Footer() {

  return (
    <footer id="contact" className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="mb-12">
            {/* LSAC info */}
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="hidden"></div>
                <div>
                  <img src="/images/logos/logo_w.png" alt="LSAC Ia?i" className="h-10 w-auto" loading="lazy" decoding="async" />
                  <p className="text-gray-300">Liga Studenților Facultății de Automatică și Calculatoare</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                Organizația studențească care conectează, inspiră și dezvoltă viitorii profesioniști IT 
                din Iași. Împreună construim comunitatea tehnologică de mâine.
              </p>

              {/* Contact info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">Universitatea Tehnică "Gh. Asachi", Bd. Mangeron 27, Iași</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">+40 771 644 679</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">lsaciasi@gmail.com</span>
                </div>
              </div>
            </div>

          </div>

          {/* Social media and bottom bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <span className="text-gray-300">Urmărește-ne pe:</span>
                <div className="flex space-x-4">
                  <a
                    href="https://www.facebook.com/lsac.is?locale=ro_RO" target="_blank"
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/lsaciasi" target="_blank"
                    className="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/lsaciasi/"
                    target="_blank"
                    className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.youtube.com/@LSACIasi/featured" target="_blank"
                    className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@lsaciasi"
                    target="_blank"
                    className="w-10 h-10 bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                  <TikTok className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="text-center md:text-right">
                <p className="text-gray-300 text-sm">
                  © {new Date().getFullYear()} LSAC Iași. Toate drepturile rezervate.
                </p>
                <div className="flex flex-wrap justify-center md:justify-end space-x-4 mt-2 text-sm">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Politica de confidențialitate
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Termeni și condiții
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Cod de conduită
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </footer>
  )
}
