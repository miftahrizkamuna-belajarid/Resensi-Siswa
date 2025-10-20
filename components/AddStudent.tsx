
import React, { useState } from 'react';
import { Student } from '../types';

interface AddStudentProps {
  onAddStudent: (student: Omit<Student, 'id'>) => void;
}

const AddStudent: React.FC<AddStudentProps> = ({ onAddStudent }) => {
  const [nomor, setNomor] = useState('');
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomor || !nama || !kelas) {
        setMessage('Semua kolom harus diisi.');
        return;
    }
    onAddStudent({ nomor, nama, kelas });
    setMessage('Siswa berhasil ditambahkan!');
    setNomor('');
    setNama('');
    setKelas('');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Formulir Tambah Siswa</h2>
      {message && (
        <div className={`p-4 mb-4 text-sm rounded-lg ${message.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nomor" className="block text-sm font-medium text-gray-700">Nomor</label>
          <input
            type="text"
            id="nomor"
            value={nomor}
            onChange={(e) => setNomor(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Contoh: 1009"
          />
        </div>
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama</label>
          <input
            type="text"
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Contoh: Jihan Audia"
          />
        </div>
        <div>
          <label htmlFor="kelas" className="block text-sm font-medium text-gray-700">Kelas</label>
          <input
            type="text"
            id="kelas"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Contoh: 11A"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Tambah Siswa
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
