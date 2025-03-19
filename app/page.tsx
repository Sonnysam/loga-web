import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Calendar } from "lucide-react";
import { DonateSheet } from "@/components/DonateSheet";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <Image src="/loga.png" alt="LOGA Logo" width={60} height={60} className="w-full h-full" />
            </div>
            <span className="text-xl font-bold text-[#2E008F]/60">LOGA Alumni Portal</span>
          </Link>
          <div className="space-x-2 md:space-x-4">
            <DonateSheet />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Clean hero section with subtle background */}
        <section className="relative py-16 md:py-32 bg-gradient-to-b from-white to-purple-50">
          {/* Subtle background elements */}
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#2E008F]/5"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-50/50 to-transparent"></div>
          </div>

          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
                Welcome to the{" "}
                <span className="text-[#2E008F]">LOGA Alumni Network</span>
              </h2>
              <p className="text-xl text-gray-600">
                Connect with fellow alumnae, access exclusive opportunities, and stay updated with your alma mater.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-[#2E008F] text-white hover:bg-[#2E008F]/90 w-full sm:w-auto">
                    Join the Network
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#2E008F] text-[#2E008F] hover:bg-[#2E008F]/5">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features cards section - clean and minimal */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="p-2 bg-[#2E008F]/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-[#2E008F]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#2E008F]">Network</h3>
                <p className="text-gray-600">
                  Connect with accomplished LOGA alumnae across various professional fields.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="p-2 bg-[#2E008F]/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6 text-[#2E008F]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#2E008F]">Grow</h3>
                <p className="text-gray-600">
                  Access career opportunities and professional development resources.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="p-2 bg-[#2E008F]/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6 text-[#2E008F]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#2E008F]">Engage</h3>
                <p className="text-gray-600">
                  Participate in exclusive events and give back to your alma mater.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean, modern footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image src="/loga.png" alt="LOGA Logo" width={60} height={60} className="w-8 h-8 object-contain" />
              <span className="text-sm font-medium text-gray-700">LOGA Alumni Portal</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-[#2E008F]">Privacy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-[#2E008F]">Terms</a>
              <a href="#" className="text-sm text-gray-500 hover:text-[#2E008F]">Contact</a>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-6">
            <p>© {new Date().getFullYear()} LOGA Alumni Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}