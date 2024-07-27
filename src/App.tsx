import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import AddDapit  from "./pages/add_dapit";
import View from "./pages/view";
import Wall from "./pages/wall";
import { YourComponent } from "./pages/reg_try";
import { Login } from "./pages/Login";
import { CourseList } from "./pages/Store";
import  CourseReviewsPage  from "./pages/Course_reviews";
import { Nav_componnets } from "./components/Navbar";
import { useEffect, useState } from "react";
import Personal from "./pages/Personal";
import MyCourses from "./pages/MyCourses";
import MyReviews from "./pages/MyReviews";
import NewDapit from "./pages/new_dapit";
import Piano from "./pages/Piano";
import { instructorsData, trainersData, sessionsData, groupsData } from "./public/data";
import './App.css';
import './css/Login.css';
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = Boolean(sessionStorage.getItem("accessToken"));

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isLogin, setIsLogin] = useState(Boolean(sessionStorage.getItem("accessToken")));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLogin(Boolean(sessionStorage.getItem("accessToken")));
    };

    // Listen for the custom event
    window.addEventListener("sessionStorageChange", handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("sessionStorageChange", handleStorageChange);
    };
  }, []);

  return (
    <div>
      <Nav_componnets/>
      <Container className="mb-4">
        <Routes>
          <Route path="/Piano" element={<Piano group={"defult"}/>} />
          <Route path="/Wall" element={<Wall trainerName={"defult"}/>} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {isLogin ? null : <Route path="/register" element={<YourComponent />} />}
          <Route path="/login" element={<Login />} />
          <Route
            path="/AddDapit"
            element={<AddDapit instructors={instructorsData} trainers={trainersData} sessions={sessionsData} groups ={groupsData}  />}
          />
          <Route path="/newDapit" element={<NewDapit/>} />
          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <CourseList showFormFromParent={false} sendDatatoParentFromNewCourseForm={function (): void {
                  throw new Error("Function not implemented.");
                } } sendCourseIDToParent={function (): void {
                  throw new Error("Function not implemented.");
                } } />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course_review"
            element={
              <ProtectedRoute>
                <CourseReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/viewDapit" element={<View />} />
          <Route path="/personal"
           element={
           <ProtectedRoute>
            <Personal/>
            </ProtectedRoute>
           }
          />
          <Route path= "/personal/my-courses"
           element={
            <ProtectedRoute>
              <MyCourses/>
              </ProtectedRoute>
           }
            />
            <Route path = "/personal/my-reviews"
            element={
              <ProtectedRoute>
                <MyReviews/>
                </ProtectedRoute>
            }
            />
            
        </Routes>
      </Container>
    </div>
  );
}

export default App;
