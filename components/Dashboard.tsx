import React from 'react';
import { UsersIcon, CheckCircleIcon, ClockIcon } from './icons/SidebarIcons';
import { AttendanceRecord } from '../types';

interface DashboardProps {
  studentCount: number;
  attendanceRecords: AttendanceRecord[];
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ studentCount, attendanceRecords }) => {
  const today = new Date().toISOString().split('T')[0];
  const presentToday = attendanceRecords.filter(r => r.date === today && r.status === 'Hadir').length;
  const attendanceRate = studentCount > 0 
    ? `${Math.round((presentToday / studentCount) * 100)}%`
    : '0%';

  return (
    <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={<UsersIcon className="h-8 w-8 text-white"/>} title="Total Siswa" value={studentCount.toString()} color="bg-blue-500" />
            <StatCard icon={<CheckCircleIcon className="h-8 w-8 text-white"/>} title="Hadir Hari Ini" value={presentToday.toString()} color="bg-green-500" />
            <StatCard icon={<ClockIcon className="h-8 w-8 text-white"/>} title="Tingkat Kehadiran Hari Ini" value={attendanceRate} color="bg-yellow-500" />
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Selamat Datang di Dashboard Absensi</h2>
            <p className="text-gray-600">
                Gunakan menu di samping untuk mengelola data siswa, mencatat absensi harian, dan melihat rekapitulasi kehadiran.
            </p>
        </div>
    </div>
  );
};

export default Dashboard;
