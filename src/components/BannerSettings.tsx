import { useState, useEffect } from "react";

export default function BannerSettings() {
  const [banners, setBanners] = useState<string[]>([]);
  const [newBanner, setNewBanner] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("banners");
    if (saved) {
      setBanners(JSON.parse(saved));
    } else {
      setBanners([
        "/ads/arabic-teachers.jpg",
        "/ads/banner2.jpg",
        "/ads/banner3.jpg",
      ]);
    }
  }, []);

  const saveBanners = (updated: string[]) => {
    setBanners(updated);
    localStorage.setItem("banners", JSON.stringify(updated));
  };

  const addBanner = () => {
    if (!newBanner.trim()) return;
    saveBanners([...banners, newBanner.trim()]);
    setNewBanner("");
  };

  const removeBanner = (index: number) => {
    const updated = banners.filter((_, i) => i !== index);
    saveBanners(updated);
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">إدارة البنرات</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newBanner}
          onChange={(e) => setNewBanner(e.target.value)}
          placeholder="أدخل رابط صورة"
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={addBanner}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          إضافة
        </button>
      </div>

      <ul className="space-y-2">
        {banners.map((banner, index) => (
          <li
            key={index}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span className="truncate w-2/3">{banner}</span>
            <button
              onClick={() => removeBanner(index)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
