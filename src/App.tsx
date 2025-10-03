import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./logo.png";
import Banner from "./components/Banner";
import BannerSettings from "./components/BannerSettings"; // ✅ استيراد شاشة الإعدادات

// استيراد الأيقونات من src/icons
const attendanceIcon = new URL("./icons/attendance.gif", import.meta.url).href;
const reportsIcon    = new URL("./icons/reports.gif", import.meta.url).href;
const studentsIcon   = new URL("./icons/students.gif", import.meta.url).href;
const settingsIcon   = new URL("./icons/settings.gif", import.meta.url).href;

// Recharts (Pie)
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = { primary: "#D95B2D", secondary: "#6A7B2E", bg: "#F9F6F2" };
type View = "splash" | "login" | "home" | "attendance" | "reports" | "students" | "settings";

/* ============ Types ============ */
type Student = {
  id: number;
  name: string;
  grade: number;
  classNo: number;
  guardianPhone: string;
  status: "حاضر" | "غائب" | "متأخر" | "غائب بعذر";
  note?: string;
};

/* ============ App ============ */
export default function HadirApp() {
  const [view, setView] = useState<View>("splash");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") setDark(true);
    const t = setTimeout(() => setView("login"), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [dark]);

  return (
    <div
      className="min-h-screen flex flex-col dark:bg-[#0d1b2a]"
      style={{ backgroundColor: COLORS.bg, direction: "rtl" }}
    >
      {view !== "login" && <Header dark={dark} toggle={() => setDark(!dark)} />}
      
      {/* ✅ بانر متغير تلقائياً */}
      <Banner />

      <div className="flex-grow flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {view === "splash" && <Splash key="splash" />}
          {view === "login" && (
            <LoginCard key="login" onSuccess={() => setView("home")} />
          )}
          {view === "home" && (
            <HomePage
              key="home"
              onNavigate={setView}
              onLogout={() => setView("login")}
            />
          )}
          {view === "attendance" && (
            <AttendancePage key="attendance" onBack={() => setView("home")} />
          )}
          {view === "reports" && (
            <ReportsPage key="reports" onBack={() => setView("home")} />
          )}
          {view === "students" && (
            <StudentsPage key="students" onBack={() => setView("home")} />
          )}
          {view === "settings" && ( // ✅ شاشة الإعدادات
            <BannerSettings key="settings" />
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}

/* ============ Header ============ */
function Header({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  return (
    <header className="sticky top-0 z-10 w-full flex justify-between items-center px-4 py-2 shadow bg-white dark:bg-[#1b263b]">
      <div className="flex items-center gap-3">
        <img src={logo} alt="شعار مدرسة المشارق" className="w-10 h-10 rounded" />
        <div className="leading-tight">
          <div className="font-extrabold text-lg text-gray-800 dark:text-gray-100">حاضر</div>
          <div className="text-xs" style={{ color: COLORS.secondary }}>نظام متابعة الحضور والغياب</div>
        </div>
      </div>
      <button onClick={toggle} aria-label="تبديل الوضع الليلي" className="text-2xl dark:text-yellow-300 text-gray-800">
        {dark ? "☀️" : "🌙"}
      </button>
    </header>
  );
}

/* ============ Splash ============ */
function Splash() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center bg-white dark:bg-[#1b263b] rounded-2xl shadow-lg p-10">
      <img src={logo} alt="شعار" className="w-20 h-20 mb-4" />
      <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-100">نظام حاضر</h1>
    </motion.div>
  );
}

/* ============ Login ============ */
function LoginCard({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 600);
  }
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="bg-white dark:bg-[#1b263b] rounded-2xl shadow-lg p-8 w-full max-w-md">
      <div className="flex justify-center mb-6">
        <img src={logo} alt="شعار المدرسة" className="w-16 h-16" />
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="text" placeholder="اسم المستخدم" className="w-full rounded-xl border px-3 py-2" required />
        <input type="password" placeholder="كلمة المرور" className="w-full rounded-xl border px-3 py-2" required />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-1"><input type="checkbox" className="rounded" /> تذكرني</label>
          <a href="#" className="text-blue-600 dark:text-blue-300">نسيت كلمة المرور؟</a>
        </div>
        <button type="submit" className="w-full py-2 rounded-2xl font-semibold"
          style={{ backgroundColor: COLORS.primary, color: "#fff" }} disabled={loading}>
          {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
        </button>
      </form>
    </motion.div>
  );
}

/* ============ Home ============ */
function HomePage({ onNavigate, onLogout }: { onNavigate: (v: View) => void; onLogout: () => void; }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="w-full max-w-5xl"
    >
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl"
          style={{ backgroundColor: COLORS.secondary, color: "#fff" }}
        >
          تسجيل خروج
        </button>
      </div>

      {/* شبكة البطاقات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashCard
          title="تسجيل الحضور"
          description="بدء جلسة حضور اليوم"
          highlight
          onClick={() => onNavigate("attendance")}
          iconSrc={attendanceIcon}
        />
        <DashCard
          title="تقارير الغياب"
          description="عرض وطباعة التقارير"
          onClick={() => onNavigate("reports")}
          iconSrc={reportsIcon}
        />
        <DashCard
          title="إدارة الطلاب"
          description="إضافة/تعديل بيانات الطلاب"
          onClick={() => onNavigate("students")}
          iconSrc={studentsIcon}
        />
        <DashCard
          title="الإعدادات"
          description="إدارة البنرات"
          onClick={() => onNavigate("settings")} // ✅ يفتح إعدادات البنرات
          iconSrc={settingsIcon}
        />
      </div>
    </motion.div>
  );
}

/* باقي الصفحات (AttendancePage, ReportsPage, StudentsPage, DashCard, Footer, Helpers) نفس ما عندك، بدون تغيير */


/* ============ Attendance, Reports, Students, DashCard, Footer, Helpers ============ */
// 👇 تبقى كما هي من ملفك السابق (ما غيرناها)



/* ============ Attendance ============ */
type AttStage = "chooseGrade" | "chooseClass" | "list";

function AttendancePage({ onBack }: { onBack: () => void }) {
  const [stage, setStage] = useState<AttStage>("chooseGrade");
  const [grade, setGrade] = useState<number | null>(null);
  const [classNo, setClassNo] = useState<number | null>(null);
  const [list, setList] = useState<Student[]>([]);

  const handleChooseGrade = (g: number) => { setGrade(g); setStage("chooseClass"); };
  const handleChooseClass = (c: number) => {
    setClassNo(c);
    const data = generateStudents(grade!, c);
    setList(data);
    setStage("list");
  };

  function updateStudent(id: number, status: Student["status"], note: string) {
    setList(prev => prev.map(s => s.id === id ? { ...s, status, note } : s));
  }

  // يحفظ بالشكل: { date, students }
  function saveAttendance() {
    const payload = {
      date: new Date().toLocaleString("ar-EG"),
      students: list,
    };
    localStorage.setItem("attendanceData", JSON.stringify(payload));
    alert("✅ تم حفظ الحضور");
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="bg-white dark:bg-[#1b263b] rounded-2xl shadow p-6 w-full max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-100">تسجيل الحضور</h2>
        <div className="flex gap-2">
          {stage !== "chooseGrade" && (
            <button onClick={() => { setStage("chooseGrade"); setGrade(null); setClassNo(null); setList([]); }}
              className="px-3 py-2 rounded-xl text-sm" style={{ backgroundColor: COLORS.secondary, color: "#fff" }}>الصفوف</button>
          )}
          {stage === "list" && (
            <button onClick={() => { setStage("chooseClass"); setClassNo(null); setList([]); }}
              className="px-3 py-2 rounded-xl text-sm" style={{ backgroundColor: COLORS.primary, color: "#fff" }}>الشُعَب</button>
          )}
          <button onClick={onBack} className="px-3 py-2 rounded-xl text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">رجوع</button>
        </div>
      </div>

      {stage === "chooseGrade" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1,2,3,4].map(g => (
            <DashCard key={g} title={`الصف ${toArabic(g)}`} description="اضغط للاختيار" highlight onClick={() => handleChooseGrade(g)} />
          ))}
        </div>
      )}

      {stage === "chooseClass" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1,2,3,4].map(c => (
            <DashCard key={c} title={`الشعبة ${toArabic(c)}`} description="اضغط للاختيار" highlight onClick={() => handleChooseClass(c)} />
          ))}
        </div>
      )}

      {stage === "list" && (
        <div>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border px-2 py-1">الاسم</th>
                  <th className="border px-2 py-1">الحالة</th>
                  <th className="border px-2 py-1">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.id}>
                    <td className="border px-2 py-1">{s.name}</td>
                    <td className="border px-2 py-1">
                      <div className="flex gap-2">
                        <button onClick={() => updateStudent(s.id,"حاضر","")} className={`px-2 py-1 rounded ${s.status==="حاضر"?"bg-green-500 text-white":"bg-gray-200"}`}>✅</button>
                        <button onClick={() => updateStudent(s.id,"غائب","")} className={`px-2 py-1 rounded ${s.status==="غائب"?"bg-red-500 text-white":"bg-gray-200"}`}>❌</button>
                        <button onClick={() => {const note=prompt("أدخل سبب التأخير");updateStudent(s.id,"متأخر",note||"");}} className={`px-2 py-1 rounded ${s.status==="متأخر"?"bg-yellow-500 text-white":"bg-gray-200"}`}>⏰</button>
                        <button onClick={() => {const note=prompt("أدخل العذر");updateStudent(s.id,"غائب بعذر",note||"");}} className={`px-2 py-1 rounded ${s.status==="غائب بعذر"?"bg-blue-500 text-white":"bg-gray-200"}`}>📝</button>
                      </div>
                    </td>
                    <td className="border px-2 py-1">{s.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={saveAttendance} className="px-4 py-2 rounded-xl font-semibold" style={{ backgroundColor: COLORS.primary, color: "#fff" }}>
              حفظ الحضور
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ============ Reports ============ */
type ReportView = "menu" | "list" | "stats" | "search";

function ReportsPage({ onBack }: { onBack: () => void }) {
  // يتعامل مع الشكلين: القديم (مصفوفة) والجديد ({date, students})
  const [meta, setMeta] = useState<{ date: string; students: Student[] } | null>(null);
  const [subView, setSubView] = useState<ReportView>("menu");
  const [filtered, setFiltered] = useState<Student[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("attendanceData");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setMeta({ date: new Date().toLocaleString("ar-EG"), students: parsed as Student[] });
      } else if (parsed && Array.isArray(parsed.students)) {
        setMeta(parsed as { date: string; students: Student[] });
      } else {
        console.warn("attendanceData format not recognized:", parsed);
      }
    } catch (e) {
      console.error("Failed to parse attendanceData:", e);
    }
  }, []);

  const records = meta?.students || [];

  // تجميع إحصائيات الحضور/الغياب لكل صف
  const groupedByGrade = records.reduce((acc, s) => {
    if (!acc[s.grade]) acc[s.grade] = { grade: s.grade, hadir: 0, ghyab: 0 };
    if (s.status === "حاضر") acc[s.grade].hadir++; else acc[s.grade].ghyab++;
    return acc;
  }, {} as Record<number, { grade: number; hadir: number; ghyab: number }>);

  const chartData = Object.values(groupedByGrade).map((g) => ({
    الصف: toArabic(g.grade),
    حضور: g.hadir,
    غياب: g.ghyab,
  }));

  const total = {
    الصف: "المدرسة",
    حضور: chartData.reduce((sum, g) => sum + g.حضور, 0),
    غياب: chartData.reduce((sum, g) => sum + g.غياب, 0),
  };

  const PIE_COLORS = ["#4ade80", "#f87171"]; // أخضر = حضور، أحمر = غياب

  // تصدير CSV
  function exportCSV() {
    if (!meta) return;
    const rows = meta.students.map((s) =>
      [s.name, toArabic(s.grade), toArabic(s.classNo), s.status, s.note || ""].join(",")
    );
    const csv = "الاسم,الصف,الشعبة,الحالة,ملاحظات\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `غياب_${meta.date}.csv`;
    a.click();
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="bg-white dark:bg-[#1b263b] rounded-2xl shadow p-6 w-full max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-100">التقارير</h2>
        <div className="flex gap-2">
          {meta && (
            <button onClick={exportCSV} className="px-3 py-2 rounded-xl text-sm bg-green-600 text-white">⬇️ تصدير CSV</button>
          )}
          <button onClick={onBack} className="px-3 py-2 rounded-xl text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">رجوع</button>
        </div>
      </div>

      {meta && <p className="mb-4 text-sm text-gray-500">آخر تحديث: {meta.date}</p>}

      {/* القائمة الرئيسية (3 بطاقات بأيقونات من public/icons) */}
      {subView === "menu" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DashCard title="📋 تقارير الغياب" description="عرض القوائم" highlight onClick={() => setSubView("list")} iconSrc="/icons/reports.gif" />
          <DashCard title="📊 إحصائيات الغياب" description="رسوم بيانية (Pie)" onClick={() => setSubView("stats")} iconSrc="/icons/settings.gif" />
          <DashCard title="🔎 البحث" description="سجل الغياب للطلاب" onClick={() => setSubView("search")} iconSrc="/icons/students.gif" />
        </div>
      )}

      {/* تقارير الغياب (فقط غير الحاضرين ومقسّم حسب الصف) */}
      {subView === "list" && (
        <div>
          {records.length === 0 ? (
            <p className="text-gray-500">لا توجد بيانات غياب</p>
          ) : (
            Object.entries(
              records.reduce((acc, s) => {
                if (s.status !== "حاضر") {
                  if (!acc[s.grade]) acc[s.grade] = [];
                  acc[s.grade].push(s);
                }
                return acc;
              }, {} as Record<number, Student[]>)
            ).map(([grade, students]) => (
              <div key={grade} className="mb-6">
                <h3 className="font-bold text-lg mb-2">غياب الصف {toArabic(Number(grade))}</h3>
                <table className="w-full border-collapse border mb-2">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border px-2 py-1">الاسم</th>
                      <th className="border px-2 py-1">الشعبة</th>
                      <th className="border px-2 py-1">الحالة</th>
                      <th className="border px-2 py-1">ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id}>
                        <td className="border px-2 py-1">{s.name}</td>
                        <td className="border px-2 py-1">{toArabic(s.classNo)}</td>
                        <td className="border px-2 py-1">{s.status}</td>
                        <td className="border px-2 py-1">{s.note || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr className="border-t-2 border-gray-300 dark:border-gray-700" />
              </div>
            ))
          )}
        </div>
      )}

      {/* إحصائيات الغياب (Pie لكل صف + إجمالي) */}
      {subView === "stats" && (
        <div className="space-y-10">
          {chartData.length === 0 ? (
            <p className="text-gray-500">لا توجد بيانات لإظهار الإحصائيات</p>
          ) : (
            <>
              {chartData.map((g) => (
                <div key={g.الصف}>
                  <h3 className="font-bold mb-2">الصف {g.الصف}</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "حضور", value: g.حضور },
                          { name: "غياب", value: g.غياب },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label
                      >
                        {PIE_COLORS.map((c, i) => (
                          <Cell key={i} fill={c} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ))}

              <div>
                <h3 className="font-bold mb-2">🏫 إجمالي المدرسة</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "حضور", value: total.حضور },
                        { name: "غياب", value: total.غياب },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {PIE_COLORS.map((c, i) => (
                        <Cell key={i} fill={c} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      )}

      {/* البحث */}
      {subView === "search" && (
        <div>
          <h3 className="font-bold mb-2">🔎 البحث في سجل الطلاب</h3>
          <input
            type="text"
            placeholder="اكتب اسم الطالب..."
            className="border rounded px-3 py-2 w-full mb-4"
            onChange={(e) => {
              const q = e.target.value.trim();
              if (!q) return setFiltered([]);
              setFiltered(records.filter((s) => s.name.includes(q)));
            }}
          />
          {filtered.length === 0 ? (
            <p className="text-gray-500">لا توجد نتائج</p>
          ) : (
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border px-2 py-1">الاسم</th>
                  <th className="border px-2 py-1">الصف</th>
                  <th className="border px-2 py-1">الشعبة</th>
                  <th className="border px-2 py-1">الحالة</th>
                  <th className="border px-2 py-1">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td className="border px-2 py-1">{s.name}</td>
                    <td className="border px-2 py-1">{toArabic(s.grade)}</td>
                    <td className="border px-2 py-1">{toArabic(s.classNo)}</td>
                    <td className="border px-2 py-1">{s.status}</td>
                    <td className="border px-2 py-1">{s.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ============ Students Page (Placeholder) ============ */
function StudentsPage({ onBack }: { onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="bg-white dark:bg-[#1b263b] rounded-2xl shadow p-6 w-full max-w-5xl">
      <h2 className="text-lg font-bold mb-4 text-gray-700 dark:text-gray-100">إدارة الطلاب</h2>
      <p className="text-gray-500">(قيد التطوير)</p>
      <button onClick={onBack} className="mt-4 px-3 py-2 rounded-xl text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">رجوع</button>
    </motion.div>
  );
}

/* ============ DashCard (with optional icon) ============ */
function DashCard({
  title,
  description,
  highlight = false,
  onClick,
  iconSrc,
}: {
  title: string;
  description: string;
  highlight?: boolean;
  onClick?: () => void;
  iconSrc?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="text-right bg-white dark:bg-[#1b263b] rounded-2xl p-5 shadow hover:shadow-md transition flex items-center gap-4"
      style={{ borderTop: `4px solid ${highlight ? COLORS.primary : "#E5E7EB"}` }}
    >
      {iconSrc && (
        <img
          src={iconSrc}
          alt=""
          className="w-10 h-10 rounded-md"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      )}
      <div className="flex flex-col gap-1">
        <div className="font-bold text-lg" style={{ color: highlight ? COLORS.primary : COLORS.secondary }}>{title}</div>
        <div className="text-sm text-gray-500 dark:text-gray-300">{description}</div>
      </div>
    </button>
  );
}

/* ============ Footer ============ */
function Footer() {
  return (
    <footer className="py-4 text-center text-xs text-gray-400">
      © {new Date().getFullYear()} نظام حاضر
    </footer>
  );
}

/* ============ Helpers ============ */
function toArabic(n: number): string {
  const map = ["الأول","الثاني","الثالث","الرابع","الخامس","السادس"];
  return map[n-1] || String(n);
}

function generateStudents(grade: number, classNo: number): Student[] {
  const first = ["أحمد","مريم","سارة","يوسف","راشد","ليان","جميلة","عبدالله","هند","إسماعيل","محمد","آمنة","معاذ","أروى","نورة","خالد","أسماء","ريم","فاطمة","حسن"];
  const last = ["الهاشمي","العريمي","البوسعيدي","الشكيلي","الكندي","الهنائي","البلوشي","المهري","الشامسي","الغافري","العوفي","الحارثي","الهادي","البادي"];
  const seed = grade*100 + classNo;
  return Array.from({length:6}, (_,i)=> {
    const fname = first[(seed + i*3) % first.length];
    const lname = last[(seed + i*5 + 7) % last.length];
    const phone = "9" + String((seed*98765 + i*12345) % 10000000).padStart(7,"0");
    return { id: seed*10+i, name: `${fname} ${lname}`, grade, classNo, guardianPhone: phone, status: "حاضر", note: "" };
  });
}
