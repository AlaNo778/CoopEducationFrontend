# Coop Education – Frontend

ระบบจัดการสหกิจศึกษา (Cooperative Education Management System) ฝั่ง Frontend
พัฒนาโดยออกแบบ UI/UX ด้วย **AI UXPilot** และพัฒนาแอปด้วย **React (Next.js App Router)**
เชื่อมต่อกับ **Backend API** เพื่อจัดการข้อมูลนักศึกษา อาจารย์ สถานประกอบการ และรายงานสหกิจ

---

## เทคโนโลยีที่ใช้

| ส่วนงาน | เทคโนโลยี |
|---|---|
| ออกแบบ UI/UX | AI UXPilot |
| Framework | Next.js (App Router) + React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Component / Accessibility | React Aria Components |
| Animation | Framer Motion / Motion |
| Icon | @untitledui/icons, react-icons |
| Form / Validation | Zod |
| Date Handling | date-fns |
| Lint / Format | ESLint, TypeScript-ESLint |
| Backend Connection | REST API (fetch / axios ตามที่ตั้งค่าใน `lib` หรือ `services`) |

---

## โครงสร้างโปรเจกต์ (Project Structure)

```
coop-education/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # กลุ่มหน้าที่เกี่ยวกับการยืนยันตัวตน
│   │   └── login/
│   └── (main)/
│       ├── (protected)/        # หน้าที่ต้อง login ก่อนเข้าใช้งาน
│       │   ├── appointment/
│       │   ├── assign-student/
│       │   ├── co-operation/
│       │   ├── dashboard/
│       │   ├── form/
│       │   ├── profile/
│       │   ├── report/
│       │   ├── student/
│       │   ├── usersTable/
│       │   └── weeklyReport/
│       └── (public)/           # หน้าที่เข้าถึงได้โดยไม่ต้อง login
│
├── assets/                     # รูปภาพ, ไอคอน
├── components/
│   ├── application/             # component ระดับ application
│   ├── feature/                 # component แยกตามฟีเจอร์ (appointment, dashboard, ฯลฯ)
│   ├── guards/                  # route guard / auth guard
│   ├── layout/                  # layout หลัก (navbar, sidebar ฯลฯ)
│   └── ui/                      # reusable UI components
│
├── hooks/                       # custom React hooks
├── lib/                         # utility / config (เช่น axios instance, constants)
├── services/                    # เรียก API เชื่อมต่อกับ Backend
├── types/                       # TypeScript type definitions
├── utils/                       # ฟังก์ชันช่วยเหลือทั่วไป
└── public/                      # static files
```

---

## เริ่มต้นใช้งาน (Getting Started)

### 1. Clone โปรเจกต์
```bash
git clone https://github.com/AlaNo778/CoopEducationFrontend.git
cd coop-education
```

### 2. ติดตั้ง dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env.local` ที่ root ของโปรเจกต์ แล้วกำหนดค่า เช่น:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
> ปรับ URL ให้ตรงกับ Backend ที่ใช้งานจริง

### 4. รันโปรเจกต์ในโหมด Development
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

### 5. Build สำหรับ Production
```bash
npm run build
npm run start
```

---

## Scripts ที่ใช้บ่อย

| คำสั่ง | คำอธิบาย |
|---|---|
| `npm run dev` | รันโปรเจกต์ในโหมดพัฒนา |
| `npm run build` | build โปรเจกต์สำหรับ production |
| `npm run start` | รันโปรเจกต์ที่ build แล้ว |
| `npm run lint` | ตรวจสอบโค้ดด้วย ESLint |

---

## แนวทางการพัฒนา (Contribution Guide)

1. สร้าง branch ใหม่จาก `main` หรือ `develop` ตามข้อตกลงของทีม เช่น
   ```bash
   git checkout -b feature/ชื่อฟีเจอร์
   ```
2. ตั้งชื่อ component / ไฟล์ ให้สอดคล้องกับโครงสร้างเดิม (แยกตาม `feature/`)
3. เขียนโค้ดตามมาตรฐาน ESLint ของโปรเจกต์ ก่อน commit ให้รัน:
   ```bash
   npm run lint
   ```
4. เปิด Pull Request พร้อมอธิบายการเปลี่ยนแปลงให้ชัดเจน

---

## หมายเหตุ

- การออกแบบหน้าเว็บอ้างอิงจาก Mockup ที่สร้างด้วย **AI UXPilot**
- การเชื่อมต่อ Backend อยู่ในโฟลเดอร์ `services/` และการตั้งค่ากลาง (เช่น axios instance) อยู่ใน `lib/`
- โฟลเดอร์ `(protected)` ใช้คู่กับ `components/guards` เพื่อจำกัดสิทธิ์การเข้าถึงหน้าเว็บ
