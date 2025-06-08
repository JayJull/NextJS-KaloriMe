'use client';
import { useState } from "react";
import { useSession } from 'next-auth/react'
import { User, Mail, Target, Scale, Activity, Calendar, Utensils, Droplets, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [name, setName] = useState("Tama Zidan");
  const [email, setEmail] = useState("tamazidan87@gmail.com");
  const [age, setAge] = useState("28");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [targetWeight, setTargetWeight] = useState("65");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [goal, setGoal] = useState("weight-loss");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession()
  const router = useRouter()

  // Calculate BMI
  const bmi = weight && height ? (weight / ((height / 100) ** 2)).toFixed(1) : 0;
  
  // Calculate daily calorie target (simplified Harris-Benedict formula)
  const bmr = weight && height && age ? 
    (10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * parseFloat(age) + 5) : 0;
  
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  const dailyCalories = Math.round(bmr * activityMultipliers[activityLevel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, email, age, weight, height, targetWeight, activityLevel, goal 
        }),
      });

      if (!res.ok) throw new Error('Gagal simpan');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Terjadi kesalahan saat menyimpan profil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const avatarLarge = session?.user?.image ? (
      <div className="relative w-15 h-15 sm:w-25 lg:w-30 sm:h-25 lg:h-30">
        <Image
          src={session.user.image}
          alt="User"
          fill
          className="object-cover rounded-full"
        />
      </div>
    ) : (
      <span className="bg-blue-500 text-white font-bold w-15 h-15 sm:w-25 lg:w-30 sm:h-25 lg:h-30 rounded-full flex items-center justify-center text-2xl">
        {(session?.user?.name || "Guest").charAt(0)}
      </span>
    )

  return (
    <div className="min-h-screen bg-teal-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <button
            onClick={() => {
                if (window.history.length > 1) {
                router.back()
                } else {
                router.push('/dashboard') 
                }
            }}
            className="inline-flex items-center px-4 py-2 text-lg font-bold text-black bg-white rounded-lg hover:text-white hover:bg-teal-500 transition"
            >
            <ArrowLeft className="w-8 h-8" />
        </button>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {avatarLarge}
                </div>
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            <p className="text-gray-600">{email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Health Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Scale className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{weight}</div>
            <div className="text-sm text-gray-600">kg</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{bmi}</div>
            <div className="text-sm text-gray-600">BMI</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Target className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{targetWeight}</div>
            <div className="text-sm text-gray-600">Target kg</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Utensils className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{dailyCalories}</div>
            <div className="text-sm text-gray-600">kcal/hari</div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Edit Profil
          </h2>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                <input
                  className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>
            </div>

            {/* Physical Stats */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Scale className="w-5 h-5 mr-2" />
                Data Fisik
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Umur</label>
                  <input
                    className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    type="number"
                    placeholder="tahun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Berat Badan</label>
                  <input
                    className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    type="number"
                    placeholder="kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tinggi Badan</label>
                  <input
                    className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    type="number"
                    placeholder="cm"
                  />
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Target & Tujuan
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Berat Badan</label>
                  <input
                    className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    type="number"
                    placeholder="kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tujuan</label>
                  <select
                    className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  >
                    <option value="weight-loss">Menurunkan Berat Badan</option>
                    <option value="weight-gain">Menaikkan Berat Badan</option>
                    <option value="maintain">Mempertahankan Berat Badan</option>
                    <option value="muscle-gain">Menambah Massa Otot</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Activity Level */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Tingkat Aktivitas
              </h3>
              
              <div className="space-y-3">
                {[
                  { value: 'sedentary', label: 'Sangat Sedikit', desc: 'Tidak pernah olahraga' },
                  { value: 'light', label: 'Ringan', desc: 'Olahraga 1-3 hari/minggu' },
                  { value: 'moderate', label: 'Sedang', desc: 'Olahraga 3-5 hari/minggu' },
                  { value: 'active', label: 'Aktif', desc: 'Olahraga 6-7 hari/minggu' },
                  { value: 'very_active', label: 'Sangat Aktif', desc: 'Olahraga 2x sehari atau pekerjaan fisik' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="activity"
                      value={option.value}
                      checked={activityLevel === option.value}
                      onChange={(e) => setActivityLevel(e.target.value)}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* BMI Status */}
            {bmi > 0 && (
              <div className="border-t pt-6">
                <div className="bg-teal-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-teal-900">Status BMI Anda</h4>
                      <p className="text-sm text-teal-700 mt-1">
                        BMI {bmi} - {
                          bmi < 18.5 ? 'Kurus' :
                          bmi < 25 ? 'Normal' :
                          bmi < 30 ? 'Gemuk' : 'Obesitas'
                        }
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-teal-600">{bmi}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="border-t pt-6 flex items-center justify-between">
              {success && (
                <div className="flex items-center space-x-2 text-teal-600">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  <span className="text-sm font-medium">Profil berhasil disimpan!</span>
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                className="ml-auto px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan Profil'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}