"use client";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  User,
  Menu,
  Calendar,
  ChevronDown,
  LogOut,
  Plus,
  X,
} from "lucide-react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Header({
  title,
  subtitle,
  selectedDate,
  onDateChange,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [open, setOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { data: session } = useSession();
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Use props for date if provided, otherwise use local state
  const [localSelectedDate, setLocalSelectedDate] = useState(new Date());
  const currentSelectedDate = selectedDate || localSelectedDate;

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Search:", searchQuery);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleDateChange = (date) => {
    if (onDateChange) {
      onDateChange(date);
    } else {
      setLocalSelectedDate(date);
    }
  };

  const handleProfileClick = () => {
    // Handle profile click
    console.log("Profile clicked");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarSmall = session?.user?.image ? (
    <div className="relative w-10 sm:w-9 lg:w-10 h-10 sm:h-9 lg:h-10">
      <Image
        src={session.user.image}
        alt="User"
        fill
        className="object-cover rounded-full"
      />
    </div>
  ) : (
    <span className="bg-blue-500 text-white font-bold w-10 sm:w-9 lg:w-10 h-10 sm:h-9 lg:h-10 rounded-full flex items-center justify-center text-base sm:text-xl lg:text-2xl">
      {(session?.user?.name || "Guest").charAt(0)}
    </span>
  );

  const avatarLarge = session?.user?.image ? (
    <div className="relative w-20 sm:w-15 lg:w-20 h-20 sm:h-15 lg:h-20">
      <Image
        src={session.user.image}
        alt="User"
        fill
        className="object-cover rounded-full"
      />
    </div>
  ) : (
    <span className="bg-blue-500 text-white font-bold w-20 sm:w-15 lg:w-20 h-20 sm:h-15 lg:h-20 rounded-full flex items-center justify-center text-2xl">
      {(session?.user?.name || "Guest").charAt(0)}
    </span>
  );

  const user = {
    name: session?.user?.name || "Guest",
    email: session?.user?.email || "guest@example.com",
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-600 text-xs sm:text-sm mt-1 truncate hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            {/* Desktop Calendar */}
            <div className="relative hidden lg:block">
              <DatePicker
                selected={currentSelectedDate}
                onChange={handleDateChange}
                locale={id}
                customInput={
                  <button className="flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-full shadow bg-white border border-gray-200 hover:bg-gray-50 transition">
                    <div className="bg-teal-100 p-1.5 rounded-md">
                      <Calendar className="text-teal-600 w-5 h-5 xl:w-6 xl:h-6" />
                    </div>
                    <span className="text-xs xl:text-sm font-medium text-gray-800 text-left hidden xl:block">
                      {format(currentSelectedDate, "dd MMMM yyyy", {
                        locale: id,
                      })}
                    </span>
                    <span className="text-xs font-medium text-gray-800 text-left xl:hidden">
                      {format(currentSelectedDate, "dd MMM", { locale: id })}
                    </span>
                    <svg
                      className="w-3 h-3 xl:w-4 xl:h-4 text-gray-500 ml-auto"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                }
                popperPlacement="bottom-start"
                popperModifiers={[
                  {
                    name: "offset",
                    options: {
                      offset: [0, 10],
                    },
                  },
                ]}
                dateFormat="dd MMMM yyyy"
              />
            </div>

            {/* Mobile Calendar */}
            <div className="relative lg:hidden">
              <DatePicker
                selected={currentSelectedDate}
                onChange={handleDateChange}
                locale={id}
                customInput={
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Calendar size={20} />
                  </button>
                }
                popperPlacement="bottom-end"
                popperModifiers={[
                  {
                    name: "offset",
                    options: {
                      offset: [0, 10],
                    },
                  },
                ]}
                dateFormat="dd MMMM yyyy"
              />
            </div>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari makanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-48 lg:w-64 xl:w-72 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
              />
            </form>

            {/* Mobile Search Button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 md:hidden"
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 relative"
              >
                <Bell size={20} />
                {/* Notification Badge */}
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 sm:p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                      Notifikasi
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {/* Sample notifications */}
                    <div className="p-3 sm:p-4 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-xs sm:text-sm text-gray-800">
                        Target kalori hari ini hampir tercapai!
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        2 jam yang lalu
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-xs sm:text-sm text-gray-800">
                        Jangan lupa sarapan sehat!
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        1 hari yang lalu
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 hover:bg-gray-50">
                      <p className="text-xs sm:text-sm text-gray-800">
                        Laporan mingguan sudah tersedia
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        2 hari yang lalu
                      </p>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 border-t border-gray-100">
                    <button className="text-xs sm:text-sm text-teal-600 hover:text-teal-700">
                      Lihat semua notifikasi
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative inline-block text-left" ref={dropdownRef}>
              {/* Profile Button */}
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full border border-gray-300 bg-blue-50 hover:bg-blue-100 transition"
              >
                <div className="flex-shrink-0">{avatarSmall}</div>
                <div className="text-gray-600 font-semibold text-xs sm:text-sm truncate max-w-20 sm:max-w-32 md:max-w-none hidden sm:block lg:block">
                  {user.name}
                </div>
                <ChevronDown
                  size={16}
                  className="text-gray-500 hidden sm:block"
                />
              </button>

              {/* Profile Dropdown */}
              {open && (
                <div className="absolute right-0 mt-3 w-80 sm:w-[360px] bg-[#eef3fb] rounded-2xl shadow-xl border border-gray-200 z-50">
                  <div className="relative px-4 sm:px-6 py-4 sm:py-5 text-center">
                    {/* Close Button */}
                    <button
                      className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700"
                      onClick={() => setOpen(false)}
                    >
                      <X size={18} />
                    </button>

                    {/* Avatar */}
                    <div className="mx-auto w-12 sm:w-14 h-12 sm:h-14 lg:w-20 lg:h-20 rounded-full text-white flex items-center justify-center text-xl font-medium mb-2 relative">
                      {avatarLarge}
                    </div>

                    {/* User Info */}
                    <div className="text-base sm:text-lg text-gray-900 font-semibold truncate px-4">
                      {user.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1 truncate px-4">
                      {user.email}
                    </div>

                    {/* Edit Profile Button */}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="mt-5 w-full border border-red-600 rounded-full flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-100"
                    >
                      <LogOut size={20} />
                      <span className="ml-3 font-medium">Keluar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="mt-3 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari makanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="mt-3 lg:hidden">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Menu</span>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>
              {subtitle && (
                <p className="text-gray-600 text-sm mb-3 sm:hidden">
                  {subtitle}
                </p>
              )}
              <div className="flex items-center space-x-2 text-sm">
                <Calendar size={16} className="text-teal-600" />
                <span className="text-gray-700">
                  {format(currentSelectedDate, "dd MMMM yyyy", { locale: id })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
