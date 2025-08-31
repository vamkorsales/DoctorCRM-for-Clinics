import React, { useState } from 'react';
import { Calendar, Users, FileText, BarChart3, CreditCard, Home, X, UserCheck, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

interface NavigationItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  current: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeSection = 'dashboard', onSectionChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigation: NavigationItem[] = [
    { name: 'Dashboard', icon: Home, href: '#dashboard', current: activeSection === 'dashboard' },
    { name: 'Reports', icon: BarChart3, href: '#reports', current: activeSection === 'reports' },
    { name: 'Patients', icon: Users, href: '#patients', current: activeSection === 'patients' },
    { name: 'Doctors', icon: UserCheck, href: '#doctors', current: activeSection === 'doctors' },
    { name: 'Appointments', icon: Calendar, href: '#appointments', current: activeSection === 'appointments' },
    { name: 'Billing', icon: CreditCard, href: '#billing', current: activeSection === 'billing' },
    { name: 'Settings', icon: Settings, href: '#settings', current: activeSection === 'settings' },
  ];

  const handleNavClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30
        ${collapsed ? 'w-16' : 'w-64'}
        bg-white border-r border-gray-100 transform transition-all duration-300 ease-in-out md:translate-x-0 md:static md:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-2 md:px-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">▲</span>
            </div>
            {!collapsed && <span className="text-lg font-semibold text-gray-900">Health Insights</span>}
          </div>
          <div className="flex items-center space-x-2">
            {/* Collapse/Expand button (desktop only) */}
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="hidden md:inline-flex p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 focus:outline-none"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className={`mt-8 ${collapsed ? 'px-1' : 'px-4'} space-y-1`}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const sectionName = item.name.toLowerCase();
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (sectionName === 'reports') {
                    window.history.pushState({}, '', '/reports');
                  } else if (sectionName === 'dashboard') {
                    window.history.pushState({}, '', '/');
                  }
                  console.log('[Sidebar] Navigating to section:', sectionName, 'Current pathname:', window.location.pathname);
                  handleNavClick(sectionName);
                }}
                className={`
                  w-full group flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200
                  ${item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`
                  h-5 w-5 transition-colors duration-200
                  ${item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}
                  ${collapsed ? '' : 'mr-3'}
                `} />
                {!collapsed && item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;