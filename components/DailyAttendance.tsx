import React, { useState, useEffect, useMemo } from 'react';
import { Student, AttendanceRecord, AttendanceStatus } from '../types';

interface DailyAttendanceProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onSave: (date: string, records: Map<string, AttendanceStatus>) => void;
}

const statusOptions: AttendanceStatus[] = ['Hadir', 'Sakit', 'Izin', 'Alfa'];

const DailyAttendance: React.FC<DailyAttendanceProps> = ({ students, attendanceRecords, onSave }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Map<string, AttendanceStatus>>(new Map());
  const [classFilter, setClassFilter] = useState('');

  useEffect(() => {
    const recordsForDate = new Map<string, AttendanceStatus>();
    attendanceRecords
      .filter(r => r.date === selectedDate)
      .forEach(r => recordsForDate.set(r.studentId, r.status));
    setAttendance(recordsForDate);
  }, [selectedDate, attendanceRecords]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => new Map(prev).set(studentId, status));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(selectedDate, attendance);
  };
  
  const sortedStudents = useMemo(() => {
    return [...students]
    .sort((a, b) => a.kelas.localeCompare(b.kelas) || a.nama.localeCompare(b.nama))
    .filter(s => classFilter ? s.kelas === classFilter : true);
  }, [students, classFilter]);
  
  const classes = useMemo(() => [...new Set(students.map(s => s.kelas))].sort(), [students]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="w-full md:w-auto">
            <label htmlFor="attendance-date" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Absensi</label>
            <input
              type="date"
              id="attendance-date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
           <div className="w-full md:w-auto">
            <label htmlFor="class-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter Kelas</label>
            <select
                id="class-filter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
            >
                <option value="">Semua Kelas</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStudents.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.kelas}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <fieldset className="flex flex-wrap gap-x-4 gap-y-2">
                      <legend className="sr-only">Status for {student.nama}</legend>
                      {statusOptions.map(status => (
                        <div key={status} className="flex items-center">
                          <input
                            type="radio"
                            id={`${student.id}-${status}`}
                            name={`status-${student.id}`}
                            value={status}
                            checked={attendance.get(student.id) === status}
                            onChange={() => handleStatusChange(student.id, status)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                          />
                          <label htmlFor={`${student.id}-${status}`} className="ml-2 block text-sm text-gray-700">{status}</label>
                        </div>
                      ))}
                    </fieldset>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-right">
            <button
                type="submit"
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                Simpan Absensi
            </button>
        </div>
      </form>
    </div>
  );
};

export default DailyAttendance;
