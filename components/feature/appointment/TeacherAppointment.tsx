"use client";
import styles from "./Appointment.module.css";
import {
  MdOutlineArrowForwardIos,
  MdOutlineArrowBackIos,
} from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import { parseISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
  GetAppointmentSlotDto,
  fetchAppointmentsSlots,
  ConfirmAppointmentSlot,
  CreateAppointmentSlot,
  AppointmentDto,
  getTeacherId,
  getTeacherAppointmentDetail,
  TeacherAppointmentDetailDto,
} from "../../../services/AppointmentService";
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

export default function Appointment() {
  const [appointments, setAppointments] = useState<GetAppointmentSlotDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] =
    useState<GetAppointmentSlotDto | null>(null);
  const [createSlotState, setCreateSlotState] = useState(false);
  const [appointmentData, setAppointmentData] = useState<
    TeacherAppointmentDetailDto[]
  >([]);

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

  const [newSlot, setNewSlot] = useState<AppointmentDto>({
    availableDate: "",
    startTime: "",
    endTime: "",
    supervisionModel: "Onsite",
    location: "",
    remark: "",
    maxStudent: 1,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const teacherId = await getTeacherId();
        const data = await fetchAppointmentsSlots(teacherId);
        const appointmentRes = await getTeacherAppointmentDetail();
        setAppointmentData(appointmentRes);
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
    setCreateSlotState(false);
  }

  function handleCreateSlot() {
    if (!selectedDate) return;

    setNewSlot({
      // teacherId: 1,
      availableDate: format(selectedDate, "yyyy-MM-dd"),
      startTime: "",
      endTime: "",
      supervisionModel: "Onsite",
      location: "",
      remark: "",
      maxStudent: 1,
    });

    setCreateSlotState(true);
  }

  async function handleSaveSlot() {
    try {
      await CreateAppointmentSlot(newSlot);

      alert("สร้างช่วงเวลาสำเร็จ");

      setCreateSlotState(false);

      // โหลดข้อมูลใหม่
      const data = await fetchAppointmentsSlots(1);
      setAppointments(data);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  }
  async function confirmAppointment(appointmentId: number) {
    try {
      await ConfirmAppointmentSlot(appointmentId);

      alert("ยืนยันการนัดหมายสำเร็จ");

      // โหลดข้อมูลใหม่เพื่ออัปเดตสถานะ
      const data = await getTeacherAppointmentDetail();

      setAppointmentData(data);
    } catch (error) {
      console.error("Confirm appointment failed:", error);

      alert("ยืนยันการนัดหมายไม่สำเร็จ");
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
        `}
                  onClick={() => handleDateClick(date)}
                >
                  <span>{format(date, "d")}</span>

                  <div className={styles.status}>
                    {slot?.slotStatus === "Available" && (
                      <span className={`${styles.dot} ${styles.available}`} />
                    )}

                    {slot && slot.bookedStudents > 0 && (
                      <span className={`${styles.dot} ${styles.booked}`} />
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
              <span className={`${styles.dot} ${styles.booked}`} />
              <span>มีนัดหมาย</span>
            </div>
          </div>
        </div>

        <div className={styles.appointmentContainer}>
          {createSlotState ? (
            <div className={styles.appointmentHeader}>
              <h1>เพิ่มเวลานัดหมาย</h1>
            </div>
          ) : (
            <div className={styles.appointmentHeader}>
              <h1>รายละเอียดการนัดหมาย</h1>
              <h2>{selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""}</h2>
            </div>
          )}
          {!createSlotState ? (
            <div className={styles.appointmentCard}>
              {selectedAppointments.length === 0 ? (
                <div className={styles.emptyCard}>ยังไม่มีช่วงเวลานัดหมาย</div>
              ) : (
                selectedAppointments.map((slot) => (
                  <div key={slot.slotId}>
                    <div onClick={() => setSelectedSlot(slot)}>
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
                        <b>จำนวนรับ :</b> {slot.bookedStudents}/
                        {slot.maxStudents}
                      </div>

                      <div>
                        <b>หมายเหตุ :</b> {slot.remark || "-"}
                      </div>
                    </div>
                    {appointmentData.length > 0 &&
                      appointmentData
                        .filter(
                          (appointment) => appointment.slotId === slot.slotId,
                        )
                        .map((appointment) => (
                          <div
                            key={appointment.appointmentId}
                            className={styles.bookingCard}
                          >
                            <div>
                              <b>นักศึกษา :</b> {appointment.studentName}
                            </div>

                            <div>
                              <b>สถานะ :</b> {appointment.appointmentStatus}
                            </div>

                            <div>
                              <b>วันที่จอง :</b>{" "}
                              {new Date(
                                appointment.bookedAt!,
                              ).toLocaleDateString("th-TH")}
                            </div>

                            {appointment.appointmentStatus !== "Confirmed" && (
                              <button
                                className={styles.confirmButton}
                                onClick={() =>
                                  confirmAppointment(appointment.appointmentId)
                                }
                              >
                                ยืนยันการนัดหมาย
                              </button>
                            )}
                          </div>
                        ))}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className={styles.appointmentCard}>
              <div className={styles.formGroup}>
                <label>วันที่ : </label>
                <input
                  type="text"
                  value={
                    newSlot.availableDate
                      ? format(parseISO(newSlot.availableDate), "dd/MM/yyyy")
                      : ""
                  }
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <label>ช่วงเวลา</label>
                <div className={styles.timeInputs}>
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) =>
                      setNewSlot({
                        ...newSlot,
                        startTime: e.target.value,
                      })
                    }
                  />
                  <span> - </span>
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) =>
                      setNewSlot({
                        ...newSlot,
                        endTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>รูปแบบการนิเทศ</label>
                <div className={styles.supervisionGroup}>
                  {["Onsite", "Online", "Hybrid"].map((model) => (
                    <button
                      key={model}
                      type="button"
                      className={`${styles.supervisionButton} ${
                        newSlot.supervisionModel === model ? styles.active : ""
                      }`}
                      onClick={() =>
                        setNewSlot({
                          ...newSlot,
                          supervisionModel:
                            model as AppointmentDto["supervisionModel"],
                        })
                      }
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>สถานที่</label>
                <textarea
                  value={newSlot.location ?? ""}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>รับนักศึกษา</label>

                <div className={styles.maxStudentGroup}>
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`${styles.maxStudentButton} ${
                        newSlot.maxStudent === num ? styles.active : ""
                      }`}
                      onClick={() =>
                        setNewSlot({
                          ...newSlot,
                          maxStudent: num,
                        })
                      }
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>หมายเหตุ</label>

                <textarea
                  value={newSlot.remark ?? ""}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      remark: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setCreateSlotState(false)}
                >
                  ยกเลิก
                </button>

                <button
                  type="button"
                  className={styles.saveButton}
                  onClick={handleSaveSlot}
                >
                  บันทึก
                </button>
              </div>
            </div>
          )}
          <div>
            {!createSlotState ? (
              <button
                className={styles.CreateButton}
                onClick={handleCreateSlot}
              >
                เพิ่มช่วงเวลานัดหมาย
              </button>
            ) : (
              <></>
            )}
          </div>
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
