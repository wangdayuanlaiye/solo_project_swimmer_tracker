import { useState } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from '../hooks/useAuthContext'

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()

  const [title, setTitle] = useState('')
  const [load, setLoad] = useState('')
  const [reps, setReps] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const workout = {title, load, reps}

    const response = await fetch('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }
    if (response.ok) {
      setTitle('')
      setLoad('')
      setReps('')
      setError(null)
      setEmptyFields([])
      dispatch({type: 'CREATE_WORKOUT', payload: json})
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <div className="create-from">
        <h3>Add New Swimming Record</h3>
        <label>Swimming Style:</label>
        <input 
          type="text"

          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className={emptyFields.includes('title') ? 'error' : ''}
        />

        <label>Swimmer Weight (kg):</label>
        <input 
          type="number"
          step="0.25"
          min="0"
          onChange={(e) => setLoad(e.target.value)}
          value={load}
          className={emptyFields.includes('load') ? 'error' : ''}
        />

        <label>Laps:</label>
        <input 
          type="number"
          min="0"
          onChange={(e) => setReps(e.target.value)}
          value={reps}
          className={emptyFields.includes('reps') ? 'error' : ''}
        />

        <button>Add Record</button>
        {error && <div className="error">{error}</div>}        
      </div>
    </form>
  )
}

export default WorkoutForm