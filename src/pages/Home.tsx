import { useEffect, useState } from 'react';
import * as React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiClient from '../services/api-client';

interface ProgressSession {
  session: number;
  finished: number;
  total: number;
}

interface AvgResult {
  session: number;
  prevCourseAvg: number;
  thisCourseAvg: number;
}

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Home() {
  const [progressData, setProgressData] = useState<ProgressSession[]>([]);
  const [avgResultsData, setAvgResultsData] = useState<AvgResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the server
    const fetchData = async () => {
      try {
        const progressResponse = await apiClient.get('/progress/progress_Data');
        setProgressData(progressResponse.data);
        // console.log(progressResponse.data);

        const avgResultsResponse = await apiClient.get('/progress/avg_progress');
        setAvgResultsData(avgResultsResponse.data);
        // console.log(avgResultsResponse.data);

        setLoading(false);
      } catch (err) {
        setError('Error fetching data from server');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Prepare data for the progress chart
  const progressChartData = {
    labels: progressData.map((session) => `Session ${session.session}`),
    datasets: [{
      label: 'Course Progress',
      data: progressData.map((session) => session.finished),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  // Prepare data for the avg results chart
  const avgResultsChartData = {
    labels: avgResultsData.map((result) => `Session ${result.session}`),
    datasets: [
      {
        label: 'Previous Courses',
        data: avgResultsData.map((result) => result.prevCourseAvg),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)'
      },
      {
        label: 'This Course',
        data: avgResultsData.map((result) => result.thisCourseAvg),
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1)'
      }
    ]
  };
  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light" style={{ minHeight: '100vh', padding: '20px' }}>
      <h1 className="mb-4">Welcome to the BIna Web App</h1>
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-4">
            <h2>Course Progress</h2>
            <div style={{ width: '100%', height: '400px' }}>
              <Bar data={progressChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <h2>Average Results</h2>
            <div style={{ width: '100%', height: '400px' }}>
              <Line data={avgResultsChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
      {/* <img src="../src/assets/UAV_Operator_School_symbol.png" className="img-fluid mb-4" style={{ maxWidth: '300px' }} /> */}
   
}
