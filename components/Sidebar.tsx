import React from 'react';
import { View } from '../types';
import { DashboardIcon, UsersIcon, UserPlusIcon, UploadIcon, ChartBarIcon, LogoutIcon, ClipboardListIcon } from './icons/SidebarIcons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-primary text-white'
        : 'text-gray-600 hover:bg-gray-200'
    }`}
  >
    {icon}
    <span className="mx-4 font-medium">{label}</span>
  </a>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout, isOpen, setIsOpen }) => {
    
    const handleNavigation = (view: View) => {
        setCurrentView(view);
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    }

  return (
    <>
    <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsOpen(false)}
      ></div>
    <div className={`flex flex-col w-64 bg-white h-full border-r border-gray-200 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30`}>
      <div className="flex items-center justify-center h-20 border-b">
        <img src="https://i0.wp.com/greatedunesia.id/wp-content/uploads/2025/06/SMART.webp?w=862&ssl=1" alt="Logo" className="h-12 w-auto" />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <nav>
          <NavLink
            icon={<DashboardIcon className="h-6 w-6" />}
            label="Dashboard"
            isActive={currentView === View.Dashboard}
            onClick={() => handleNavigation(View.Dashboard)}
          />
          <NavLink
            icon={<UsersIcon className="h-6 w-6" />}
            label="Data Siswa"
            isActive={currentView === View.StudentData}
            onClick={() => handleNavigation(View.StudentData)}
          />
           <NavLink
            icon={<ClipboardListIcon className="h-6 w-6" />}
            label="Absensi Harian"
            isActive={currentView === View.DailyAttendance}
            onClick={() => handleNavigation(View.DailyAttendance)}
          />
          <NavLink
            icon={<UserPlusIcon className="h-6 w-6" />}
            label="Tambah Siswa"
            isActive={currentView === View.AddStudent}
            onClick={() => handleNavigation(View.AddStudent)}
          />
          <NavLink
            icon={<UploadIcon className="h-6 w-6" />}
            label="Impor Siswa"
            isActive={currentView === View.ImportStudents}
            onClick={() => handleNavigation(View.ImportStudents)}
          />
          <NavLink
            icon={<ChartBarIcon className="h-6 w-6" />}
            label="Rekapitulasi"
            isActive={currentView === View.Reports}
            onClick={() => handleNavigation(View.Reports)}
          />
        </nav>
      </div>
      <div className="p-4 border-t">
          <NavLink
            icon={<LogoutIcon className="h-6 w-6" />}
            label="Logout"
            isActive={false}
            onClick={onLogout}
          />
      </div>
    </div>
    </>
  );
};

export default Sidebar;
