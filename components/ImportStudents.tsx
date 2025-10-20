import React, { useState, useRef } from 'react';
import { UploadIcon, DownloadIcon, FileTextIcon } from './icons/SidebarIcons';
import { Student } from '../types';

interface ImportStudentsProps {
  onImport: (students: Omit<Student, 'id'>[]) => void;
}

const ImportStudents: React.FC<ImportStudentsProps> = ({ onImport }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage('');
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setMessage('Silakan pilih file terlebih dahulu.');
      setIsError(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').slice(1); // Pisahkan per baris dan lewati header
        const newStudents: Omit<Student, 'id'>[] = [];

        rows.forEach((row) => {
          const columns = row.trim().split(',');
          // Validasi sederhana: pastikan ada 3 kolom dan kolom pertama tidak kosong
          if (columns.length === 3 && columns[0]) {
            newStudents.push({
              nomor: columns[0].trim(),
              nama: columns[1].trim(),
              kelas: columns[2].trim(),
            });
          }
        });

        if (newStudents.length === 0) {
          throw new Error("File tidak mengandung data siswa yang valid atau formatnya salah.");
        }
        
        onImport(newStudents);
        
        // Pesan sukses akan terlihat di halaman Data Siswa setelah redirect
        // Untuk pengalaman pengguna yang lebih baik, kita bisa menampilkan pesan sementara di sini juga.
        alert(`${newStudents.length} siswa berhasil diimpor! Anda akan diarahkan ke halaman Data Siswa.`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Gagal memproses file. Pastikan formatnya sesuai template.';
        setMessage(errorMessage);
        setIsError(true);
      }
    };

    reader.onerror = () => {
      setMessage('Gagal membaca file.');
      setIsError(true);
    };

    reader.readAsText(selectedFile);
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nomor,Nama,Kelas\n"
      + "1001,Budi Santoso,10A\n"
      + "1002,Citra Lestari,10B\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "template_siswa.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Impor Data Siswa</h2>
      
      {message && (
        <div className={`p-4 mb-4 text-sm rounded-lg ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
        <p className="font-bold">Instruksi</p>
        <p>Unggah file CSV (.csv) dengan kolom: Nomor, Nama, Kelas. Gunakan template yang disediakan.</p>
      </div>

      <div className="flex items-center justify-center w-full mb-6">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {selectedFile ? (
                    <>
                      <FileTextIcon className="w-10 h-10 mb-3 text-primary"/>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">{selectedFile.name}</span></p>
                      <p className="text-xs text-gray-500">{Math.round(selectedFile.size / 1024)} KB</p>
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-10 h-10 mb-3 text-gray-400"/>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Klik untuk mengunggah</span> atau seret file</p>
                      <p className="text-xs text-gray-500">Hanya format .csv</p>
                    </>
                  )}
              </div>
              <input ref={fileInputRef} id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".csv" />
          </label>
      </div> 

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={downloadTemplate}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <DownloadIcon className="h-5 w-5 mr-2"/>
          Unduh Template
        </button>
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <UploadIcon className="h-5 w-5 mr-2"/>
          Impor Siswa
        </button>
      </div>
    </div>
  );
};

export default ImportStudents;