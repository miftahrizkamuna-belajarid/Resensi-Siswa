import React, { useState, useMemo } from 'react';
import { Student } from '../types';

interface StudentDataProps {
  students: Student[];
  onDeleteStudent: (id: string) => void;
}

const StudentData: React.FC<StudentDataProps> = ({ students, onDeleteStudent }) => {
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const classes = useMemo(() => [...new Set(students.map(s => s.kelas))].sort(), [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const byClass = filter ? student.kelas === filter : true;
      const bySearch = searchTerm ? 
        student.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.nomor.includes(searchTerm) : true;
      return byClass && bySearch;
    });
  }, [students, filter, searchTerm]);

  const handleDelete = (studentId: string, studentName: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data siswa "${studentName}"?`)) {
        onDeleteStudent(studentId);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
            <input 
                type="text"
                placeholder="Cari nama atau nomor..."
                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
                className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            >
                <option value="">Semua Kelas</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length > 0 ? filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.nomor}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.nama}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.kelas}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(student.id, student.nama)}
                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                    aria-label={`Hapus ${student.nama}`}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                        Tidak ada data siswa yang cocok.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentData;