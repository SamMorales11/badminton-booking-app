import Link from "next/link";
import { MapPin, ArrowRight, Zap, Trophy, Shield } from "lucide-react"; // Import Icon biar keren

type Court = {
  id: number;
  name: string;
  pricePerHour: number;
};

// Fungsi ambil data dari Backend
async function getCourts() {
  const res = await fetch("http://localhost:4000/courts", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal mengambil data lapangan");
  return res.json();
}

export default async function Home() {
  const courts: Court[] = await getCourts();

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      {/* --- HERO SECTION (BANNER ATAS) --- */}
      {/* Background gelap dengan gradient biar modern */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            DIRO <span className="text-blue-400">Badminton</span> Hall
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Pro Badminton Court: Vinyl Flooring, Glare-Free Lighting. Book Now, Play Today!
          </p>
          
          {/* Feature Badge (Icon kecil-kecil di bawah teks) */}
          <div className="flex justify-center gap-4 text-sm font-medium text-slate-400 flex-wrap">
            <span className="flex items-center gap-1 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
              <Zap size={16} className="text-yellow-400"/> LED Court Lighting
            </span>
            <span className="flex items-center gap-1 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
              <Trophy size={16} className="text-yellow-400"/> BWF Standard
            </span>
            <span className="flex items-center gap-1 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
              <Shield size={16} className="text-yellow-400"/> Secure Locker
            </span>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION (DAFTAR LAPANGAN) --- */}
      <div className="max-w-6xl mx-auto px-6 py-16 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courts.map((court) => (
            <div 
              key={court.id} 
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 group"
            >
              {/* Card Header (Placeholder Image effect dengan Icon Trophy besar) */}
              <div className="h-40 bg-blue-50 flex items-center justify-center relative overflow-hidden">
                {/* Efek glow bulat di background */}
                <div className="absolute w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-60"></div>
                <Trophy size={64} className="text-blue-200 group-hover:scale-110 transition-transform duration-500 relative z-10" />
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {court.name}
                  </h2>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-6">
                  <MapPin size={14} className="mr-1 text-red-500" />
                  <span>Lantai 1, Wing A</span>
                </div>

                {/* Footer Card (Harga & Tombol) */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Harga Sewa</p>
                      <p className="text-2xl font-bold text-slate-900">
                        Rp {court.pricePerHour.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 mb-1 font-medium bg-gray-100 px-2 py-1 rounded">/ Jam</span>
                  </div>
                  
                  {/* Tombol Book Now dengan Link */}
                  <Link href={`/booking/${court.id}`} className="block w-full">
                    <button className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 group-hover:gap-3 shadow-lg hover:shadow-blue-500/30">
                      Book Now <ArrowRight size={18} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}