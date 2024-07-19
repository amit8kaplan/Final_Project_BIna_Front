import React, { useEffect, useState } from 'react';
import { Container, Table, Collapse, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { handleFiltersSubmit } from '../services/dapit-serivce';
import { trainersData, sessionsData, categoriesData, silabusPerSessionData } from '../public/data';
import { getMegamGradesAvg, getAveragePerformance } from '../services/matrics-serivce';

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
  const [mapObjectsDapits, setMapObjectsDapits] = useState<any>({});

  useEffect(() => {
    fetchDapits();
  }, [group]);

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
      const allDapits = await handleFiltersSubmit({ group: group });
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
    //   console.log('mapObjects:', mapObjects);
      setMapObjectsDapits(mapObjects);
    //   let check = 0;
    // //   console.log("silabusPerSessionData: ", silabusPerSessionData)
    // //   console.log("silabusPerSessionData[0]: ", silabusPerSessionData[0])
    // //   console.log("silabusPerSessionData[0][session]: ", silabusPerSessionData[0]?.[sessionsData[1]])
    //   const check2 = dapits.find(d => d.nameTrainer === "Amit3" && d.session === "Session 1" && d.silabus === 2 && d.payload[0].value == 4)?.payload[0]?.value
    // //   console.log("check2: ", JSON.stringify(check2))
      
      
    //   const check3 = dapits.find(d => d.nameTrainer === "Amit3" && d.session === "Session 1" && d.silabus === 2)
    // //   console.log("check3: ", JSON.stringify(check3))


    //   trainersData.forEach((trainer) => {
    //     // console.log('trainer: ', trainer);
    //     sessionsData.forEach((session) => {
    //         console.log('session: ', session);
    //         // silabusPerSessionData[0]?.[session]?.forEach((silabus:number) => {
    //             // console.log('silabus: ', silabus);
    //             categoriesData.forEach((category) => {
    //                 // console.log("category: ", category)
    //                 const res =dapits.find(d => d.nameTrainer === trainer && d.session === session && d[category][0].length < 3)?.d[category][0]?.value
    //                if (res!= undefined) console.log("res + trainer + session + category: ", res + " " + trainer + " " + session + " " + category)

    //                 // let res =dapits.find(d => d.nameTrainer === trainer && d.session === session && d.silabus === 2 )
    //                 // if (res && res[category] && res[category][0]?.value ) {
    //                 //     let check = res[category][0].value || 0;
    //                 //     // console.log("check: ", JSON.stringify(check))
    //                 // }
    //              })
    //         })
    //     // })
    //     // console.log("check: ", check)
    // })
    } catch (error) {
      console.error('Error fetching dapits:', error);
    }

    try {
      const MegamGradesAvg = await getMegamGradesAvg(group);
      setAvgPerformance(MegamGradesAvg);
    } catch (error) {
      console.error('Error fetching dapits:', error);
    }

    try {
      const AveragePerformance = await getAveragePerformance(group);
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
    if (value > 4) return { backgroundColor: 'red', color: 'white' };
    return { backgroundColor: 'light-gray', color: 'black' };
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
                  <td key={idx} style={{ ...fixedCellStyle, ...getCellStyle(dapits.find(d => d.nameTrainer === trainer && d.category === category)?.value || 0) }}>
                    {dapits.find(d => d.nameTrainer === trainer && d.category === category)?.value || ''}
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
                                <td key={idx} style={{ ...fixedCellStyle, ...getCellStyle(dapits.find(d => d.nameTrainer === trainer && d.session === session && d.category === category)?.value || 0) }}>
                                  {dapits.find(d => d.nameTrainer === trainer && d.session === session && d.category === category)?.value || ''}
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
                                          {categoriesData.map((category, idx) => {
                                            let res = dapits.find(d => d.nameTrainer === trainer && d.session === session && d.silabus === silabus);
                                            let check = '';
                                            if (res && res[category] && res[category][0]?.value) {
                                              check = res[category][0].value;
                                            }
                                            return (
                                              <td key={idx} style={{ ...fixedCellStyle, ...getCellStyle(check || 0) }}>
                                                {check}
                                              </td>
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
      </Table>
    </Container>
  );
};

export default Piano;