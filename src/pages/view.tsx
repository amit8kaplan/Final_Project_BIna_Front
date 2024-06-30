import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewDapit from '../components/view_Dapit';
import { Sidebar_com } from '../components/sideBar_views';

export const View: React.FC = () => {
  const [filters, setFilters] = useState<any>(null);

  const handleFiltersSubmit = (filterData: any) => {
    setFilters(filterData);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar_com onSubmit={handleFiltersSubmit} />

      {/* Main Content */}
      <div className="">
        <div className="row">
          <div className="col-12">
            {/* Render your ViewDapit component here with filtered data */}
            {/* {filters && (
              <ViewDapit
                nameInstructor={filters.nameInstructor}
                namePersonalInstructor={filters.namePersonalInstructor}
                nameTrainer={filters.nameTrainer}
                group={filters.group}
                session={filters.session}
                syllabus={filters.syllabus}
                startDate={filters.startDate}
                endDate={filters.endDate}
                changeToBeCommander={filters.changeToBeCommander}
                finalGrade={filters.finalGrade}
                // Add other props as needed
              />
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

// export default View;
