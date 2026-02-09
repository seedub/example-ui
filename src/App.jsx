import { useState, useEffect } from 'react'
import './App.css'

const API_BASE_URL = 'https://example-api.iamscribe.org'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newItemName, setNewItemName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')

  // Fetch all items on component mount
  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/api/items`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setItems(data || [])
    } catch (error) {
      setError('Error fetching items')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!newItemName.trim()) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newItemName }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setNewItemName('')
      await fetchItems()
    } catch (error) {
      setError('Error adding item')
      console.error('Error:', error)
    }
  }

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      await fetchItems()
    } catch (error) {
      setError('Error deleting item')
      console.error('Error:', error)
    }
  }

  const handleUpdateItem = async (id) => {
    if (!editingName.trim()) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingName }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setEditingId(null)
      setEditingName('')
      await fetchItems()
    } catch (error) {
      setError('Error updating item')
      console.error('Error:', error)
    }
  }

  const startEditing = (item) => {
    setEditingId(item.id)
    setEditingName(item.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
  }

  return (
    <>
      <h1>Items Manager</h1>
      <p>Manage your items using the example API</p>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <form onSubmit={handleAddItem} className="add-item-form">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Enter item name"
            className="item-input"
          />
          <button type="submit" className="add-button" aria-label="Add new item">Add Item</button>
        </form>
      </div>

      <div className="items-container" aria-live="polite" aria-atomic="false">
        {loading ? (
          <p>Loading items...</p>
        ) : items.length === 0 ? (
          <p>No items yet. Add your first item above!</p>
        ) : (
          <ul className="items-list">
            {items.map((item) => (
              <li key={item.id} className="item">
                {editingId === item.id ? (
                  <div className="edit-item">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="item-input"
                      aria-label="Edit item name"
                    />
                    <button onClick={() => handleUpdateItem(item.id)} className="save-button" aria-label={`Save changes to ${editingName}`}>
                      Save
                    </button>
                    <button onClick={cancelEditing} className="cancel-button">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="view-item">
                    <span className="item-name">{item.name}</span>
                    <div className="item-actions">
                      <button onClick={() => startEditing(item)} className="edit-button" aria-label={`Edit ${item.name}`}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteItem(item.id)} className="delete-button" aria-label={`Delete ${item.name}`}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default App
