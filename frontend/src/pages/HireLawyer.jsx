import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Calendar,
  Scale,
  Search,
  Filter,
  Clock,
  X,
  Check,
  FileText,
  Bookmark,
  CalendarDays,
  BadgeAlert,
  BadgeCheck,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function HireLawyer() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Modal / Booking State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [attachDocument, setAttachDocument] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);

  // Persistence State
  const [activeBookings, setActiveBookings] = useState([]);

  // Load existing bookings from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nyayavanni_consultations");
      if (stored) setActiveBookings(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load consultations", e);
    }
  }, []);

  // Mock Data for Lawyers
  const mockLawyers = useMemo(
    () => [
      {
        id: 1,
        name: "Adv. Rahul Sharma",
        specialty: "Real Estate & Property",
        experience: "15 Years",
        location: "New Delhi, Delhi",
        fee: "₹2,000/Consultation",
        image:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256",
      },
      {
        id: 2,
        name: "Adv. Priya Desai",
        specialty: "Family Law & Divorce",
        experience: "12 Years",
        location: "Mumbai, Maharashtra",
        fee: "₹2,500/Consultation",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256",
      },
      {
        id: 3,
        name: "Adv. Vikram Singh",
        specialty: "Corporate & Business",
        experience: "20 Years",
        location: "Bengaluru, Karnataka",
        fee: "₹5,000/Consultation",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256",
      },
      {
        id: 4,
        name: "Adv. Neha Gupta",
        specialty: "Criminal Defense",
        experience: "8 Years",
        location: "Pune, Maharashtra",
        fee: "₹1,500/Consultation",
        image:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256",
      },
      {
        id: 5,
        name: "Adv. Anil Kumar",
        specialty: "Civil Litigation",
        experience: "18 Years",
        location: "Chennai, Tamil Nadu",
        fee: "₹3,000/Consultation",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256",
      },
      {
        id: 6,
        name: "Adv. Meera Reddy",
        specialty: "Intellectual Property",
        experience: "10 Years",
        location: "Hyderabad, Telangana",
        fee: "₹4,000/Consultation",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256",
      },
    ],
    []
  );

  const categories = useMemo(
    () => [
      "All",
      "Real Estate & Property",
      "Family Law & Divorce",
      "Corporate & Business",
      "Criminal Defense",
      "Civil Litigation",
      "Intellectual Property",
    ],
    []
  );

  const datesList = useMemo(() => {
    const dates = [];
    const locale = "en-US";

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      // Build a local yyyy-MM-dd string to avoid UTC timezone shifts when parsing later
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // 1-based month
      const dayNum = String(d.getDate()).padStart(2, '0');
      const fullDate = `${year}-${month}-${dayNum}`;

      dates.push({
        fullDate,
        dayName: d.toLocaleDateString(locale, { weekday: "short" }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString(locale, { month: "short" }),
      });
    }

    return dates;
  }, []);

  const timeSlots = useMemo(
    () => [
      "09:30 AM",
      "11:00 AM",
      "01:30 PM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM",
    ],
    []
  );

  // Filter logic
  const filteredLawyers = useMemo(() => {
    return mockLawyers.filter((lawyer) => {
      const s = searchTerm.toLowerCase();

      const matchesSearch =
        lawyer.name.toLowerCase().includes(s) ||
        lawyer.specialty.toLowerCase().includes(s) ||
        lawyer.location.toLowerCase().includes(s);

      const matchesFilter =
        filterType === "All" || lawyer.specialty === filterType;

      return matchesSearch && matchesFilter;
    });
  }, [mockLawyers, searchTerm, filterType]);

  const handleOpenBooking = (lawyer) => {
    setSelectedLawyer(lawyer);
    setSelectedDate(datesList[0]?.fullDate || "");
    setSelectedTime(timeSlots[0] || "");
    setCaseDescription("");
    setAttachDocument(false);
    setBookingComplete(false);
    setCurrentTicket(null);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!selectedLawyer || !selectedDate || !selectedTime) return;

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const meetingCode = `NV-${randomId}-${selectedLawyer.name
      .split(" ")
      .pop()
      .toUpperCase()}`;

    // Parse the stored yyyy-MM-dd as local date parts to avoid UTC parsing issues
    const [y, m, d] = selectedDate.split('-').map(Number); // m is 1-12
    const localDateObj = new Date(y, m - 1, d); // monthIndex is 0-based
    const formattedDate = localDateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const newBooking = {
      id: Date.now(),
      meetingCode,
      lawyer: selectedLawyer,
      date: formattedDate,
      rawDate: selectedDate,
      time: selectedTime,
      description: caseDescription,
      attachedContext: attachDocument ? "NyayaVanni_Extracted_Context.pdf" : null,
      bookedAt: new Date().toLocaleDateString(),
    };

    const updatedBookings = [newBooking, ...activeBookings];
    setActiveBookings(updatedBookings);
    localStorage.setItem("nyayavanni_consultations", JSON.stringify(updatedBookings));

    setCurrentTicket(newBooking);
    setBookingComplete(true);
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this consultation booking?")) {
      const next = activeBookings.filter((b) => b.id !== bookingId);
      setActiveBookings(next);
      localStorage.setItem("nyayavanni_consultations", JSON.stringify(next));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 text-slate-100 pb-16">
      <main className="max-w-7xl mx-auto px-6 pt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredLawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="group relative rounded-[2rem] border border-white/10 bg-slate-900/65 backdrop-blur-xl p-6
                         shadow-[0_0_30px_rgba(0,0,0,0.25)]
                         transition-all duration-500
                         hover:-translate-y-2 hover:border-nyaya-500/40 hover:shadow-[0_0_45px_rgba(37,99,235,0.22)]"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-white/10 group-hover:ring-nyaya-500/40 transition">
                  <img
                    src={lawyer.image}
                    alt={lawyer.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-white truncate group-hover:text-nyaya-300 transition-colors">
                    {lawyer.name}
                  </h3>

                  {/* Updated spacing after rating removal */}
                  <p className="text-sm font-medium text-nyaya-300/90 mt-2">
                    {lawyer.specialty}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{lawyer.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>{lawyer.experience} Experience</span>
                </div>

                <div className="pt-3 mt-3 border-t border-white/10 text-slate-100 font-semibold">
                  {lawyer.fee}
                </div>
              </div>

              <button
                onClick={() => handleOpenBooking(lawyer)}
                className="mt-6 w-full rounded-2xl py-3.5 px-4 font-semibold text-white
                           bg-gradient-to-r from-nyaya-500 to-blue-600
                           shadow-[0_0_25px_rgba(37,99,235,0.22)]
                           transition-all duration-300
                           hover:scale-[1.02] active:scale-[0.99]
                           flex items-center justify-center gap-2"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t("lawyers.book")}
                </span>
              </button>

              <p className="mt-3 text-xs text-slate-500">
                Informational directory only (BCI compliant).
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}