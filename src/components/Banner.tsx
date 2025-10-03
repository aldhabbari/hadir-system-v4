import { useState } from "react";

function Banner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full flex justify-center mt-4">
      <div className="relative w-full max-w-md bg-white shadow rounded-lg overflow-hidden">
        {/* صورة البانر */}
        <img
          src="/ads/arabic-teachers.jpg"
          alt="إعلان"
          className="w-full h-32 object-cover"
        />
        {/* زر إغلاق */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Banner;
