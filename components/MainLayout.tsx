import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import StudentData from './StudentData';
import AddStudent from './AddStudent';
import ImportStudents from './ImportStudents';
import Reports from './Reports';
import DailyAttendance from './DailyAttendance'; // Impor komponen baru
import { View, Student, AttendanceRecord, AttendanceStatus } from '../types';
import { MenuIcon } from './icons/MenuIcon';

const initialStudents: Student[] = [
  { id: '1', nomor: '1001', nama: 'Budi Santoso', kelas: '10A' },
  { id: '2', nomor: '1002', nama: 'Citra Lestari', kelas: '10B' },
  { id: '3', nomor: '1003', nama: 'Doni Firmansyah', kelas: '10A' },
  { id: '4', nomor: '1004', nama: 'Eka Putri', kelas: '11A' },
  { id: '5', nomor: '1005', nama: 'Fajar Nugraha', kelas: '11B' },
  { id: '6', nomor: '1006', nama: 'Gita Amelia', kelas: '12A' },
  { id: '7', nomor: '1007', nama: 'Hendra Wijaya', kelas: '12B' },
  { id: '8', nomor: '1008', nama: 'Indah Permata', kelas: '10A' },
];

interface MainLayoutProps {
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // State for students with localStorage persistence
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const savedStudents = localStorage.getItem('students');
      return savedStudents ? JSON.parse(savedStudents) : initialStudents;
    } catch (error) {
      console.error("Failed to parse students from localStorage", error);
      return initialStudents;
    }
  });

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  // State for attendance records with localStorage persistence
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
     try {
      const savedRecords = localStorage.getItem('attendanceRecords');
      return savedRecords ? JSON.parse(savedRecords) : [];
    } catch (error) {
      console.error("Failed to parse attendance records from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);


  const addStudent = useCallback((student: Omit<Student, 'id'>) => {
    setStudents(prev => [...prev, { ...student, id: Date.now().toString() }]);
    setCurrentView(View.StudentData);
  }, []);

  const addStudentsBatch = useCallback((newStudents: Omit<Student, 'id'>[]) => {
    const studentsWithIds = newStudents.map((s, index) => ({ ...s, id: `${Date.now()}-${index}` }));
    setStudents(prev => [...prev, ...studentsWithIds]);
    setCurrentView(View.StudentData);
  }, []);

  const deleteStudent = useCallback((idToDelete: string) => {
    // Hapus siswa dari daftar siswa
    setStudents(prev => prev.filter(student => student.id !== idToDelete));
    // Hapus juga semua catatan absensi yang terkait dengan siswa tersebut
    setAttendanceRecords(prev => prev.filter(record => record.studentId !== idToDelete));
  }, []);

  const saveAttendance = useCallback((date: string, dailyRecords: Map<string, AttendanceStatus>) => {
    const otherDaysRecords = attendanceRecords.filter(r => r.date !== date);
    const newRecordsForDate: AttendanceRecord[] = [];
    
    students.forEach(student => {
      const status = dailyRecords.get(student.id);
      if (status) {
        newRecordsForDate.push({
          studentId: student.id,
          studentName: student.nama,
          kelas: student.kelas,
          date,
          status,
        });
      }
    });

    setAttendanceRecords([...otherDaysRecords, ...newRecordsForDate].sort((a, b) => a.date.localeCompare(b.date)));
    alert(`Absensi untuk tanggal ${date} berhasil disimpan!`);
  }, [attendanceRecords, students]);
  
  const renderView = () => {
    switch (currentView) {
      case View.Dashboard:
        return <Dashboard studentCount={students.length} attendanceRecords={attendanceRecords} />;
      case View.StudentData:
        return <StudentData students={students} onDeleteStudent={deleteStudent} />;
      case View.AddStudent:
        return <AddStudent onAddStudent={addStudent} />;
      case View.ImportStudents:
        return <ImportStudents onImport={addStudentsBatch} />;
      case View.DailyAttendance:
        return <DailyAttendance students={students} attendanceRecords={attendanceRecords} onSave={saveAttendance} />;
      case View.Reports:
        return <Reports attendanceRecords={attendanceRecords} />;
      default:
        return <Dashboard studentCount={students.length} attendanceRecords={attendanceRecords} />;
    }
  };

  const viewTitles: Record<View, string> = {
    [View.Dashboard]: 'Dashboard',
    [View.StudentData]: 'Data Siswa',
    [View.AddStudent]: 'Tambah Siswa',
    [View.ImportStudents]: 'Impor Siswa',
    [View.DailyAttendance]: 'Absensi Harian',
    [View.Reports]: 'Rekapitulasi',
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onLogout={onLogout} 
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
           <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden">
              <MenuIcon className="h-6 w-6" />
           </button>
           <h1 className="text-2xl font-semibold text-gray-800">{viewTitles[currentView]}</h1>
           <div>{/* Placeholder for other header items */}</div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;