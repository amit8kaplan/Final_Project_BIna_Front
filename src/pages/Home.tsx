import 'bootstrap/dist/css/bootstrap.min.css';

export function Home() {
  return (
  <div className="d-flex flex-column justify-content-center align-items-center bg-light">
    <h1 className="mb-4">Welcome to the BIna Web App</h1>
    <img src="../src/assets/UAV_Operator_School_symbol.png" className="img-fluid mb-4" style={{ maxWidth: '300px' }} />
  </div>
  );
}