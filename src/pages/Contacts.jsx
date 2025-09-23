import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Contacts() {
  const [contacts, setContacts] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [search, setSearch] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  // 加载联系人
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      navigate("/login")
      return
    }
    fetchContacts(userId)
  }, [navigate])

  // 封装获取 contacts 的方法
  const fetchContacts = async (userId, query = "") => {
    try {
      let url = `http://localhost:8080/api/contacts?userId=${userId}`
      if (query) {
        url += `&q=${encodeURIComponent(query)}`
      }
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setContacts(data)
      } else {
        console.error("Failed to fetch contacts")
      }
    } catch (err) {
      console.error("Error:", err)
    }
  }

  // 搜索逻辑（防抖）
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) return

    const delayDebounce = setTimeout(() => {
      fetchContacts(userId, search)
    }, 500) // 500ms 停止输入后再请求

    return () => clearTimeout(delayDebounce)
  }, [search])

  const toggleSelect = (id) => {
    const newSet = new Set(selected)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelected(newSet)
  }

  const allSelected = contacts.length > 0 && selected.size === contacts.length
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(contacts.map(c => c.id)))
    }
  }

  // 跳转到 EditContact 页面
  const handleEdit = () => {
    if (selected.size !== 1) {
      alert("Please select exactly one contact to edit")
      return
    }
    const contactId = [...selected][0]
    const contact = contacts.find(c => c.id === contactId)
    navigate("/editcontact", { state: contact })
  }

  // 退出登录
  const handleSignOut = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("userEmail")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
              B
            </div>
            <span className="text-lg font-bold text-gray-900">Contact Manager</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-sm text-gray-600"
            >
              {localStorage.getItem("userEmail")} ▾
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow">
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 蓝色 banner */}
      <div className="bg-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h1 className="text-3xl font-bold">Your Contacts</h1>
          <p className="mt-1 text-base opacity-90">
            Manage your personal and business connections
          </p>
        </div>
      </div>

      {/* 内容区域 */}
      <main className="max-w-7xl mx-auto mt-6 px-4">
        {/* 搜索栏 + Add Contact */}
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts by name, email, or phone..."
            className="w-1/2 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button
            onClick={() => navigate("/addcontact")}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Contact
          </button>
        </div>

        {/* 批量操作栏 */}
        {selected.size > 0 && (
          <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md mb-3">
            <span className="text-sm text-gray-600">
              {selected.size} selected
            </span>
            <div className="space-x-2">
              <button
                onClick={handleEdit}
                className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Edit
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        )}

        {/* 联系人表格 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contacts.map((c) => (
                <tr
                  key={c.id}
                  className={selected.has(c.id) ? "bg-blue-50" : ""}
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                    />
                  </td>
                  <td className="px-4 py-2 flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200" /> {/* avatar placeholder */}
                    <span>{c.name}</span>
                  </td>
                  <td className="px-4 py-2 text-blue-600">{c.email}</td>
                  <td className="px-4 py-2">{c.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default Contacts
