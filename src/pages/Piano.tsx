import React, { useEffect, useState } from 'react';
import { Container, Table, Collapse, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { handleFiltersSubmit } from '../services/dapit-serivce';
import { trainersData, sessionsData, categoriesData, silabusPerSessionData } from '../public/data';
import {getMegamGradesAvg, getAveragePerformance} from '../services/matrics-serivce';
interface IpianoProps {
  group: string;
}

const Piano: React.FC<IpianoProps> = (props) => {
  const location = useLocation();
  const state = location.state as IpianoProps || {};
  const group = state.group || props.group;
  const [dapits, setDapits] = useState<any[]>([]);
  const [avgPerformance, setAvgPerformance] = useState<any | null>(null);
  const [openSessions, setOpenSessions] = useState<{ [key: string]: boolean }>({});
  const [openSilabus, setOpenSilabus] = useState<{ [key: string]: { [key: string]: boolean } }>({});

  useEffect(() => {
    fetchDapits();
  }, [group]);

  const fetchDapits = async () => {
    try {
      const allDapits = await handleFiltersSubmit({ group: group });
      setDapits(allDapits);
      console.log("allDapits: ", allDapits);
    } catch (error) {
      console.error('Error fetching dapits:', error);
    }
    try {
      const MegamGradesAvg = await getMegamGradesAvg(group);
      setAvgPerformance(MegamGradesAvg);
      console.log("MegamGradesAvg: ", MegamGradesAvg);
    } catch (error) {
      console.error('Error fetching dapits:', error);
    }
    try {
      const AveragePerformance = await getAveragePerformance(group);
      setAvgPerformance(AveragePerformance);
      console.log("AveragePerformance: ", AveragePerformance);
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
    if (value >4 )return { backgroundColor: 'red', color: 'white' };
    return {backgroundColor: 'light-gray', color: 'black'}
  };

  const fixedCellStyle = {
    width: '150px',
    height: '50px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  return (
    <Container>
      <h1 className="mt-4">{group}</h1>
      <Table striped bordered hover table-sm className="mt-4">
        <thead>
          <tr>
            <th style={fixedCellStyle}></th>
            <th style={fixedCellStyle}>Trainer</th>
            {categoriesData.map((category, idx) => (
              <th key={idx} style={fixedCellStyle}>{category}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trainersData.map((trainer, trainerIdx) => (
            <React.Fragment key={trainerIdx}>
              <tr>
                <td style={fixedCellStyle}>
                  <Button variant="link" size="sm" onClick={() => toggleSession(trainer)}>+</Button>
                </td>
                <td style={fixedCellStyle}>{trainer}</td>
                {categoriesData.map((category, idx) => (
                  <td key={idx} style={{ ...fixedCellStyle, ...getCellStyle(dapits[trainer]?.[category] || 0) }}>
                    {dapits[trainer]?.[category] || ''}
                  </td>
                ))}
              </tr>
              <Collapse in={openSessions[trainer]}>
                <tr>
                  <td colSpan={categoriesData.length + 2}>
                    <Table striped bordered hover table-sm>
                      <thead>
                        <tr>
                          <th style={fixedCellStyle}></th>
                          <th style={fixedCellStyle}>Session</th>
                          {categoriesData.map((category, idx) => (
                            <th key={idx} style={fixedCellStyle}>{category}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sessionsData.map((session, sessionIdx) => (
                          <React.Fragment key={sessionIdx}>
                            <tr>
                              <td style={fixedCellStyle}>
                                <Button variant="link" size="sm" onClick={() => toggleSilabus(trainer, session)}>+</Button>
                              </td>
                              <td style={fixedCellStyle}>{session}</td>
                              {categoriesData.map((category, idx) => (
                                <td key={idx} style={{ ...fixedCellStyle, ...getCellStyle(dapits[trainer]?.[session]?.[category] || 0) }}>
                                  {dapits[trainer]?.[session]?.[category] || ''}
                                </td>
                              ))}
                            </tr>
                            <Collapse in={openSilabus[trainer]?.[session]}>
                              <tr>
                                <td colSpan={categoriesData.length + 2}>
                                  <Table striped bordered hover table-sm>
                                    <thead>
                                      <tr>
                                        <th style={fixedCellStyle}></th>
                                        <th style={fixedCellStyle}>Silabus</th>
                                        {categoriesData.map((category, idx) => (
                                          <th key={idx} style={fixedCellStyle}>{category}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {silabusPerSessionData[0][session]?.map((silabus, silabusIdx) => (
                                        <tr key={silabusIdx}>
                                          <td style={fixedCellStyle}>
                                            <Button variant="link" size="sm">+</Button>
                                          </td>
                                          <td style={fixedCellStyle}>{silabus}</td>
                                          {categoriesData.map((category, idx) => (
                                            <td key={idx} style={{ ...fixedCellStyle, ...getCellStyle(dapits[trainer]?.[session]?.[silabus]?.[category] || 0) }}>
                                              {dapits[trainer]?.[session]?.[silabus]?.[category] || ''}
                                            </td>
                                          ))}
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
      </Table>
    </Container>
  );
};

export default Piano;
