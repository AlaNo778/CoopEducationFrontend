"use client";

import {
  GetAppointmentSlotDto,
  fetchAppointmentsSlots,
  getTeacherId,
  bookAppointment,
  getBookingDetail,
  BookingDetailDto,
} from "../../../services/AppointmentService";

import styles from "./Appointment.module.css";
import {
  MdOutlineArrowForwardIos,
  MdOutlineArrowBackIos,
} from "react-icons/md";

import { PiWarningCircleFill } from "react-icons/pi";
import { parseISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  getDaysInMonth,
  startOfMonth,
  getDay,
  setMonth,
  setYear,
  isToday,
  subDays,
  addDays,
} from "date-fns";

export default function StudentAppointment() {
  const [appointments, setAppointments] = useState<GetAppointmentSlotDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] =
    useState<GetAppointmentSlotDto | null>(null);
  const [createAppointment, setCreateAppointment] = useState(false);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [bookingDetail, setBookingDetail] = useState<BookingDetailDto | null>(
    null,
  );
  const isBookedSelectedDate =
    bookingDetail &&
    selectedDate &&
    bookingDetail.slot.availableDate === format(selectedDate, "yyyy-MM-dd");
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const teacherId = await getTeacherId();
        const data = await fetchAppointmentsSlots(teacherId);
        const resbooking = await getBookingDetail();
        setTeacherId(teacherId);
        setBookingDetail(resbooking);

        const sorted = [...data].sort(
          (a, b) =>
            parseISO(a.availableDate).getTime() -
            parseISO(b.availableDate).getTime(),
        );

        setAppointments(sorted);

        // ถ้ามีข้อมูล ให้เปิดเดือนแรกที่มี Slot
        if (sorted.length > 0) {
          setCurrentDate(parseISO(sorted[0].availableDate));
        } else {
          setCurrentDate(new Date());
        }
        if (resbooking) {
          setAppointmentDate(parseISO(resbooking.slot.availableDate));
        }
      } catch (error) {
        console.error("Load appointment slots failed:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const slotMap = useMemo(() => {
    const map = new Map<string, GetAppointmentSlotDto>();

    appointments.forEach((slot) => {
      map.set(format(parseISO(slot.availableDate), "yyyy-MM-dd"), slot);
    });

    return map;
  }, [appointments]);
  // สร้างข้อมูล Calendar 42 ช่อง
  const calendarDays = useMemo(() => {
    const firstDay = startOfMonth(currentDate);

    const startWeekDay = getDay(firstDay);

    const totalDays = getDaysInMonth(currentDate);

    const result = [];
    for (let i = startWeekDay; i > 0; i--) {
      result.push({
        date: subDays(firstDay, i),
        currentMonth: false,
      });
    }
    for (let i = 1; i <= totalDays; i++) {
      result.push({
        date: new Date(year, month, i),
        currentMonth: true,
      });
    }
    let nextDay = 1;

    while (result.length < 42) {
      result.push({
        date: addDays(new Date(year, month, totalDays), nextDay),
        currentMonth: false,
      });

      nextDay++;
    }

    return result;
  }, [currentDate, month, year]);

  const selectedAppointments = useMemo(() => {
    if (!selectedDate) return [];

    const dateString = format(selectedDate, "yyyy-MM-dd");

    return appointments.filter((slot) => slot.availableDate === dateString);
  }, [appointments, selectedDate]);

  function handleDateClick(date: Date) {
    setSelectedDate(date);
    setCreateAppointment(false);
  }
  async function booking(slotId: number, teacherId: number) {
    try {
      await bookAppointment({
        slotId: slotId,
        teacherId: teacherId,
      });
      alert("จองนัดหมายสำเร็จ");
      // โหลดข้อมูลใหม่ เพื่ออัปเดตจำนวนคน
      const responseTeacherId = await getTeacherId();
      const data = await fetchAppointmentsSlots(responseTeacherId);
      setAppointments(data);
    } catch {
      alert("จองนัดหมายไม่สำเร็จ");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title}>นัดหมายวันนิเทศ</div>
        <div className={styles.subTitle}>จัดการนัดหมายการนิเทศงาน</div>
      </div>
      <div className={styles.content}>
        <div>
          <div className={styles.calendarHeader}>
            <div className={styles.calendarYearBar}>
              <MdOutlineArrowBackIos
                size={20}
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                style={{ cursor: "pointer" }}
              />

              <div className={styles.calendarmonthYear}>
                {/* เดือน */}
                <select
                  className={styles.monthSelect}
                  value={month}
                  onChange={(e) =>
                    setCurrentDate(
                      setMonth(currentDate, Number(e.target.value)),
                    )
                  }
                >
                  {months.map((m, index) => (
                    <option key={index} value={index}>
                      {m}
                    </option>
                  ))}
                </select>

                {/* ปี */}
                <select
                  className={styles.yearSelect}
                  value={year}
                  onChange={(e) =>
                    setCurrentDate(setYear(currentDate, Number(e.target.value)))
                  }
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const y = new Date().getFullYear() - 5 + i;

                    return (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    );
                  })}
                </select>
              </div>

              <MdOutlineArrowForwardIos
                size={20}
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                style={{ cursor: "pointer" }}
              />
            </div>

            <div className={styles.calendarDayBar}>
              <div>อา</div>
              <div>จ</div>
              <div>อ</div>
              <div>พ</div>
              <div>พฤ</div>
              <div>ศ</div>
              <div>ส</div>
            </div>
          </div>

          <div className={styles.calendar}>
            {calendarDays.map(({ date, currentMonth }, index) => {
              const slot = slotMap.get(format(date, "yyyy-MM-dd"));

              return (
                <div
                  key={index}
                  className={`
          ${styles.calendarDay}
          ${isToday(date) ? styles.today : ""}
          ${!currentMonth ? styles.otherMonth : ""}
          ${selectedDate && format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") ? styles.selected : ""}
          ${appointmentDate && format(date, "yyyy-MM-dd") === format(appointmentDate, "yyyy-MM-dd")? styles.appointmentDate: ""}
        `}
                  onClick={() => handleDateClick(date)}
                >
                  <span>{format(date, "d")}</span>

                  <div className={styles.status}>
                    {slot?.slotStatus === "Available" && (
                      <span className={`${styles.dot} ${styles.available}`} />
                    )}
                    {bookingDetail &&
                      bookingDetail.slot.availableDate ===
                        format(date, "yyyy-MM-dd") && (
                        <span className={`${styles.dot} ${styles.booked}`} />
                      )}
                    {slot && slot.bookedStudents >= slot.maxStudents && (
                      <span className={`${styles.dot} ${styles.fullyBooked}`} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={`${styles.dot} ${styles.available}`} />
              <span>ว่าง</span>
            </div>

            <div className={styles.legendItem}>
              <span className={`${styles.dot} ${styles.fullyBooked}`} />
              <span>เต็ม</span>
            </div>

            <div className={styles.legendItem}>
              <span className={`${styles.dot} ${styles.booked}`} />
              <span>มีนัดหมาย</span>
            </div>
          </div>
        </div>
        <div className={styles.appointmentContainer}>
          {createAppointment ? (
            <div className={styles.appointmentHeader}>
              <h1>เพิ่มเวลานัดหมาย</h1>
            </div>
          ) : (
            <div className={styles.appointmentHeader}>
              <h1>รายละเอียดการนัดหมาย</h1>
              <h2>{selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""}</h2>
            </div>
          )}
          {/* {!createAppointment ? (
            <div className={styles.appointmentCard}>
              {selectedAppointments.length === 0 ? (
                <div className={styles.emptyCard}>ยังไม่มีช่วงเวลานัดหมาย</div>
              ) : (
                selectedAppointments.map((slot) => (
                  <div
                    key={slot.slotId}
                    // className={styles.slotCard}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <div>
                      <b>ช่วงเวลา :</b> {slot.startTime.substring(0, 5)} -{" "}
                      {slot.endTime.substring(0, 5)}
                    </div>

                    <div>
                      <b>รูปแบบ :</b> {slot.supervisionModel}
                    </div>

                    <div>
                      <b>สถานที่ :</b> {slot.location}
                    </div>

                    <div>
                      <b>จำนวนรับ :</b> {slot.bookedStudents}/{slot.maxStudents}
                    </div>

                    <div className={styles.remark}>
                      <b>หมายเหตุ :</b> {slot.remark || "-"}
                    </div>
                    {slot.bookedStudents < slot.maxStudents && !bookingDetail && (
                      <div>
                        <button
                          className={styles.CreateButton}
                          disabled={teacherId === null}
                          onClick={() => {
                            if (teacherId === null) return;

                            booking(slot.slotId, teacherId);
                          }}
                        >
                          จองนัดหมาย
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <></>
          )} */}
          {!createAppointment && (
            <div className={styles.appointmentCard}>
              {isBookedSelectedDate ? (
                // ===============================
                // แสดงข้อมูลการนัดหมายที่จองแล้ว
                // ===============================
                <div>
                  <div>
                    <b>ช่วงเวลา :</b>{" "}
                    {bookingDetail.slot.startTime.substring(0, 5)}
                    {" - "}
                    {bookingDetail.slot.endTime.substring(0, 5)}
                  </div>

                  <div>
                    <b>รูปแบบ :</b> {bookingDetail.slot.supervisionModel}
                  </div>

                  <div>
                    <b>สถานที่ :</b> {bookingDetail.slot.location}
                  </div>

                  <div>
                    <b>สถานะ :</b> {bookingDetail.appointmentStatus}
                  </div>

                  <div>
                    <b>หมายเหตุนักศึกษา :</b> {bookingDetail.studentNote || "-"}
                  </div>

                  <div>
                    <b>หมายเหตุอาจารย์ :</b> {bookingDetail.teacherNote || "-"}
                  </div>
                </div>
              ) : selectedAppointments.length === 0 ? (
                <div className={styles.emptyCard}>ยังไม่มีช่วงเวลานัดหมาย</div>
              ) : (
                selectedAppointments.map((slot) => (
                  <div
                    key={slot.slotId}
                    // className={styles.slotCard}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <div>
                      <b>ช่วงเวลา :</b> {slot.startTime.substring(0, 5)}
                      {" - "}
                      {slot.endTime.substring(0, 5)}
                    </div>

                    <div>
                      <b>รูปแบบ :</b> {slot.supervisionModel}
                    </div>

                    <div>
                      <b>สถานที่ :</b> {slot.location}
                    </div>

                    <div>
                      <b>จำนวนรับ :</b> {slot.bookedStudents}/{slot.maxStudents}
                    </div>

                    <div className={styles.remark}>
                      <b>หมายเหตุ :</b> {slot.remark || "-"}
                    </div>

                    {slot.bookedStudents < slot.maxStudents &&
                      !isBookedSelectedDate && (
                        <button
                          className={styles.CreateButton}
                          disabled={teacherId === null}
                          onClick={(e) => {
                            e.stopPropagation();

                            if (teacherId == null) return;

                            booking(slot.slotId, teacherId);
                          }}
                        >
                          จองนัดหมาย
                        </button>
                      )}
                  </div>
                ))
              )}
            </div>
          )}

          <div className={styles.appointmentWarning}>
            <PiWarningCircleFill size={35} />{" "}
            กรุณาเลือกวันและเวลาที่สะดวกอย่างน้อย 3 วันล่วงหน้า
            เพื่อให้อาจารย์ที่ปรึกษามีเวลาในการจัดเตรียม
          </div>
        </div>
      </div>
    </div>
  );
}
