import React, { useState, useMemo } from 'react';
import { AttendanceRecord } from '../types';
import { DownloadIcon } from './icons/SidebarIcons';

type ReportType = 'harian' | 'mingguan' | 'bulanan';

interface ReportsProps {
    attendanceRecords: AttendanceRecord[];
}

// Helper function to format date to YYYY-MM-DD string without timezone issues
const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const Reports: React.FC<ReportsProps> = ({ attendanceRecords }) => {
  const [activeTab, setActiveTab] = useState<ReportType>('harian');

  const filteredData = useMemo(() => {
    const now = new Date();
    
    switch(activeTab) {
        case 'harian': {
            const todayStr = formatDateToYYYYMMDD(now);
            return attendanceRecords.filter(rec => rec.date === todayStr);
        }
        case 'mingguan': {
            const todayStr = formatDateToYYYYMMDD(now);
            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(now.getDate() - 6); // Include today, so go back 6 days
            const oneWeekAgoStr = formatDateToYYYYMMDD(oneWeekAgo);
            
            return attendanceRecords.filter(rec => rec.date >= oneWeekAgoStr && rec.date <= todayStr);
        }
        case 'bulanan': {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const startOfMonthStr = formatDateToYYYYMMDD(startOfMonth);
            const endOfMonthStr = formatDateToYYYYMMDD(endOfMonth);
            return attendanceRecords.filter(rec => rec.date >= startOfMonthStr && rec.date <= endOfMonthStr);
        }
        default:
            return [];
    }
  }, [activeTab, attendanceRecords]);

  const exportReport = () => {
    if (filteredData.length === 0) {
        alert("Tidak ada data untuk diekspor.");
        return;
    }
    const headers = ["Tanggal", "ID Siswa", "Nama Siswa", "Kelas", "Status"];
    const csvRows = [
      headers.join(','),
      ...filteredData.map(row => 
        [row.date, row.studentId, `"${row.studentName}"`, row.kelas, row.status].join(',')
      )
    ].join('\n');

    const csvContent = "data:text/csv;charset=utf-8," + encodeURI(csvRows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `rekap_${activeTab}_${formatDateToYYYYMMDD(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const TabButton: React.FC<{label: string, type: ReportType}> = ({ label, type }) => (
    <button
      onClick={() => setActiveTab(type)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeTab === type
          ? 'bg-primary text-white'
          : 'text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex space-x-2 border border-gray-200 p-1 rounded-lg">
          <TabButton label="Harian" type="harian" />
          <TabButton label="Mingguan" type="mingguan" />
          <TabButton label="Bulanan" type="bulanan" />
        </div>
        <button
            onClick={exportReport}
            className="mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
          >
            <DownloadIcon className="h-5 w-5 mr-2"/>
            Ekspor Laporan
          </button>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4 capitalize">Rekapitulasi {activeTab}</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? filteredData.sort((a, b) => b.date.localeCompare(a.date)).map((record, index) => (
              <tr key={`${record.studentId}-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.kelas}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === 'Hadir' ? 'bg-green-100 text-green-800' :
                        record.status === 'Sakit' ? 'bg-yellow-100 text-yellow-800' :
                        record.status === 'Izin' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {record.status}
                    </span>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                        Tidak ada data absensi untuk periode ini.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;