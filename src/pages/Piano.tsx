import React, { useEffect, useState } from 'react';
import { Container, Table, Collapse, Button, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { handleFiltersSubmit } from '../services/dapit-serivce';
import { trainersData, categoriesData } from '../public/data';
import { getMegamGradesAvg, getAveragePerformance } from '../services/matrics-serivce';
import ViewDapit from '../components/view_Dapit';
import Sidebar_piano from '../components/sidebar_piano';
import { css } from 'jquery';
import { ISession, IInstractor, ITrainer, IGroup } from '../public/interfaces';
import { useDataContext } from '../DataContext';

interface IpianoProps {
  groupData: IGroup;
}

const Piano: React.FC<IpianoProps> = (props) => {
  const location = useLocation();
  const state = location.state as IpianoProps || {};
  const groupData = state.groupData || props.groupData;
  console.log("groupData ", groupData)
  const [dapits, setDapits] = useState<any[]>([]);
  const [avgPerformance, setAvgPerformance] = useState<any | null>(null);
  const [openSessions, setOpenSessions] = useState<{ [key: string]: boolean }>({});
  const [openSilabus, setOpenSilabus] = useState<{ [key: string]: { [key: string]: boolean } }>({});
  const [mapObjectsDapits, setMapObjectsDapits] = useState<any>({});
  const [AveragePerformance, setAveragePerformance] = useState<any | null>(null);
  const [selectedDapit, setSelectedDapit] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(categoriesData);
  const [columnOrder, setColumnOrder] = useState(categoriesData);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cellStyle, setCellStyle] = useState(false)
  const { groups, instructors, sessions,trainers ,personalInstractors } = useDataContext();
  const InstractorsComp: IInstractor[] = instructors || [];
  console.log("trainer", trainers)
  const trainersComp: ITrainer[] = trainers.filter(
    (trainer) => trainer._id && groupData.idsTrainers?.includes(trainer._id)
  ) || [];
  console.log("trainerComp", trainersComp)
  const sessionsComp: ISession[] = sessions || [];
  const groupsComp: IGroup[] = groups || [];

  useEffect(() => {
    // setDapits([]);
    // setAvgPerformance(null);
    // setOpenSessions({});
    // setOpenSilabus({});
    // setMapObjectsDapits({});
    // setAveragePerformance(null);
    setCellStyle(false)
    fetchDapits();
  }, [groupData]);

  const handleShowModal = (dapit: any) => {
    console.log('dapit:', dapit);
    if (dapit != undefined) {
      setSelectedDapit(dapit);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDapit(null);
  };

  const arrangeTheDapits = (dapits: any[]) => {
    const sortedDapits = dapits.reduce((acc, dapit) => {
      const { nameTrainer, session, silabus, key } = dapit;

      if (!acc[nameTrainer]) {
        acc[nameTrainer] = {};
      }
      if (!acc[nameTrainer][session]) {
        acc[nameTrainer][session] = {};
      }
      if (!acc[nameTrainer][session][silabus]) {
        acc[nameTrainer][session][silabus] = [];
      }

      acc[nameTrainer][session][silabus].push(dapit);
      return acc;
    }, {} as any);
    return sortedDapits;
  };

  const fetchDapits = async () => {
    try {
      const allDapits = await handleFiltersSubmit({ group: groupData.name });
      const dapitsWithKeys = allDapits.map((item: any, index: any) => ({
        ...item,
        key: index
      }));
      const sortedDapits = dapitsWithKeys.sort((a: any, b: any) => {
        if (a.nameTrainer > b.nameTrainer) return 1;
        if (a.nameTrainer < b.nameTrainer) return -1;

        if (a.session < b.session) return 1;
        if (a.session > b.session) return -1;

        if (a.silabus < b.silabus) return -1;
        if (a.silabus > b.silabus) return 1;

        return 0;
      });
      setDapits(sortedDapits);
      const mapObjects = arrangeTheDapits(sortedDapits);
      setMapObjectsDapits(mapObjects);

      const getMegamGradesAvg1 = await getMegamGradesAvg(groupData);
      console.log('getMegamGradesAvg1:', getMegamGradesAvg1);

      const AveragePerformance = await getAveragePerformance(groupData.name);
      console.log('getAveragePerformance1:', AveragePerformance);
      const avgHanichPerPreformance = AveragePerformance.avgHanichPerPreformance;
      console.log('avgHanichPerPreformance:', avgHanichPerPreformance);
      setCellStyle(true)
      setAveragePerformance(AveragePerformance);
    } catch (error) {
      console.error('Error fetching dapits:', error);
    }

    try {
      const MegamGradesAvg = await getMegamGradesAvg(groupData);
      setAvgPerformance(MegamGradesAvg);
    } catch (error) {
      console.error('Error fetching dapits:', error);
    }

    try {
      const AveragePerformance = await getAveragePerformance(groupData.name);
      setAvgPerformance(AveragePerformance);
    } catch (error) {
      console.error('Error fetching dapits:', error);
    }
  };

  const toggleSession = (trainer: string) => {
    setOpenSessions(prevState => ({
      ...prevState,
      [trainer]: !prevState[trainer]
    }));
  };

  const toggleSilabus = (trainer: string, session: string) => {
    setOpenSilabus(prevState => ({
      ...prevState,
      [trainer]: {
        ...prevState[trainer],
        [session]: !prevState[trainer]?.[session]
      }
    }));
  };

  const getCellStyle = (value: number) => {
    if (value > 8) return { backgroundColor: 'green', color: 'white', fontWeight: 'bold' };
    if (value > 7.5) return { backgroundColor: 'lightgreen' };
    if (value > 6.8) return { backgroundColor: 'lightyellow' };
    if (value > 6.5) return { backgroundColor: 'yellow' };
    if (value > 6) return { backgroundColor: 'orange', color: 'white' };
    if (value >= 4) return { backgroundColor: 'red', color: 'white' };
    return { backgroundColor: 'light-gray', color: 'black' };
  };

  const handleMoveColumn = (category: string, direction: 'left' | 'right') => {
    setColumnOrder(prev => {
      const currentIndex = prev.indexOf(category);
      const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;

      if (newIndex < 0 || newIndex >= prev.length) {
        return prev;
      }

      const newOrder = [...prev];
      newOrder.splice(currentIndex, 1);
      newOrder.splice(newIndex, 0, category);
      return newOrder;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const fixedCellStyle = {
    width: '150px',
    height: '50px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };
  const noUnderlineStyle = {
    textDecoration: 'none'
  };

  const formatNumber = (num: number): string => {
    if (isNaN(num) ||num === 0) return '';
    const fixedNum = num.toFixed(2);
    return fixedNum.endsWith('.00') ? num.toString() : fixedNum;
  };
  const getCategoryDisplayName = (category: string): string => {
    switch (category) {
      case 'finalGrade':
        return 'Final Grade';
      case 'changeTobeCommender':
        return 'Chances';
      case 'understandingTheAir':
        return 'Understanding The Air';
      case 'thinkingInAir':
        return 'Thinking In Air';
      case 'debriefingInAir':
        return 'Debriefing In Air';
      case 'implementationExecise':
        return 'Implementation Execise';
      case 'dealingWithFailures':
        return 'Dealing With Failures';
      case 'dealingWithStress':
        return 'Dealing With Stress';
      case 'makingDecisions':
        return 'Making Decisions';
      case 'pilotNature':
        return 'Pilot Nature';
      case 'crewMember':
        return 'Crew Member';
      case 'workingMethod':
        return 'Working Method';
      default:
        return category;
    }
  };
  return (
    <div className="d-flex">
      <Sidebar_piano
        categoriesData={categoriesData}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        handleMoveColumn={handleMoveColumn}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <Container>
        <h1 className="mt-4">{groupData.name}</h1>
        <Table striped bordered hover size="sm" className="mt-4">
          <thead>
            <tr>
              <th style={fixedCellStyle}></th>
              <th style={fixedCellStyle}>Trainer</th>
              {columnOrder.filter(col => visibleColumns.includes(col)).map((category, idx) => (
                <th key={idx} style={fixedCellStyle}>{getCategoryDisplayName(category)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trainersComp.map((trainer, trainerIdx) => (
              <React.Fragment key={trainerIdx}>
                <tr>
                  <td style={fixedCellStyle}>
                    <Button style={noUnderlineStyle} variant="link" size="sm" onClick={() => toggleSession(trainer.name)}>+</Button>
                  </td>
                  <td style={fixedCellStyle}>{trainer.name}</td>
                  {columnOrder.filter(col => visibleColumns.includes(col)).map((category, idx) => (
                    <td key={idx} style={{ ...fixedCellStyle, ...(cellStyle? getCellStyle(parseFloat(AveragePerformance?.["avgHanichPerPreformance"]?.[trainer.name]?.[category] || 0) ||0) : {}) }}>
                      {formatNumber(parseFloat(AveragePerformance?.["avgHanichPerPreformance"]?.[trainer.name]?.[category] || 0))}
                    </td>
                  ))}
                </tr>
                <Collapse in={openSessions[trainer.name]}>
                  <tr>
                    <td colSpan={columnOrder.filter(col => visibleColumns.includes(col)).length + 2}>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th style={fixedCellStyle}></th>
                            <th style={fixedCellStyle}>Session</th>
                            {columnOrder.filter(col => visibleColumns.includes(col)).map((category, idx) => (
                              <th key={idx} style={fixedCellStyle}>{getCategoryDisplayName(category)}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sessionsComp.map((session, sessionIdx) => (
                            <React.Fragment key={sessionIdx}>
                              <tr>
                                <td style={fixedCellStyle}>
                                  <Button style={noUnderlineStyle} variant="link" size="sm" onClick={() => toggleSilabus(trainer.name, session.name)}>+</Button>
                                </td>
                                <td style={fixedCellStyle}>{session.name}</td>
                                {columnOrder.filter(col => visibleColumns.includes(col)).map((category, idx) => (
                                  <td key={idx} style={{ ...fixedCellStyle, ...(cellStyle? getCellStyle(parseFloat(AveragePerformance?.["ResavgPerformance"]?.[trainer.name]?.[session.name]?.[category] || 0) || 0): {}) }}>
                                    {formatNumber(parseFloat(AveragePerformance?.["ResavgPerformance"]?.[trainer.name]?.[session.name]?.[category] || 0))}
                                  </td>
                                ))}
                              </tr>
                              <Collapse in={openSilabus[trainer.name]?.[session.name]}>
                                <tr>
                                  <td colSpan={columnOrder.filter(col => visibleColumns.includes(col)).length + 2}>
                                    <Table striped bordered hover size="sm">
                                      <thead>
                                        <tr>
                                          <th style={fixedCellStyle}></th>
                                          <th style={fixedCellStyle}>Silabus</th>
                                          {columnOrder.filter(col => visibleColumns.includes(col)).map((category, idx) => (
                                            <th key={idx} style={fixedCellStyle}>{getCategoryDisplayName(category)}</th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {session.silabus.map((silabus: number, silabusIdx: number) => (
                                          <tr key={silabusIdx}>
                                            <td>
                                              <Button style={noUnderlineStyle}
                                                variant="link"
                                                size="sm"
                                                onClick={() => handleShowModal(dapits.find(d => d.nameTrainer === trainer.name && d.session === session.name && d.silabus === silabus))}
                                              >
                                                +
                                              </Button>
                                            </td>
                                            <td style={fixedCellStyle}>{silabus}</td>
                                            {columnOrder.filter(col => visibleColumns.includes(col)).map((category, idx) => {
                                              let res = dapits.find(d => d.nameTrainer === trainer.name && d.session === session.name && d.silabus === silabus);
                                              let check = '';
                                              let check2 = '';
                                              if (res && res[category] && res[category][0]?.value) {
                                                check = res[category][0].value;
                                                check2 = res[category][0].description;
                                              }
                                              if (res && category === "finalGrade") {
                                                check = res.finalGrade;
                                                check2 = ''
                                              } else if (res && category === "changeTobeCommender") {
                                                check = res.changeTobeCommender;
                                                check2 = ''
                                              }
                                              return (
                                                <OverlayTrigger
                                                  key={idx}
                                                  placement="top"
                                                  overlay={<Tooltip id={`tooltip-${trainerIdx}-${sessionIdx}-${silabusIdx}-${idx}`}>{check2}</Tooltip>}
                                                >
                                                  <td style={{ ...fixedCellStyle, ...(cellStyle? getCellStyle(parseFloat(check) || 0) : {})
                                                 }}>
                                                    {formatNumber(parseFloat(check))}
                                                  </td>
                                                </OverlayTrigger>
                                              );
                                            })}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  </td>
                                </tr>
                              </Collapse>
                            </React.Fragment>
                          ))}
                        </tbody>
                      </Table>
                    </td>
                  </tr>
                </Collapse>
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td style={fixedCellStyle}></td>
              <td style={fixedCellStyle}>Avg Group</td>
              {columnOrder.filter(col => visibleColumns.includes(col)).map((category, idx) => (
                <td key={idx} style={{ ...fixedCellStyle, ...(cellStyle?  getCellStyle(parseFloat(AveragePerformance?.["avgGroup"]?.[category] || 0) ||0 ) : {})}}>
                  {formatNumber(parseFloat(AveragePerformance?.["avgGroup"]?.[category] || 0))}
                </td>
              ))}
            </tr>
          </tfoot>
        </Table>
        {/* Modal */}
        {showModal && (
          <ViewDapit
            selectedDapit={selectedDapit}
            onClose={handleCloseModal}
          />
        )}
      </Container>
    </div>
  );
};

export default Piano;