'use client';
import { useRouter } from 'next/navigation';

const ProfileCard = () => {
  const router = useRouter(); 

  return (
    <div className="text-center mt-10">
      {/* ...foto profil, nama, email, dsb... */}

      <button
        onClick={() => router.push('/profile')} 
        className="mt-4 px-4 py-1.5 border border-gray-400 rounded-full text-sm text-teal-600 hover:bg-blue-100 font-medium"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;
