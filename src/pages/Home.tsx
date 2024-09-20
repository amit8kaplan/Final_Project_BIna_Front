import { useEffect, useState } from 'react';
import * as React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDataContext } from '../DataContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export function Home() {
  const { sessions, trainers, dapits, groups } = useDataContext();
  const [progressData, setProgressData] = useState<{ session: string, percentage: number }[]>([]);
  const [groupProgressData, setGroupProgressData] = useState<{ [key: string]: { session: string, percentage: number }[] }>({});
  const [avgFinalGradeData, setAvgFinalGradeData] = useState<{ session: string, avgGrade: number }[]>([]);
  const [groupAvgFinalGradeData, setGroupAvgFinalGradeData] = useState<{ [key: string]: { session: string, avgGrade: number }[] }>({});
  const [trainerAvgFinalGradeData, setTrainerAvgFinalGradeData] = useState<{ [key: string]: { session: string, avgGrade: number }[] }>({});
  const [trainerProgressData, setTrainerProgressData] = useState<{ [key: string]: { session: string, percentage: number }[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgressChart, setSelectedProgressChart] = useState<string>('courseProgress');
  const [selectedGradeChart, setSelectedGradeChart] = useState<string>('courseAvgFinalGrade');
  const [selectedTrainerForAvg, setSelectedTrainerForAvg] = useState<string | null>(null);
  const [selectedTrainerForProgress, setSelectedTrainerForProgress] = useState<string | null>(null);
  const [selectedGradeType, setSelectedGradeType] = useState<string>('finalGrade');
  const [chartHeadline, setChartHeadline] = useState<string>('Course Avg Final Grade');

  useEffect(() => {
    try {
      const calculateCourseProgress = () => {
        const progress = sessions.map(session => {
          const totalPossible = trainers.length * session.silabus.length;
          const actualProgress = dapits.filter(dapit => dapit.session === session.name).length;
          const percentage = (actualProgress / totalPossible) * 100;
          return { session: session.name, percentage };
        });
        setProgressData(progress);
      };

      const calculateGroupProgress = () => {
        const groupProgress = groups.reduce((acc, g) => {
          const progress = sessions.map(session => {
            const groupTrainers = g.idsTrainers.length;
            const totalPossible = groupTrainers * session.silabus.length;
            const actualProgress = dapits.filter(dapit => g.idsTrainers.includes(dapit.idTrainer) && dapit.session === session.name).length;
            const percentage = (actualProgress / totalPossible) * 100;
            return { session: session.name, percentage };
          });
          acc[g.name] = progress;
          return acc;
        }, {} as { [key: string]: { session: string, percentage: number }[] });
        setGroupProgressData(groupProgress);
      };

      const calculateTrainerProgress = () => {
        const trainerProgress = trainers.reduce((acc, t) => {
          const progress = sessions.map(session => {
            const totalPossible = session.silabus.length;
            const actualProgress = dapits.filter(dapit => dapit.idTrainer === t._id && dapit.session === session.name).length;
            const percentage = (actualProgress / totalPossible) * 100;
            return { session: session.name, percentage };
          });
          acc[t.name] = progress;
          return acc;
        }, {} as { [key: string]: { session: string, percentage: number }[] });
        setTrainerProgressData(trainerProgress);
      };

      const calculateAvgFinalGrade = () => {
        const avgGrades = sessions.map(session => {
          const sessionDapits = dapits.filter(dapit => dapit.session === session.name);
          const totalGrades = sessionDapits.reduce((sum, dapit) => sum + dapit[selectedGradeType], 0);
          const avgGrade = sessionDapits.length ? totalGrades / sessionDapits.length : 0;
          return { session: session.name, avgGrade };
        });
        setAvgFinalGradeData(avgGrades);
      };

      const calculateGroupAvgFinalGrade = () => {
        const groupAvgGrades = groups.reduce((acc, g) => {
          const avgGrades = sessions.map(session => {
            const sessionDapits = dapits.filter(dapit => g.idsTrainers.includes(dapit.idTrainer) && dapit.session === session.name);
            const totalGrades = sessionDapits.reduce((sum, dapit) => sum + dapit[selectedGradeType], 0);
            const avgGrade = sessionDapits.length ? totalGrades / sessionDapits.length : 0;
            return { session: session.name, avgGrade };
          });
          acc[g.name] = avgGrades;
          return acc;
        }, {} as { [key: string]: { session: string, avgGrade: number }[] });
        setGroupAvgFinalGradeData(groupAvgGrades);
      };

      const calculateTrainerAvgFinalGrade = () => {
        const trainerAvgGrades = trainers.reduce((acc, t) => {
          const avgGrades = sessions.map(session => {
            const sessionDapits = dapits.filter(dapit => dapit.idTrainer === t._id && dapit.session === session.name);
            const totalGrades = sessionDapits.reduce((sum, dapit) => sum + dapit[selectedGradeType], 0);
            const avgGrade = sessionDapits.length ? totalGrades / sessionDapits.length : 0;
            return { session: session.name, avgGrade };
          });
          acc[t.name] = avgGrades;
          return acc;
        }, {} as { [key: string]: { session: string, avgGrade: number }[] });
        setTrainerAvgFinalGradeData(trainerAvgGrades);
      };

      calculateCourseProgress();
      calculateGroupProgress();
      calculateTrainerProgress();
      calculateAvgFinalGrade();
      calculateGroupAvgFinalGrade();
      calculateTrainerAvgFinalGrade();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error calculating progress data');
      setLoading(false);
    }
  }, [sessions, trainers, dapits, groups, selectedGradeType]);

  useEffect(() => {
    if (selectedGradeType === 'finalGrade') {
      setChartHeadline('Course Avg Final Grade');
    } else if (selectedGradeType === 'changeTobeCommender') {
      setChartHeadline('Change to be Commander');
    }
  }, [selectedGradeType]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const progressChartData = {
    labels: progressData.map(data => data.session),
    datasets: [{
      label: 'Course Progress (%)',
      data: progressData.map(data => data.percentage),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const getGroupProgressChartData = (groupName: string) => {
    const groupData = groupProgressData[groupName] || [];
    return {
      labels: groupData.map(data => data.session),
      datasets: [{
        label: `${groupName} Progress (%)`,
        data: groupData.map(data => data.percentage),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }]
    };
  };

  const getTrainerProgressChartData = (trainerName: string) => {
    const trainerData = trainerProgressData[trainerName] || [];
    return {
      labels: trainerData.map(data => data.session),
      datasets: [{
        label: `${trainerName} Progress (%)`,
        data: trainerData.map(data => data.percentage),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
  };

  const getCombinedProgressChartData = () => {
    const datasets = [
      {
        label: 'Course Progress (%)',
        data: progressData.map(data => data.percentage),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ];

    if (selectedProgressChart !== 'courseProgress') {
      const groupData = groupProgressData[selectedProgressChart] || [];
      datasets.push({
        label: `${selectedProgressChart} Progress (%)`,
        data: groupData.map(data => data.percentage),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      });
    }

    if (selectedTrainerForProgress) {
      const trainerData = trainerProgressData[selectedTrainerForProgress] || [];
      datasets.push({
        label: `${selectedTrainerForProgress} Progress (%)`,
        data: trainerData.map(data => data.percentage),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      });
    }

    return {
      labels: progressData.map(data => data.session),
      datasets
    };
  };

  const getAvgFinalGradeChartData = () => {
    const datasets = [
      {
        label: `Course ${selectedGradeType === 'finalGrade' ? 'Final Grade ' : 'Chance Grade'}`,
        data: avgFinalGradeData.map(data => data.avgGrade),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        fill: false,
        tension: 0.1
      }
    ];

    if (selectedGradeChart !== 'courseAvgFinalGrade') {
      const groupData = groupAvgFinalGradeData[selectedGradeChart] || [];
      datasets.push({
        label: `${selectedGradeChart} ${selectedGradeType === 'finalGrade' ? 'Final Grade' : 'Chance Grade'}`,
        data: groupData.map(data => data.avgGrade),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        fill: false,
        tension: 0.1
      });
    }

    if (selectedTrainerForAvg) {
      const trainerData = trainerAvgFinalGradeData[selectedTrainerForAvg] || [];
      datasets.push({
        label: `${selectedTrainerForAvg} ${selectedGradeType === 'finalGrade' ? 'Final Grade' : 'Chance Grade'}`,
        data: trainerData.map(data => data.avgGrade),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
        tension: 0.1
      });
    }

    return {
      labels: avgFinalGradeData.map(data => data.session),
      datasets
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: number) {
            return value + '%';
          }
        }
      }
    }
  };

  const gradeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        min: 4,
        max: 10,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const handleProgressChartChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProgressChart(event.target.value);
  };

  const handleGradeChartChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGradeChart(event.target.value);
    setSelectedTrainerForAvg(null);
    setSelectedTrainerForProgress(null);
  };

  const handleTrainerChangeForAvg = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTrainerForAvg(event.target.value);
  };

  const handleTrainerChangeForProggress = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTrainerForProgress(event.target.value);
  };

  const handleGradeTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGradeType(event.target.value);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light" style={{ minHeight: '100vh', padding: '20px' }}>
      <h1 className="mb-4">Welcome to the BIna Web App</h1>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">Progress</h2>
                <div className="row mb-4">
                  <div className="col">
                    <select className="form-select" value={selectedProgressChart} onChange={handleProgressChartChange}>
                      <option value="courseProgress">Course Progress</option>
                      {groups.map(g => (
                        <option key={g._id} value={g.name}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col">
                    <select className="form-select" value={selectedTrainerForProgress || ''} onChange={handleTrainerChangeForProggress}>
                      <option value="">Select Trainer</option>
                      {trainers.map(t => (
                        <option key={t._id} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ width: '100%', height: '400px' }}>
                  <Bar data={getCombinedProgressChartData()} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">Avg</h2>
                <div className="row mb-4">
                  <div className="col">
                    <select className="form-select" value={selectedGradeChart} onChange={handleGradeChartChange}>
                      <option value="courseAvgFinalGrade">Course Avg Final Grade</option>
                      {groups.map(g => (
                        <option key={g._id} value={g.name}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col">
                    <select className="form-select" value={selectedTrainerForAvg || ''} onChange={handleTrainerChangeForAvg}>
                      <option value="">Select Trainer</option>
                      {trainers.map(t => (
                        <option key={t._id} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col">
                    <select className="form-select" value={selectedGradeType} onChange={handleGradeTypeChange}>
                      <option value="finalGrade">Final Grade</option>
                      <option value="changeTobeCommender">chance</option>
                      {/* Add other grade types as needed */}
                    </select>
                  </div>
                </div>
                <div style={{ width: '100%', height: '400px' }}>
                  <Line data={getAvgFinalGradeChartData()} options={gradeChartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}