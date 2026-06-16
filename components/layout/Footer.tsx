import styles from "./Footer.module.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLine } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* ===== ส่วนบน: 3 คอลัมน์ ===== */}
        <div className={styles.columns}>
          {/* ส่วนที่ 1: ระบบสหกิจ */}
          <section className={styles.col1}>
            <div className={styles.brand}>
              <div className={styles.brandIcon}>
                <img src="/hat-icon-p.svg" alt="Hat Icon" />
              </div>
              <span className={styles.brandName}>ระบบสหกิจศึกษา</span>
            </div>
            <p className={styles.description}>
              ระบบจัดการสหกิจศึกษาคณะวิทยาศาสตร์ เพื่อการบริหารจัดการที่มีประสิทธิภาพและโปร่งใส
            </p>
            <div className={styles.socials}>
              <a href="" aria-label="Facebook" className={styles.socialLink}>
                <FaFacebookF />
              </a>
              <a href="" aria-label="Twitter" className={styles.socialLink}>
                <FaTwitter />
              </a>
              <a href="" aria-label="Instagram" className={styles.socialLink}>
                <FaInstagram />
              </a>
              <a href="" aria-label="Line" className={styles.socialLink}>
                <FaLine />
              </a>
            </div>
          </section>

          {/* ส่วนที่ 2: ลิงก์ด่วน */}
          <section className={styles.col2}>
            <h4 className={styles.colTitle}>ลิงก์ด่วน</h4>
            <ul className={styles.linkList}>
              <li><a href="/about">เกี่ยวกับเรา</a></li>
              <li><a href="/news">ข่าวสาร</a></li>
              <li><a href="/faq">คำถามที่พบบ่อย</a></li>
              <li><a href="/privacy">นโยบายความเป็นส่วนตัว</a></li>
            </ul>
          </section>

          {/* ส่วนที่ 3: ติดต่อเรา */}
          <section className={styles.col3}>
            <h4 className={styles.colTitle}>ติดต่อเรา</h4>
            <ul className={styles.contactList}>
              <li>
                <HiOutlineLocationMarker className={styles.contactIconLocation} />
                <span>คณะวิทยาศาสตร์ มหาวิทยาลัย</span>
              </li>
              <li>
                <HiOutlinePhone className={styles.contactIcon} />
                <span>02-123-4567</span>
              </li>
              <li>
                <HiOutlineMail className={styles.contactIcon} />
                <span>coop@science.ac.th</span>
              </li>
            </ul>
          </section>
        </div>

        {/* ===== เส้นแบ่ง ===== */}
        <div className={styles.divider}></div>

        {/* ===== Copyright ด้านล่าง ===== */}
        <div className={styles.copyright}>
          © 2024 คณะวิทยาศาสตร์. สงวนลิขสิทธิ์.
        </div>
      </div>
    </footer>
  );
}
