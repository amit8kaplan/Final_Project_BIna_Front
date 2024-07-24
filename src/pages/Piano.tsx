import React, { useEffect, useState } from 'react';
import { Container, Table, Collapse, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { handleFiltersSubmit } from '../services/dapit-serivce';
import { trainersData, sessionsData, categoriesData, silabusPerSessionData } from '../public/data';
import { getMegamGradesAvg, getAveragePerformance } from '../services/matrics-serivce';
import { set } from 'react-hook-form';
import ViewDapit from '../components/view_Dapit';

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
  const [AveragePerformance, setAveragePerformance] = useState<any | null>(null);
  const [selectedDapit, setSelectedDapit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  

  useEffect(() => {
    fetchDapits();
  }, [group]);

  const handleShowModal = (dapit) => {
    setSelectedDapit(dapit);
    setShowModal(true);
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

      const getMegamGradesAvg1 = await getMegamGradesAvg(group);
        console.log('getMegamGradesAvg1:', getMegamGradesAvg1);

    const AveragePerformance = await getAveragePerformance(group);
    console.log('getAveragePerformance1:', AveragePerformance);
    const avgHanichPerPreformance = AveragePerformance.avgHanichPerPreformance;
    console.log('avgHanichPerPreformance:', avgHanichPerPreformance);

    setAveragePerformance(AveragePerformance);

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
    if (value >= 4) return { backgroundColor: 'red', color: 'white' };
    return { backgroundColor: 'light-gray', color: 'black' };
  };
  const noUnderlineStyle = {
    textDecoration: 'none'
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
                  <Button style= {noUnderlineStyle} variant="link" size="sm" onClick={() => toggleSession(trainer)}>+</Button>
                </td>
                <td style={fixedCellStyle}>{trainer}</td>
                {categoriesData.map((category, idx) => (
                  <td key={idx} style={{ ...fixedCellStyle, ...getCellStyle(AveragePerformance?.["avgHanichPerPreformance"]?.[trainer]?.[category] || 0) }}>
                    {AveragePerformance?.["avgHanichPerPreformance"]?.[trainer]?.[category] || ''}
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
                                <Button style= {noUnderlineStyle} variant="link" size="sm" onClick={() => toggleSilabus(trainer, session)}>+</Button>
                              </td>
                              <td style={fixedCellStyle}>{session}</td>
                              {categoriesData.map((category, idx) => (
                                <td key={idx} style={{ ...fixedCellStyle, ...getCellStyle(AveragePerformance?.["ResavgPerformance"]?.[trainer]?.[session]?.[category] || 0) }}>
                                  {AveragePerformance?.["ResavgPerformance"]?.[trainer]?.[session]?.[category] || ''}
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
                                      {silabusPerSessionData[0][session]?.map((silabus:any, silabusIdx:any) => (
                                        <tr key={silabusIdx}>
                                          <td >
                                          <Button style= {noUnderlineStyle} 
                                                variant="link" 
                                                size="sm"
                                                onClick={() => handleShowModal(dapits.find(d => d.nameTrainer === trainer && d.session === session && d.silabus === silabus))}
                                            >
                                                +
                                            </Button>
                                          </td>
                                          <td style={fixedCellStyle}>{silabus}</td>
                                          {categoriesData.map((category, idx) => {
                                              let res = dapits.find(d => d.nameTrainer === trainer && d.session === session && d.silabus === silabus);
                                              let check = '';
                                              let check2 = '';
                                              if (res && res[category] && res[category][0]?.value) {
                                                check = res[category][0].value;
                                                check2 = res[category][0].description;
                                                // console.log("res[category][0].description" , JSON.stringify(res[category][0].description))
                                              //   console.log("res[0]" , JSON.stringify(res.finalGrade))
                                              }
                                              if (res && category === "finalGrade") {
                                                  check = res.finalGrade;
                                                  check2 = ''
                                                  }
                                              else if (res && category === "changeTobeCommender") {
                                                  check = res.changeTobeCommender;
                                                  check2 =''
                                                  }
                                           
                                            return (
                                                
                                                <OverlayTrigger
                                                    key={idx}
                                                    placement="top"
                                                    overlay={<Tooltip id={`tooltip-${trainerIdx}-${sessionIdx}-${silabusIdx}-${idx}`}>{check2}</Tooltip>}
                                                    >
                                                    <td style={{ ...fixedCellStyle, ...getCellStyle(parseFloat(check) || 0) }}>
                                                        {check}
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
                {categoriesData.map((category, idx) => (
                    <td key={idx} style={{ ...fixedCellStyle, ...getCellStyle(AveragePerformance?.["avgGroup"]?.[category] || 0) }}>
                        {AveragePerformance?.["avgGroup"]?.[category] || ''}
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
    
  );
};

export default Piano;