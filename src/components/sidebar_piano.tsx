import React from 'react';
import { Button } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';

interface SidebarProps {
  categoriesData: string[];
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  handleMoveColumn: (category: string, direction: 'left' | 'right') => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categoriesData,
  visibleColumns,
  setVisibleColumns,
  handleMoveColumn,
  isOpen,
  toggleSidebar,
}) => {
  const handleToggleColumn = (category: string) => {
    setVisibleColumns(prev => {
      const isVisible = prev.includes(category);
      if (isVisible) {
        return prev.filter(col => col !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  return (
    <div className="side">
      {isOpen ? (
        <nav className="sidebar" style={{ fontSize: '0.8em', borderRight: '1px solid block', color: '#343a40', height: '100vh', overflowY: 'auto' }}>
          <Button  onClick={toggleSidebar} style={{ fontSize: '1.5em', color: 'black',borderColor: '#343a40', backgroundColor: '#f8f9fa' }}>×</Button>
          <h5>Filters</h5>
          {categoriesData.map((category, idx) => (
            <div key={idx} className="form-check mt-3">
              <input type="checkbox" className="form-check-input" id={`filter${category}`} name={category} checked={visibleColumns.includes(category)} onChange={() => handleToggleColumn(category)} />
              <label className="form-check-label" htmlFor={`filter${category}`}>{category}</label>
            </div>
          ))}
        </nav>
      ) : (
        <Button variant="link" onClick={toggleSidebar} style={{ fontSize: '1.5em' ,color: 'black', }}>
          <FaBars />
        </Button>
      )}
      <style>{`
        .sidebar::-webkit-scrollbar {
          width: 12px;
        }
        .sidebar::-webkit-scrollbar-track {
          background: #f8f9fa;
        }
        .sidebar::-webkit-scrollbar-thumb {
          background-color: #343a40;
          border-radius: 20px;
          border: 3px solid #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
