import Link from "next/link";

// 1. Definisikan tipe data agar TypeScript senang
type Court = {
  id: number;
  name: string;
  pricePerHour: number;
};

// 2. Fungsi untuk mengambil data dari Backend Anda
async function getCourts() {
  // Ingat! Backend kita jalan di port 4000
  const res = await fetch("http://localhost:4000/courts", {
    cache: "no-store", // Agar data selalu fresh (tidak dicache)
  });
  
  if (!res.ok) {
    throw new Error("Gagal mengambil data lapangan");
  }
  
  return res.json();
}

export default async function Home() {
  // 3. Panggil fungsi fetch
  const courts: Court[] = await getCourts();

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">DIRO Badminton Hall</h1>
        <p className="text-gray-600">Pilih lapangan favoritmu dan main sekarang!</p>
      </div>

      {/* Grid Card Lapangan */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {courts.map((court) => (
          <div 
            key={court.id} 
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{court.name}</h2>
              <div className="text-sm text-gray-500 mb-4">Fasilitas Lengkap</div>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <p className="text-lg font-bold text-blue-600 mb-4">
                Rp {court.pricePerHour.toLocaleString("id-ID")} <span className="text-sm text-gray-400 font-normal">/ jam</span>
              </p>
              
              {/* Tombol Booking */}
              <button className="w-full bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}