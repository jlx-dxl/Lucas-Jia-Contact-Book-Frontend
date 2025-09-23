import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

function AddContact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const userId = localStorage.getItem("userId")

  const validate = () => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = "Please enter a name."
    if (!email.trim()) {
      newErrors.email = "Please enter an email."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Hmm, that doesn’t look like a valid email address."
    }
    if (!phone.trim()) {
      newErrors.phone = "Please enter a phone number."
    } else if (!/^\+?\d{1,4}[\s-]?\d{3}[\s-]?\d{3,4}[\s-]?\d{3,4}$/.test(phone)) {
      newErrors.phone = "Phone numbers should look like (555) 123-4567."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const res = await fetch(`http://localhost:8080/api/contacts?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone })
      })
      if (res.ok) {
        navigate("/contacts")
      } else {
        console.error("Failed to create contact")
      }
    } catch (err) {
      console.error("Error:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 顶部导航 */}
      <div className="max-w-3xl mx-auto flex items-center space-x-2 text-sm mb-6">
        <Link to="/contacts" className="text-blue-600 hover:underline">
          ← Back to Contacts
        </Link>
        <span className="font-semibold">Add New Contact</span>
      </div>

      {/* 表单卡片 */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 头像上传占位 */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">👤</span>
            </div>
            <button
              type="button"
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Upload Photo
            </button>
            <span className="text-xs text-gray-500">JPG, PNG up to 5MB</span>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g. Jessica Wang"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g. jessica@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium">Phone *</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-md ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g. +1 (555) 321-0987"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* 按钮 */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 border rounded-md"
              onClick={() => navigate("/contacts")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name || !email || !phone}
              className={`px-4 py-2 rounded-md text-white ${
                !name || !email || !phone
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddContact
