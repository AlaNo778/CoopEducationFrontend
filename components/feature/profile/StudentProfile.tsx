'use client'
import { useEffect, useState } from "react";
import type { UserInfo } from "@/lib/auth";
import type { MajorListItem, StudentData, UpdateStudentPayload } from "@/services/ProfileService";
import styles from "./StudentProfile.module.css";
import { fetchStudentProfile, fetchMajorList, updateStudent } from "@/services/ProfileService";

type Props = {
  userInfo: UserInfo | null;
};

interface EditableStudentData extends StudentData {
  majorId?: number;
}

interface ProfileFieldProps {
  label: string;
  value?: string | null;
  isDropdown?: boolean;
  list?: MajorListItem[];
  editable?: boolean;
  inputType?: string;
  onChange?: (value: string) => void;
}

const ProfileField = ({ label, value, isDropdown, list, editable = false, inputType = "text", onChange }: ProfileFieldProps) => {
  const displayValue = value ?? "-";

  return isDropdown ? (
    <div className={styles.profileField}>
      <h3 className={styles.profileCardContentTitle}>{label}</h3>
      <select
        className={styles.profileCardContentInput}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={!editable}
      >
        {list?.map((item) => (
          <option key={item.majorId} value={item.majorId}>
            {item.majorName}
          </option>
        ))}
      </select>
    </div>
  ) : (
    <div className={styles.profileField}>
      <h3 className={styles.profileCardContentTitle}>{label}</h3>
      <input
        className={styles.profileCardContentInput}
        type={inputType}
        value={editable ? value ?? "" : displayValue}
        readOnly={!editable}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

export default function StudentProfile({ userInfo }: Props) {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [draftData, setDraftData] = useState<EditableStudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [majorList, setMajorList] = useState<MajorListItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [response, majorResponse] = await Promise.all([fetchStudentProfile(), fetchMajorList()]);

        if (!majorResponse.isError) {
          setMajorList(majorResponse.data);
        } else {
          console.error("Failed to load major list:", majorResponse.message);
        }

        if (!response.isError) {
          const initialData = response.data;
          const initialDraft: EditableStudentData = {
            ...initialData,
            majorId: majorResponse.isError
              ? undefined
              : majorResponse.data.find((item) => item.majorName === initialData.majorName)?.majorId,
          };
          setStudentData(initialData);
          setDraftData(initialDraft);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
        console.error("Failed to load student profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateDraftField = (field: keyof EditableStudentData, value: string) => {
    setDraftData((current) => {
      if (!current) return current;

      if (field === "majorId" || field === "gpax" || field === "totalCredits") {
        return { ...current, [field]: Number(value) } as EditableStudentData;
      }

      return { ...current, [field]: value } as EditableStudentData;
    });
  };

  const handleEdit = () => {
    setError(null);
    if (studentData) {
      const nextDraft: EditableStudentData = {
        ...studentData,
        majorId: majorList.find((item) => item.majorName === studentData.majorName)?.majorId,
      };
      setDraftData(nextDraft);
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setError(null);
    if (studentData) {
      const nextDraft: EditableStudentData = {
        ...studentData,
        majorId: majorList.find((item) => item.majorName === studentData.majorName)?.majorId,
      };
      setDraftData(nextDraft);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!draftData) return;

    setIsSaving(true);
    setError(null);

    const payload: UpdateStudentPayload = {
      Info: {
        FirstName: draftData.firstName ?? "",
        LastName: draftData.lastName ?? "",
        MajorId: draftData.majorId ?? 0,
        Gpax: Number(draftData.gpax ?? 0),
        TotalCredits: Number(draftData.totalCredits ?? 0),
      },
      Contact: {
        Email: draftData.email ?? "",
        PhoneHome: draftData.phoneHome ?? "",
        PhoneMobile: draftData.phoneMobile ?? "",
        Facebook: draftData.facebook ?? "",
        LineId: draftData.lineId ?? "",
      },
      Address: {
        HouseNo: draftData.houseNo ?? "",
        VillageNo: draftData.villageNo ?? "",
        Alley: draftData.alley ?? "",
        Road: draftData.road ?? "",
        SubDistrict: draftData.subDistrict ?? "",
        District: draftData.district ?? "",
        Province: draftData.province ?? "",
        Postcode: draftData.postcode ?? "",
      },
    };

    try {
      const response = await updateStudent(payload);
      if (!response.isError) {
        const updatedStudent: StudentData = {
          ...draftData,
          majorName: majorList.find((item) => item.majorId === draftData.majorId)?.majorName ?? draftData.majorName,
        };
        const updatedFullName = `${updatedStudent.firstName ?? ""} ${updatedStudent.lastName ?? ""}`.trim();

        setStudentData(updatedStudent);
        setDraftData({ ...updatedStudent, majorId: draftData.majorId });
        setIsEditing(false);
        window.dispatchEvent(new CustomEvent("profile-updated", { detail: { fullName: updatedFullName } }));
        window.alert("อัปเดตข้อมูลสำเร็จแล้ว");
      } else {
        window.alert(response.message || "ไม่สามารถบันทึกข้อมูลได้");
      }
    } catch (err) {
      console.error("Failed to update student profile:", err);
      window.alert("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.page}>กำลังโหลดข้อมูล...</div>;
  }

  if (error && !studentData) {
    return <div className={styles.page}>เกิดข้อผิดพลาด: {error}</div>;
  }

  return (
    <div className={styles.page}>
      <section className={styles.welcomeContent}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderContent}>
            <h1 className={styles.welcomeTitle}>ข้อมูลโปรไฟล์</h1>
            <p className={styles.welcomeSubtitle}>จัดการข้อมูลส่วนตัวและข้อมูลติดต่อ</p>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <section className={styles.profileContent}>
          <div className={styles.profileCard}>
            <div className={styles.profileCardHeader}>
              <h2 className={styles.profileCardTitle}>ข้อมูลส่วนตัว</h2>
              {!isEditing ? (
                <button className={styles.editButton} onClick={handleEdit}>
                  แก้ไข
                </button>
              ) : (
                <div className={styles.actionButtons}>
                  <button className={styles.cancelButton} onClick={handleCancel} disabled={isSaving}>
                    ยกเลิก
                  </button>
                  <button className={styles.saveButton} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "กำลังบันทึก..." : "บันทึก"}
                  </button>
                </div>
              )}
            </div>
            <div className={styles.profileCardContent}>
              <div className={styles.profileCardContentRow1}>
                <ProfileField label="รหัสนักศึกษา" value={draftData?.studentCode} editable={false} />
                <ProfileField
                  label="ชื่อ"
                  value={draftData?.firstName}
                  editable={isEditing}
                  onChange={(value) => updateDraftField("firstName", value)}
                />
                <ProfileField
                  label="นามสกุล"
                  value={draftData?.lastName}
                  editable={isEditing}
                  onChange={(value) => updateDraftField("lastName", value)}
                />
              </div>
              <div className={styles.profileCardContentRow2}>
                <ProfileField
                  label="สาขาวิชา"
                  value={draftData?.majorId?.toString() ?? ""}
                  isDropdown
                  list={majorList}
                  editable={isEditing}
                  onChange={(value) => updateDraftField("majorId", value)}
                />
                <ProfileField label="คณะ" value={draftData?.faculty} editable={false} />
                <ProfileField
                  label="GPAX"
                  value={draftData?.gpax?.toString()}
                  editable={isEditing}
                  inputType="number"
                  onChange={(value) => updateDraftField("gpax", value)}
                />
                <ProfileField
                  label="หน่วยกิตสะสม"
                  value={draftData?.totalCredits?.toString()}
                  editable={isEditing}
                  inputType="number"
                  onChange={(value) => updateDraftField("totalCredits", value)}
                />
              </div>
            </div>
          </div>
        </section>
        <span className={styles.divider1}></span>
        <section className={styles.contactAndAddressContent}>
          <section className={styles.contactContent}>
            <div className={styles.contactCard}>
              <h2 className={styles.contactCardTitle}>ข้อมูลติดต่อ</h2>
              <div className={styles.contactCardContent}>
                <div className={styles.contactCardContentRow1}>
                  <ProfileField
                    label="อีเมล"
                    value={draftData?.email}
                    editable={isEditing}
                    onChange={(value) => updateDraftField("email", value)}
                  />
                </div>
                <div className={styles.contactCardContentRow2}>
                  <ProfileField
                    label="เบอร์โทรศัพท์มือถือ"
                    value={draftData?.phoneMobile}
                    editable={isEditing}
                    onChange={(value) => updateDraftField("phoneMobile", value)}
                  />
                  <ProfileField
                    label="เบอร์โทรศัพท์บ้าน"
                    value={draftData?.phoneHome}
                    editable={isEditing}
                    onChange={(value) => updateDraftField("phoneHome", value)}
                  />
                </div>
                <div className={styles.contactCardContentRow3}>
                  <ProfileField
                    label="Facebook"
                    value={draftData?.facebook}
                    editable={isEditing}
                    onChange={(value) => updateDraftField("facebook", value)}
                  />
                  <ProfileField
                    label="Line ID"
                    value={draftData?.lineId}
                    editable={isEditing}
                    onChange={(value) => updateDraftField("lineId", value)}
                  />
                </div>
              </div>
            </div>
          </section>
          <span className={styles.divider2}></span>
          <section className={styles.AddressContent}>
            <div className={styles.AddressCard}>
              <h2 className={styles.AddressCardTitle}>ที่อยู่</h2>
              <div className={styles.AddressCardContent}>
                <div className={styles.AddressCardContentRow1}>
                  <ProfileField
                    label="บ้านเลขที่"
                    value={draftData?.houseNo}
                    editable={isEditing}
                    onChange={(value) => updateDraftField("houseNo", value)}
                  />
                  <ProfileField
                    label="หมู่ที่"
                    value={draftData?.villageNo?.trim()}
                    editable={isEditing}
                    onChange={(value) => updateDraftField("villageNo", value)}
                  />
                  <ProfileField
                    label="ซอย"
                    value={draftData?.alley ?? "-"}
                    editable={isEditing}
                    onChange={(value) => updateDraftField("alley", value)}
                  />
                </div>
                <div className={styles.AddressCardContentRow2}>
                  <ProfileField
                    label="ถนน"
                    value={draftData?.road ?? "-"}
                    editable={isEditing}
                    onChange={(value) => updateDraftField("road", value)}
                  />
                  <ProfileField
                    label="ตำบล"
                    value={draftData?.subDistrict}
                    editable={isEditing}
                    onChange={(value) => updateDraftField("subDistrict", value)}
                  />
                  <ProfileField
                    label="อำเภอ"
                    value={draftData?.district}
                    editable={isEditing}
                    onChange={(value) => updateDraftField("district", value)}
                  />
                </div>
                <div className={styles.AddressCardContentRow3}>
                  <ProfileField
                    label="จังหวัด"
                    value={draftData?.province}
                    editable={isEditing}
                    onChange={(value) => updateDraftField("province", value)}
                  />
                  <ProfileField
                    label="รหัสไปรษณีย์"
                    value={draftData?.postcode?.trim()}
                    editable={isEditing}
                    onChange={(value) => updateDraftField("postcode", value)}
                  />
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>
    </div>
  );
}