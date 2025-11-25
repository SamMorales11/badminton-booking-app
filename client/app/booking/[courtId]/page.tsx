"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Import Icons
import { Calendar, Clock, User, CheckCircle, ChevronLeft, Loader2 } from "lucide-react";

export default function BookingPage({ params }: { params: Promise<{ courtId: string }> }) {
  const router = useRouter();
  const { courtId } = use(params);

  const [date, setDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // State baru untuk feedback sukses

  useEffect(() => {
    if (date) {
      setAvailableSlots([]); // Clear dulu biar ga flicker
      fetch(`http://localhost:4000/bookings/check?courtId=${courtId}&date=${date}`)
        .then((res) => res.json())
        .then((data) => {
          setAvailableSlots(data);
          setSelectedSlot(null);
        });
    }
  }, [date, courtId]);

  const handleBooking = async () => {
    if (!date || selectedSlot === null || !name) return;

    setLoading(true);
    const res = await fetch("http://localhost:4000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courtId: parseInt(courtId),
        date: date,
        startTime: selectedSlot,
        name: name,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setIsSuccess(true); // Tampilkan UI Sukses
    } else {
      alert("Gagal booking, slot mungkin sudah diambil.");
    }
  };

  // --- TAMPILAN SUKSES (PENGGANTI ALERT) ---
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Berhasil!</h2>
          <p className="text-gray-500 mb-8">
            Terima kasih {name}, lapangan {courtId} sudah diamankan untuk Anda pada jam {selectedSlot}:00.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Tombol Back */}
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-slate-900 mb-6 transition-colors">
          <ChevronLeft size={20} /> Kembali
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* --- KOLOM KIRI: FORM --- */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                Booking Lapangan {courtId}
              </h1>

              {/* Input Tanggal */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} /> Pilih Tanggal Main
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* Input Jam */}
              {date && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock size={16} /> Pilih Slot Waktu
                  </label>
                  
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 px-2 rounded-lg text-sm font-semibold transition-all border ${
                            selectedSlot === slot
                              ? "bg-slate-900 text-white border-slate-900 shadow-md transform scale-105"
                              : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          {slot}:00
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                      Yah, penuh semua :( Coba tanggal lain.
                    </div>
                  )}
                </div>
              )}

              {/* Input Nama */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User size={16} /> Nama Pemesan
                </label>
                <input
                  type="text"
                  placeholder="Nama Lengkap Anda"
                  className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* --- KOLOM KANAN: RINGKASAN (STICKY) --- */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Ringkasan</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Lapangan</span>
                  <span className="font-semibold text-slate-900">Court {courtId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal</span>
                  <span className="font-semibold text-slate-900">{date || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jam</span>
                  <span className="font-semibold text-slate-900">
                    {selectedSlot ? `${selectedSlot}:00 - ${selectedSlot + 1}:00` : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-dashed">
                  <span className="text-gray-500">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    {/* Disini Anda bisa ambil harga dari backend nanti, sementara hardcode visual */}
                    Rp --
                  </span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={loading || !date || !selectedSlot || !name}
                className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Memproses..." : "Konfirmasi Booking"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}