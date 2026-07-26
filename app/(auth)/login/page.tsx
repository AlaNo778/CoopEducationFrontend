
"use client"; 
import { login } from "@/services/authService";
import Input from "@/components/ui/Input";
import "./login.css";

import { useState } from "react";
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter()

  const togglePw = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    const data = await login(username, password, rememberMe);
    router.push("/dashboard")
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check your credentials.");
    }
  };
  return (
    <div className="page">
      <div className="left">
    <div className="brand">
      <div className="brand-icon">
        <img src="/hat-icon-w.svg" alt="Hat Icon" className="w-6 h-6" />
      </div>
      <span className="brand-name">Science Co-op</span>
    </div>

    <div className="hero-text">
      <h1>ระบบสหกิจศึกษา<br/>คณะวิทยาศาสตร์</h1>
      <p>จัดการข้อมูลสหกิจศึกษา ติดตามสถานะการฝึกงาน และเชื่อมต่อระหว่างนักศึกษา อาจารย์ และสถานประกอบการได้อย่างมีประสิทธิภาพ</p>
    </div>

    <div className="dashboard-card">
      <div className="dash-top">
        <div className="stat-pill">
          <div className="label">นักศึกษาทั้งหมด</div>
          <div className="value">312</div>
          <div className="sub">▲ 8% จากเทอมที่แล้ว</div>
        </div>
        <div className="stat-pill">
          <div className="label">สถานประกอบการ</div>
          <div className="value">112</div>
          <div className="sub">พันธมิตรที่ลงทะเบียน</div>
        </div>
        <div className="stat-pill">
          <div className="label">ผ่านการประเมิน</div>
          <div className="value">94%</div>
          <div className="sub">คะแนนเฉลี่ย A</div>
        </div>
      </div>

      <div className="dash-charts">
        <div className="chart-box">
          <div className="title">นักศึกษาแต่ละสาขา</div>
          <div className="bars">
            <div className="bar" style={{ height: "55%" }}></div>
            <div className="bar active" style={{ height: "80%" }}></div>
            <div className="bar" style={{ height: "65%" }}></div>
            <div className="bar" style={{ height: "45%" }}></div>
            <div className="bar active" style={{ height: "90%" }}></div>
            <div className="bar" style={{ height: "70%" }}></div>
          </div>
        </div>
        <div className="chart-box">
          <div className="title">อัตราการผ่านสหกิจฯ</div>
          <div className="donut-wrap">
            <div className="donut"></div>
            <div>
              <div className="donut-pct">72%</div>
              <div className="donut-label">ผ่านแล้วปีนี้</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
      <div className="right">
    <div className="form-wrap">
      <h2>เข้าสู่ระบบ</h2>
      <p className="sub">กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>

      <div className="form-group">
        <label htmlFor="username">ชื่อผู้ใช้งาน (Username)</label>
        <div className="input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          {/* <input id="username" type="text" placeholder="รหัสนักศึกษา / อีเมล" value = {username} onChange={(e) => setUsername(e.target.value)} /> */}
          <Input  id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="รหัสนักศึกษา / ชื่อผู้ใช้งาน" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="password">รหัสผ่าน (Password)</label>
        <div className="input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value = {password} onChange={(e) => setPassword(e.target.value)} />
          <button className="toggle-pw" onClick={togglePw} type="button" id="toggleBtn">
            <svg
              id="eyeIcon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button> 
        </div>
      </div>

      <div className="row-opts">
        <label className="remember">
          <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          <span className="checkbox-box"></span>
          จดจำการเข้าสู่ระบบ
        </label>
        <a href="#" className="forgot">ลืมรหัสผ่าน?</a>
      </div>

      <button className="btn-login" onClick={handleSubmit}>
        เข้าสู่ระบบ
      </button>

      <p className="help-link">มีปัญหาการใช้งาน? <a href="#">ติดต่อเจ้าหน้าที่</a></p>

      <div className="divider"></div>

      <div className="footer-links">
        <a href="#">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          คู่มือการใช้งาน
        </a>
        <span className="sep">|</span>
        <a href="#">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6 6l.95-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          ติดต่อดูแลระบบ
        </a>
      </div>

      <p className="copyright">© 2024 คณะวิทยาศาสตร์, สงวนลิขสิทธิ์.</p>
    </div>
  </div>
  </div>
    
  );
}