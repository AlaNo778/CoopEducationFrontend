'use client';

import Link from 'next/link';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import styles from './NavigationDualBar.module.css';

type NavigationDualBarProps = {
  leftLabel?: string;
  leftHref?: string;
  rightLabel?: string;
  rightHref?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
};

export default function NavigationDualBar({
  leftLabel = 'หน้าหลัก',
  leftHref = '/dashboard',
  rightLabel = 'นัดหมายวันนิเทศ',
  rightHref = '/#schedule',
  onLeftClick,
  onRightClick,
}: NavigationDualBarProps) {
  return (
    <div className={styles.navigationBar}>
      {leftHref ? (
        <Link href={leftHref} className={styles.dashboardButton} onClick={onLeftClick}>
          <LuArrowLeft />
          {leftLabel}
        </Link>
      ) : (
        <button className={styles.dashboardButton} onClick={onLeftClick}>
          <LuArrowLeft />
          {leftLabel}
        </button>
      )}

      {rightHref ? (
        <Link href={rightHref} className={styles.dashboardButton} onClick={onRightClick}>
          {rightLabel}
          <LuArrowRight />
        </Link>
      ) : (
        <button className={styles.dashboardButton} onClick={onRightClick}>
          {rightLabel}
          <LuArrowRight />
        </button>
      )}
    </div>
  );
}
