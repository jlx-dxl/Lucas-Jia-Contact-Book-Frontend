import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Contacts from "./pages/Contacts"
import AddContact from "./pages/AddContact"
import EditContact from "./pages/EditContact"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/addcontact" element={<AddContact />} />
      <Route path="/editcontact" element={<EditContact />} />
      <Route path="/" element={<Login />} />
    </Routes>
  )
}

export default App
