// import { useState } from "react"
// import ListGroup from "./ListGroup"
// import Alert from "./Alert"

// function App() {
//   const [cities, setCities] = useState(["London", "New York", "Paris", "Tokyo", "Delhi", "Dubai"])
//   const [cars, setCars] = useState(["BMW", "Mercedes", "Audi", "Lamborghini", "Ferrari", "Porsche"])
//   const [displayAleret, setDisplayAlert] = useState(false)

//   const onDeleteCity = (index: number) => {
//     console.log("Deleting city at index: " + index)
//     const tmp = cities.filter((city, i) => i !== index)
//     setCities(tmp)
//   }

//   const onDeleteCar = (index: number) => {
//     console.log("Deleting car at index: " + index)
//     setCars(cars.filter((car, i) => i !== index))
//   }

//   const openAlert = () => {
//     setDisplayAlert(true)
//   }

//   const onDismiss = () => {
//     setDisplayAlert(false)
//   }
//   return (
//     <div className="p-2">
//       {displayAleret && <Alert onDismiss={onDismiss}>This is an Alert!!!</Alert>}
//       <h1>Cities!!</h1>
//       <ListGroup items={cities} onDeleteItem={onDeleteCity} />

//       <h1>Cars!!</h1>
//       <ListGroup items={cars} onDeleteItem={onDeleteCar} />
//       <div className="mx-auto pt-2 d-flex" style={{ width: "300px" }}>
//         <button type="button"
//           className="btn btn-primary flex-fill"
//           onClick={openAlert}>
//           Open alert
//         </button>
//       </div>
//     </div>
//   )
// }
import { Routes, Route, Navigate } from "react-router-dom"
import { Container } from "react-bootstrap"
import { Home } from "./pages/Home"
import { About } from "./pages/About"
import { YourComponent } from "./pages/reg_try"
import { Login } from "./pages/Login"
import { Store } from "./pages/Store"
import { Course_reviews } from "./pages/Coursr_reviews"
import { Nav_componnets } from "./components/Navbar"
import { useEffect, useState } from "react";

let accessToken: string | null = null
const isAuth = () => {
  return !!accessToken
}

const ProtectedRoute = ({ element, ...rest }: any) => {
  if (isAuth()) {
    return <Route {...rest} element={element} />
  } else {
    return <Navigate to="/login" />
  }
}

function App() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    accessToken = localStorage.getItem("accessToken")
    setLoading(false)
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Nav_componnets />
      <Container className="mb-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<YourComponent/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/store" element={<Store />} />
          <Route path="/course_review" element={<Course_reviews />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
