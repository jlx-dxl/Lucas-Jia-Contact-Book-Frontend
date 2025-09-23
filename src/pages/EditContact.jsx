import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"

function EditContact() {
  const location = useLocation()
  const navigate = useNavigate()
  const contact = location.state

  const [name, setName] = useState(contact?.name || "")
  const [email, setEmail] = useState(contact?.email || "")
  const [phone, setPhone] = useState(contact?.phone || "")
  const [errors, setErrors] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSave = async () => {
    const userId = localStorage.getItem("userId")

    // 前端只做必填检查
    const newErrors = {}
    if (!name.trim()) newErrors.name = "Name is required."
    if (!email.trim()) newErrors.email = "Email is required."
    if (!phone.trim()) newErrors.phone = "Phone is required."
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const res = await fetch(`http://localhost:8080/api/contacts/${contact.id}?userId=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      })

      if (res.ok) {
        navigate("/contacts")
      } else {
        const data = await res.json().catch(() => null)
        const errText = !data ? await res.text() : null

        if (data && data.errors) {
          setErrors(data.errors)
        } else if (data && data.message) {
          setErrors({ global: data.message })
        } else if (errText) {
          setErrors({ global: errText })
        } else {
          setErrors({ global: "Failed to update contact." })
        }
      }
    } catch (err) {
      setErrors({ global: "Error: " + err.message })
    }
  }

  const handleDelete = async () => {
    const userId = localStorage.getItem("userId")
    try {
      const res = await fetch(`http://localhost:8080/api/contacts/${contact.id}?userId=${userId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        navigate("/contacts")
      } else {
        const text = await res.text()
        setErrors({ global: text || "Failed to delete contact." })
      }
    } catch (err) {
      setErrors({ global: "Delete error: " + err.message })
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-md shadow">
      <h2 className="text-xl font-bold mb-4">Edit Contact</h2>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full border rounded p-2 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border rounded p-2 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full border rounded p-2 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* 全局错误 */}
        {errors.global && <p className="text-red-500 text-sm mt-2">{errors.global}</p>}
      </div>

      <div className="flex space-x-2 mt-6">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
        <button
          onClick={() => navigate("/contacts")}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>

      {/* 删除确认框 */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-md shadow p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this contact?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditContact
