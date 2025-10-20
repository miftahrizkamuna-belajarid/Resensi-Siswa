export enum View {
  Dashboard = 'DASHBOARD',
  StudentData = 'DATA_SISWA',
  AddStudent = 'TAMBAH_SISWA',
  ImportStudents = 'IMPOR_SISWA',
  DailyAttendance = 'ABSENSI_HARIAN',
  Reports = 'REKAPITULASI',
}

export type Student = {
  id: string;
  nomor: string;
  nama: string;
  kelas: string;
};

export type AttendanceStatus = 'Hadir' | 'Sakit' | 'Izin' | 'Alfa';

export type AttendanceRecord = {
  studentId: string;
  studentName: string;
  kelas: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
};
