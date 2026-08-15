
'use client';
import { useEffect, useState } from 'react';
import styles from './StudentCo-operative.module.css';
// import NavigationDualBar from '@/components/layout/NavigationDualBar';
import {
    fetchCompanyList,
    fetchStudentCoopInfo,
    addCompany,
    updateCompany,
    fetchMentorList,
    assignMentor,
    updateMentor,
    assignStudentPlacement,
    updateStudentPlacement,
    // GetStudentId,
    type CompanyListItem,
    type CompanyUpdatePayload,
    type MentorUpdatePayload,
    type Mentors,
    type coop,
    type Placement,
} from '@/services/coopService';

interface CompanyFormState {
    CompanyName: string;
    Phone: string;
    Fax: string;
    Email: string;
    HrName: string;
    Address: string;
}

const emptyCompanyForm: CompanyFormState = {
    CompanyName: '',
    Phone: '',
    Fax: '',
    Email: '',
    HrName: '',
    Address: '',
};

interface MentorFormState {
    FirstName: string;
    LastName: string;
    Position: string;
    Department: string;
    Phone: string;
    Email: string;
}

const emptyMentorForm: MentorFormState = {
    FirstName: '',
    LastName: '',
    Position: '',
    Department: '',
    Phone: '',
    Email: '',
};

interface JobFormState {
    JobTitle: string;
    JobDescription: string;
    StartDate: string; // yyyy-mm-dd, matches <input type="date">
    EndDate: string;
    AcademicYear: string;
}

const emptyJobForm: JobFormState = {
    JobTitle: '',
    JobDescription: '',
    StartDate: '',
    EndDate: '',
    AcademicYear: '',
};

type CompanyEntryMode = 'select' | 'add';
type MentorEntryMode = 'select' | 'add';

interface CompanyFieldProps {
    label: string;
    value?: string | null;
    isDropdown?: boolean;
    companyList?: CompanyListItem[];
    menntorList?: Mentors[];
    editable?: boolean;
    inputType?: string;
    onChange?: (value: string) => void;
}

const CompanyField = ({ label, value, isDropdown, companyList, menntorList, editable = false, inputType = "text", onChange }: CompanyFieldProps) => {
    const displayValue = value ?? "-";

    return isDropdown ? (
        <div className={styles.companyField}>
            <h3 className={styles.companyCardContentTitle}>{label}</h3>

            {companyList && companyList.length > 0 ?
                (
                    <select
                        className={styles.companyCardContentInput}
                        value={value ?? ""}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={!editable}
                    >
                        <option value="">-- เลือกสถานประกอบการ --</option>
                        {companyList?.map((item) => (
                            <option key={item.companyId} value={item.companyId}>
                                {item.companyName}
                            </option>
                        ))}
                    </select>
                ) : menntorList && menntorList.length > 0 ? (
                    <select
                        className={styles.companyCardContentInput}
                        value={value ?? ""}
                        onChange={(e) => onChange?.(e.target.value)}
                        disabled={!editable}
                    >
                        <option value="">-- เลือกพี่เลี้ยง --</option>
                        {menntorList?.map((item) => (
                            <option key={item.mentorId} value={item.mentorId}>
                                {item.firstName} {item.lastName}
                            </option>
                        ))}
                    </select>
                ) : (
                    <p className={styles.companyCardContentInput}>ไม่มีข้อมูล</p>
                )}
        </div>
    ) : (
        <div className={styles.companyField}>
            <h3 className={styles.companyCardContentTitle}>{label}</h3>
            <input
                className={styles.companyCardContentInput}
                type={inputType}
                value={editable ? value ?? "" : displayValue}
                readOnly={!editable}
                onChange={(e) => onChange?.(e.target.value)}
            />
        </div>
    );
};

export default function StudentCooperative() {
    // ----- core data -----
    // const [studentId, setStudentId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [existingCoop, setExistingCoop] = useState<boolean>(false);
    const [existingMentor, setExistingMentor] = useState<boolean>(false);
    const [companyInfo, setCompanyInfo] = useState<coop | null>(null);
    const [mentorInfo, setMentorInfo] = useState<Mentors | null>(null);

    // ----- lists used for selection -----
    const [companyList, setCompanyList] = useState<CompanyListItem[]>([]);
    const [mentorList, setMentorList] = useState<Mentors[]>([]);

    // ----- step 1: register placement (company + job info) -----
    const [companyMode, setCompanyMode] = useState<CompanyEntryMode>('select');
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const [newCompanyForm, setNewCompanyForm] = useState<CompanyFormState>(emptyCompanyForm);
    const [jobForm, setJobForm] = useState<JobFormState>(emptyJobForm);

    // ----- step 2: assign mentor (only available once placement exists) -----
    const [mentorMode, setMentorMode] = useState<MentorEntryMode>('select');
    const [selectedMentorId, setSelectedMentorId] = useState<number | null>(null);
    const [newMentorForm, setNewMentorForm] = useState<MentorFormState>(emptyMentorForm);

    // ----- step 3: edit everything (only available once company + mentor exist) -----
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editCompanyForm, setEditCompanyForm] = useState<CompanyUpdatePayload | null>(null);
    const [editMentorForm, setEditMentorForm] = useState<MentorUpdatePayload | null>(null);
    const [editJobForm, setEditJobForm] = useState<JobFormState>(emptyJobForm);

    const canEdit = existingCoop && existingMentor;
    const toDateInputValue = (value: unknown): string => {
        if (!value) return '';
        const d = new Date(value as string | number | Date);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().slice(0, 10);
    };

    const formatDateDisplay = (value: unknown): string => {
        if (!value) return '-';
        const d = new Date(value as string | number | Date);
        if (isNaN(d.getTime())) return String(value);
        return d.toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    function toDateString(date: Date | string | null | undefined): string {
        if (!date) return "";

        if (typeof date === "string") {
            const trimmed = date.trim();
            if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
                return trimmed;
            }

            const [day, month, year] = trimmed.split(/[\/\-]/).map((part) => Number(part));
            if ([day, month, year].some((part) => Number.isNaN(part))) {
                return "";
            }

            const normalizedYear = year < 100 ? year + 543 : year;
            return `${normalizedYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }

        const d = date;
        if (isNaN(d.getTime())) return "";
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        //return `${year}-${month}-${day}`;
        return `${day}-${month}-${year}`;
    }
    // ---------- load / refresh data ----------
    const loadData = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            // const id = await GetStudentId();
            // setStudentId(id);

            const checkExisting = await fetchStudentCoopInfo();

            if (!checkExisting.isError && checkExisting.data?.coop != null) {
                const coopData = checkExisting.data.coop;
                setExistingCoop(true);
                setCompanyInfo(coopData);

                if (coopData.mentor != null) {
                    setExistingMentor(true);
                    setMentorInfo(coopData.mentor);
                    setMentorList([]);
                } else {
                    setExistingMentor(false);
                    setMentorInfo(null);
                    const mentorListResponse = await fetchMentorList(coopData.companyId);
                    if (!mentorListResponse.isError) {
                        setMentorList(mentorListResponse.data);
                    }
                }
            } else {
                setExistingCoop(false);
                setExistingMentor(false);
                setCompanyInfo(null);
                setMentorInfo(null);

                const companyListResponse = await fetchCompanyList();
                if (!companyListResponse.isError) {
                    setCompanyList(companyListResponse.data);
                }
            }
        } catch{
            setErrorMsg('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadData();
    }, []);

    // ---------- step 1: save company + placement ----------
    const toggleCompanyMode = () => {
        setErrorMsg(null);
        setCompanyMode((prev) => (prev === 'select' ? 'add' : 'select'));
        setSelectedCompanyId(null);
        setNewCompanyForm(emptyCompanyForm);
    };

    const handleSaveCompanyAndPlacement = async () => {
        setErrorMsg(null);

        if (companyMode === 'add') {
            if (!newCompanyForm.CompanyName.trim()) {
                setErrorMsg('กรุณากรอกชื่อสถานประกอบการ');
                return;
            }
        } else if (!selectedCompanyId) {
            setErrorMsg('กรุณาเลือกสถานประกอบการ หรือเพิ่มสถานประกอบการใหม่');
            return;
        }

        if (!jobForm.JobTitle.trim() || !jobForm.StartDate || !jobForm.EndDate || !jobForm.AcademicYear.trim()) {
            setErrorMsg('กรุณากรอกรายละเอียดงานให้ครบถ้วน (ตำแหน่งงาน, วันที่เริ่ม-สิ้นสุด, ปีการศึกษา)');
            return;
        }

        setSaving(true);
        try {
            let companyId: number | null;

            if (companyMode === 'add') {
                const addRes = await addCompany(newCompanyForm);
                if (addRes.success) {
                    setErrorMsg(addRes.message || 'เพิ่มสถานประกอบการไม่สำเร็จ');
                    return;
                }
                companyId = addRes.companyId;
            } else {
                companyId = selectedCompanyId;
            }

            if (companyId == null) {
                setErrorMsg('ไม่พบรหัสสถานประกอบการ กรุณาลองใหม่อีกครั้ง');
                return;
            }

            const placementPayload: Placement = {
                CompanyId: companyId,
                JobTitle: jobForm.JobTitle,
                JobDescription: jobForm.JobDescription,
                StartDate: toDateString(jobForm.StartDate),
                EndDate: toDateString(jobForm.EndDate),
                AcademicYear: jobForm.AcademicYear,
            };

            const placementRes = await assignStudentPlacement(placementPayload);
            if (placementRes.isError) {
                setErrorMsg(placementRes.message || 'บันทึกข้อมูลสถานประกอบการไม่สำเร็จ');
                return;
            }

            setCompanyMode('select');
            setSelectedCompanyId(null);
            setNewCompanyForm(emptyCompanyForm);
            setJobForm(emptyJobForm);

            await loadData();
        } catch{
            setErrorMsg('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setSaving(false);
        }
    };

    // ---------- step 2: save mentor ----------
    const toggleMentorMode = () => {
        setErrorMsg(null);
        setMentorMode((prev) => (prev === 'select' ? 'add' : 'select'));
        setSelectedMentorId(null);
        setNewMentorForm(emptyMentorForm);
    };

    const handleSaveMentor = async () => {
        if (!companyInfo) return;
        setErrorMsg(null);

        if (mentorMode === 'add') {
            if (!newMentorForm.FirstName.trim() || !newMentorForm.LastName.trim()) {
                setErrorMsg('กรุณากรอกชื่อ-นามสกุลพี่เลี้ยง');
                return;
            }
        } else if (!selectedMentorId) {
            setErrorMsg('กรุณาเลือกพี่เลี้ยง หรือเพิ่มพี่เลี้ยงใหม่');
            return;
        }

        setSaving(true);
        try {
            let mentorId: number | null;

            if (mentorMode === 'add') {
                const assignRes = await assignMentor({
                    CompanyId: companyInfo.companyId,
                    FirstName: newMentorForm.FirstName,
                    LastName: newMentorForm.LastName,
                    Position: newMentorForm.Position,
                    Department: newMentorForm.Department,
                    Phone: newMentorForm.Phone,
                    Email: newMentorForm.Email,
                });
                if (assignRes.success) {
                    setErrorMsg(assignRes.message || 'เพิ่มพี่เลี้ยงไม่สำเร็จ');
                    return;
                }
                mentorId = assignRes.mentorId;
            } else {
                mentorId = selectedMentorId;
            }

            if (mentorId == null) {
                setErrorMsg('ไม่พบรหัสพี่เลี้ยง กรุณาลองใหม่อีกครั้ง');
                return;
            }

            const placementPayload: Placement = {
                CompanyId: companyInfo.companyId,
                MentorId: mentorId,
                JobTitle: companyInfo.jobTitle,
                JobDescription: companyInfo.jobDescription,
                StartDate: toDateString(companyInfo.startDate),
                EndDate: toDateString(companyInfo.endDate),
                AcademicYear: companyInfo.academicYear,
            };

            const updateRes = await updateStudentPlacement(placementPayload);
            if (updateRes.isError) {
                setErrorMsg(updateRes.message || 'บันทึกข้อมูลพี่เลี้ยงไม่สำเร็จ');
                return;
            }

            setMentorMode('select');
            setSelectedMentorId(null);
            setNewMentorForm(emptyMentorForm);

            await loadData();
        } catch{
            setErrorMsg('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setSaving(false);
        }
    };

    // ---------- step 3: edit everything ----------
    const handleStartEdit = () => {
        if (!companyInfo || !mentorInfo) return;
        setEditCompanyForm({
            CompanyId: companyInfo.companyId,
            CompanyName: companyInfo.companyName,
            Phone: companyInfo.companyPhone,
            Fax: companyInfo.companyFax,
            Email: companyInfo.companyEmail,
            HrName: companyInfo.hrName,
            Address: companyInfo.address,
        });
        setEditMentorForm({
            MentorId: mentorInfo.mentorId,
            CompanyId: companyInfo.companyId,
            FirstName: mentorInfo.firstName,
            LastName: mentorInfo.lastName,
            Position: mentorInfo.position,
            Department: mentorInfo.department,
            Phone: mentorInfo.mentorPhone,
            Email: mentorInfo.mentorEmail,
        });
        setEditJobForm({
            JobTitle: companyInfo.jobTitle,
            JobDescription: companyInfo.jobDescription,
            StartDate: toDateInputValue(companyInfo.startDate),
            EndDate: toDateInputValue(companyInfo.endDate),
            AcademicYear: companyInfo.academicYear,
        });
        setErrorMsg(null);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditCompanyForm(null);
        setEditMentorForm(null);
        setEditJobForm(emptyJobForm);
        setErrorMsg(null);
    };

    const handleSaveEdit = async () => {
        if (!editCompanyForm || !editMentorForm) return;

        if (!editJobForm.JobTitle.trim() || !editJobForm.StartDate || !editJobForm.EndDate || !editJobForm.AcademicYear.trim()) {
            setErrorMsg('กรุณากรอกรายละเอียดงานให้ครบถ้วน');
            return;
        }

        setSaving(true);
        setErrorMsg(null);
        try {
            const companyRes = await updateCompany(editCompanyForm);
            if (companyRes.isError) {
                setErrorMsg(companyRes.message || 'แก้ไขข้อมูลสถานประกอบการไม่สำเร็จ');
                return;
            }

            const mentorRes = await updateMentor(editMentorForm);
            if (mentorRes.isError) {
                setErrorMsg(mentorRes.message || 'แก้ไขข้อมูลพี่เลี้ยงไม่สำเร็จ');
                return;
            }

            const placementPayload: Placement = {
                CompanyId: editCompanyForm.CompanyId,
                MentorId: editMentorForm.MentorId,
                JobTitle: editJobForm.JobTitle,
                JobDescription: editJobForm.JobDescription,
                StartDate: toDateString(editJobForm.StartDate),
                EndDate: toDateString(editJobForm.EndDate),
                AcademicYear: editJobForm.AcademicYear,
            };

            const placementRes = await updateStudentPlacement(placementPayload);
            if (placementRes.isError) {
                setErrorMsg(placementRes.message || 'แก้ไขรายละเอียดงานไม่สำเร็จ');
                return;
            }

            setIsEditing(false);
            setEditCompanyForm(null);
            setEditMentorForm(null);
            setEditJobForm(emptyJobForm);

            await loadData();
        } catch{
            setErrorMsg('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setSaving(false);
        }
    };

    const handleCompanyFieldChange = (field: Exclude<keyof CompanyUpdatePayload, 'CompanyId'>, value: string) => {
        setEditCompanyForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleMentorFieldChange = (field: Exclude<keyof MentorUpdatePayload, 'MentorId' | 'CompanyId'>, value: string) => {
        setEditMentorForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleJobFieldChange = (field: keyof JobFormState, value: string) => {
        const normalizedValue = field === 'StartDate' || field === 'EndDate'
            ? toDateString(value)
            : value;

        if (!existingCoop) {
            setJobForm((prev) => ({ ...prev, [field]: normalizedValue }));
        } else if (isEditing) {
            setEditJobForm((prev) => ({ ...prev, [field]: normalizedValue }));
        }
    };

    // ---------- derived display values ----------
    const companyNameValue = isEditing ? (editCompanyForm?.CompanyName ?? '') : (companyInfo?.companyName ?? '');
    const companyHrNameValue = isEditing ? (editCompanyForm?.HrName ?? '') : (companyInfo?.hrName ?? '');
    const companyPhoneValue = isEditing ? (editCompanyForm?.Phone ?? '') : (companyInfo?.companyPhone ?? '');
    const companyFaxValue = isEditing ? (editCompanyForm?.Fax ?? '') : (companyInfo?.companyFax ?? '');
    const companyEmailValue = isEditing ? (editCompanyForm?.Email ?? '') : (companyInfo?.companyEmail ?? '');
    const companyAddressValue = isEditing ? (editCompanyForm?.Address ?? '') : (companyInfo?.address ?? '');

    const mentorFirstNameValue = isEditing ? (editMentorForm?.FirstName ?? '') : (mentorInfo?.firstName ?? '');
    const mentorLastNameValue = isEditing ? (editMentorForm?.LastName ?? '') : (mentorInfo?.lastName ?? '');
    const mentorPositionValue = isEditing ? (editMentorForm?.Position ?? '') : (mentorInfo?.position ?? '');
    const mentorDepartmentValue = isEditing ? (editMentorForm?.Department ?? '') : (mentorInfo?.department ?? '');
    const mentorEmailValue = isEditing ? (editMentorForm?.Email ?? '') : (mentorInfo?.mentorEmail ?? '');
    const mentorPhoneValue = isEditing ? (editMentorForm?.Phone ?? '') : (mentorInfo?.mentorPhone ?? '');

    const jobEditable = !existingCoop || isEditing;
    const jobTitleValue = !existingCoop ? jobForm.JobTitle : isEditing ? editJobForm.JobTitle : (companyInfo?.jobTitle ?? '');
    const jobDescriptionValue = !existingCoop ? jobForm.JobDescription : isEditing ? editJobForm.JobDescription : (companyInfo?.jobDescription ?? '');
    const academicYearValue = !existingCoop ? jobForm.AcademicYear : isEditing ? editJobForm.AcademicYear : (companyInfo?.academicYear ?? '');
    const startDateValue = jobEditable
        ? (!existingCoop ? jobForm.StartDate : editJobForm.StartDate)
        : formatDateDisplay(companyInfo?.startDate);
    const endDateValue = jobEditable
        ? (!existingCoop ? jobForm.EndDate : editJobForm.EndDate)
        : formatDateDisplay(companyInfo?.endDate);

    return (
        <div className={styles.page}>
            <section className={styles.welcomeContent}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h1 className={styles.welcomeTitle}>ข้อมูลสถานสหกิจ</h1>
                        <p className={styles.welcomeSubtitle}>ดูรายละเอียดสถานประกอบการที่ปฏิบัติงาน</p>
                    </div>
                </div>
            </section>
            <section className={styles.content}>
                <section>
                    <div>
                        {/* <NavigationDualBar
                            leftLabel="หน้าหลัก"
                            leftHref="/dashboard"
                            rightLabel="นัดหมายวันนิเทศ"
                            rightHref="/#schedule"
                        /> */}
                    </div>
                </section>

                {errorMsg && (
                    <p style={{ color: '#dc2626', fontSize: 14, margin: 0 }}>{errorMsg}</p>
                )}

                {loading ? (
                    <p className={styles.welcomeSubtitle}>กำลังโหลดข้อมูล...</p>
                ) : (
                    <>
                        <section className={styles.coopAndMentorInfo}>
                            <div className={styles.topButton}>
                                {!existingCoop ? (
                                    <div className={styles.buttonLayer}>
                                        <button className={styles.editButton} onClick={toggleCompanyMode} disabled={saving}>
                                            {companyMode === 'select' ? 'เพิ่มสถานประกอบการใหม่' : 'เลือกจากรายการ'}
                                        </button>
                                        <button className={styles.saveButton} onClick={handleSaveCompanyAndPlacement} disabled={saving}>
                                            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                                        </button>
                                    </div>
                                ) : canEdit ? (
                                    <div className={styles.buttonLayer}>
                                        {!isEditing ? (
                                            <button className={styles.editButton} onClick={handleStartEdit}>แก้ไข</button>
                                        ) : (
                                            <>
                                                <button className={styles.saveButton} onClick={handleSaveEdit} disabled={saving}>
                                                    {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                                                </button>
                                                <button className={styles.cancelButton} onClick={handleCancelEdit} disabled={saving}>ยกเลิก</button>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                                <div className={styles.flexInfomation}>
                                    <section className={styles.coopInfoContent}>
                                        <div>
                                            <div className={styles.coopInfoAndbutton}>
                                                <h2 className={styles.coopInfoTitle}>ข้อมูลสถานสหกิจ</h2>
                                            </div>
                                            {existingCoop ? (
                                                <div className={styles.coopInfoDetail}>
                                                    <div className={styles.coopInfoContentRow1}>
                                                        <CompanyField label="ชื่อสถานประกอบการ" value={companyNameValue} isDropdown={false} editable={isEditing} onChange={(v) => handleCompanyFieldChange('CompanyName', v)} />
                                                        <CompanyField label="ชื่อผู้ประสานงาน" value={companyHrNameValue} isDropdown={false} editable={isEditing} onChange={(v) => handleCompanyFieldChange('HrName', v)} />
                                                    </div>
                                                    <div className={styles.coopInfoContentRow2}>
                                                        <CompanyField label="เบอร์โทรศัพท์" value={companyPhoneValue} isDropdown={false} editable={isEditing} inputType="tel" onChange={(v) => handleCompanyFieldChange('Phone', v)} />
                                                        <CompanyField label="แฟกซ์" value={companyFaxValue} isDropdown={false} editable={isEditing} onChange={(v) => handleCompanyFieldChange('Fax', v)} />
                                                    </div>
                                                    <div className={styles.coopInfoContentRow3}>
                                                        <CompanyField label="อีเมล" value={companyEmailValue} isDropdown={false} editable={isEditing} inputType="email" onChange={(v) => handleCompanyFieldChange('Email', v)} />
                                                        <CompanyField label="ที่อยู่" value={companyAddressValue} isDropdown={false} editable={isEditing} onChange={(v) => handleCompanyFieldChange('Address', v)} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={styles.coopInfoDetail}>
                                                    {companyMode === 'select' ? (
                                                        <CompanyField
                                                            label="ชื่อสถานประกอบการ (หากไม่มีรายชื่อสถานประกอบการนักศึกษาสามารถเพิ่มข้อมูล)"
                                                            value={selectedCompanyId ? String(selectedCompanyId) : ''}
                                                            isDropdown={true}
                                                            editable={true}
                                                            companyList={companyList}
                                                            onChange={(v) => setSelectedCompanyId(v ? parseInt(v, 10) : null)}
                                                        />
                                                    ) : (
                                                        <>
                                                            <div className={styles.coopInfoContentRow1}>
                                                                <CompanyField label="ชื่อสถานประกอบการ" value={newCompanyForm.CompanyName} editable onChange={(v) => setNewCompanyForm((p) => ({ ...p, CompanyName: v }))} />
                                                                <CompanyField label="ชื่อผู้ประสานงาน" value={newCompanyForm.HrName} editable onChange={(v) => setNewCompanyForm((p) => ({ ...p, HrName: v }))} />
                                                            </div>
                                                            <div className={styles.coopInfoContentRow2}>
                                                                <CompanyField label="เบอร์โทรศัพท์" value={newCompanyForm.Phone} editable inputType="tel" onChange={(v) => setNewCompanyForm((p) => ({ ...p, Phone: v }))} />
                                                                <CompanyField label="แฟกซ์" value={newCompanyForm.Fax} editable onChange={(v) => setNewCompanyForm((p) => ({ ...p, Fax: v }))} />
                                                            </div>
                                                            <div className={styles.coopInfoContentRow3}>
                                                                <CompanyField label="อีเมล" value={newCompanyForm.Email} editable inputType="email" onChange={(v) => setNewCompanyForm((p) => ({ ...p, Email: v }))} />
                                                                <CompanyField label="ที่อยู่" value={newCompanyForm.Address} editable onChange={(v) => setNewCompanyForm((p) => ({ ...p, Address: v }))} />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    {existingCoop ? (
                                        <>
                                            <span className={styles.divider1}></span>
                                            <section className={styles.mentorInfoContent}>
                                                <div>
                                                    <div className={styles.flexinfoMentorTop}>
                                                        <h2 className={styles.mentorInfoTitle}>ข้อมูลพี่เลี้ยง</h2>
                                                        {!existingMentor ?(
                                                        <div className={styles.buttonLayer}>
                                                            <button className={styles.editButton} onClick={toggleMentorMode} disabled={saving}>
                                                                {mentorMode === 'select' ? 'เพิ่มพี่เลี้ยงใหม่' : 'เลือกจากรายการ'}
                                                            </button>
                                                            <button className={styles.saveButton} onClick={handleSaveMentor} disabled={saving}>
                                                                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                                                            </button>
                                                        </div>
                                                        ):(
                                                            <div></div>
                                                        )}
                                                    </div>
                                                    {existingMentor ? (
                                                        <div className={styles.mentorInfoDetail}>
                                                            <div className={styles.mentorInfoContentRow1}>
                                                                <CompanyField label="ชื่อ" value={mentorFirstNameValue} isDropdown={false} editable={isEditing} onChange={(v) => handleMentorFieldChange('FirstName', v)} />
                                                                <CompanyField label="นามสกุล" value={mentorLastNameValue} isDropdown={false} editable={isEditing} onChange={(v) => handleMentorFieldChange('LastName', v)} />
                                                            </div>
                                                            <div className={styles.mentorInfoContentRow2}>
                                                                <CompanyField label="ตำแหน่ง" value={mentorPositionValue} isDropdown={false} editable={isEditing} onChange={(v) => handleMentorFieldChange('Position', v)} />
                                                                <CompanyField label="แผนก" value={mentorDepartmentValue} isDropdown={false} editable={isEditing} onChange={(v) => handleMentorFieldChange('Department', v)} />
                                                            </div>
                                                            <div className={styles.mentorInfoContentRow3}>
                                                                <CompanyField label="อีเมล" value={mentorEmailValue} isDropdown={false} editable={isEditing} inputType="email" onChange={(v) => handleMentorFieldChange('Email', v)} />
                                                                <CompanyField label="เบอร์โทรศัพท์" value={mentorPhoneValue} isDropdown={false} editable={isEditing} inputType="tel" onChange={(v) => handleMentorFieldChange('Phone', v)} />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={styles.flexMentorInfo}>
                                                            <div className={styles.mentorInfoDetail}>
                                                                {mentorMode === 'select' ? (
                                                                    <CompanyField
                                                                        label="พี่เลี้ยง"
                                                                        value={selectedMentorId ? String(selectedMentorId) : ''}
                                                                        isDropdown={true}
                                                                        menntorList={mentorList}
                                                                        editable={true}
                                                                        onChange={(v) => setSelectedMentorId(v ? parseInt(v, 10) : null)}
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        <div className={styles.mentorInfoContentRow1}>
                                                                            <CompanyField label="ชื่อ" value={newMentorForm.FirstName} editable onChange={(v) => setNewMentorForm((p) => ({ ...p, FirstName: v }))} />
                                                                            <CompanyField label="นามสกุล" value={newMentorForm.LastName} editable onChange={(v) => setNewMentorForm((p) => ({ ...p, LastName: v }))} />
                                                                        </div>
                                                                        <div className={styles.mentorInfoContentRow2}>
                                                                            <CompanyField label="ตำแหน่ง" value={newMentorForm.Position} editable onChange={(v) => setNewMentorForm((p) => ({ ...p, Position: v }))} />
                                                                            <CompanyField label="แผนก" value={newMentorForm.Department} editable onChange={(v) => setNewMentorForm((p) => ({ ...p, Department: v }))} />
                                                                        </div>
                                                                        <div className={styles.mentorInfoContentRow3}>
                                                                            <CompanyField label="อีเมล" value={newMentorForm.Email} editable inputType="email" onChange={(v) => setNewMentorForm((p) => ({ ...p, Email: v }))} />
                                                                            <CompanyField label="เบอร์โทรศัพท์" value={newMentorForm.Phone} editable inputType="tel" onChange={(v) => setNewMentorForm((p) => ({ ...p, Phone: v }))} />
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </section>
                                        </>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <span className={styles.divider2}></span>
                        <section className={styles.jobInfoContent}>
                            <div>
                                <h2 className={styles.jobInfoTitle}>รายละเอียดงาน</h2>
                                <div className={styles.jobInfoDetail}>
                                    <div className={styles.jobInfoContentRow1}>
                                        <CompanyField label="ตำแหน่งงาน" value={jobTitleValue} isDropdown={false} editable={jobEditable} onChange={(v) => handleJobFieldChange('JobTitle', v)} />
                                        <CompanyField label="วันที่เริ่มงาน" value={startDateValue} isDropdown={false} editable={jobEditable} inputType={jobEditable ? 'date' : 'text'} onChange={(v) => handleJobFieldChange('StartDate', v)} />
                                        <CompanyField label="วันที่สิ้นสุดงาน" value={endDateValue} isDropdown={false} editable={jobEditable} inputType={jobEditable ? 'date' : 'text'} onChange={(v) => handleJobFieldChange('EndDate', v)} />
                                        <CompanyField label="ปีการศึกษา" value={academicYearValue} isDropdown={false} editable={jobEditable} onChange={(v) => handleJobFieldChange('AcademicYear', v)} />
                                    </div>
                                    <div className={styles.jobInfoContentRow2}>
                                        <CompanyField label="รายละเอียดงาน" value={jobDescriptionValue} isDropdown={false} editable={jobEditable} onChange={(v) => handleJobFieldChange('JobDescription', v)} />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </section>
        </div >
    );
}