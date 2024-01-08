import ListGroup from "./ListGroup"

function App() {
  const name = 'Eliav'

  const getName = () => {
    return name
  }

  return (
    <>
      <h1>Hello!! {getName()}</h1>
      <ListGroup />
    </>
  )
}

export default App
