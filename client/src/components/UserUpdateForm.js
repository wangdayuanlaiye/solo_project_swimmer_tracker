import { useState } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from '../hooks/useAuthContext'

const UpdateUserInfo = () => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()

  const [name, setName] = useState(user.userinfo.name)
  const [email, setEmail] = useState(user.userinfo.email)
  const [address, setAddress] = useState(user.userinfo.address)
  const [password, setPassword] = useState()
  const [confirmPW, setConfirmPW] = useState(user.userinfo.confirmPW)

  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const workout = {_id: user.userinfo._id, name, address, email, password, confirmPW}

    const response = await fetch('/api/user/userinfo', {
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
      setName('')
      setEmail('')
      setAddress('')
      setPassword('')
      setConfirmPW('')
      // 跳转登陆
      localStorage.removeItem('user')

      setError(null)
      setEmptyFields([])
      dispatch({type: 'CREATE_WORKOUT', payload: json})
      
    }
  }

  return (
    <form className="create" style={{width: 700, margin: '0 auto'}} onSubmit={handleSubmit}>
      <div className="create-from">
        <h3>Update User Info</h3>

        <label>Name:</label>
        <input 
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          className={emptyFields.includes('name') ? 'error' : ''}
        />

        <label>Address:</label>
        <input 
          type="text"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          className={emptyFields.includes('address') ? 'error' : ''}
        />

        <label>Email:</label>
        <input 
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className={emptyFields.includes('email') ? 'error' : ''}
        />

        <label>Password:</label>
        <input 
          type="text"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className={emptyFields.includes('password') ? 'error' : ''}
        />
        
        <label>Confirm PW:</label>
        <input 
          type="text"
          onChange={(e) => setConfirmPW(e.target.value)}
          value={confirmPW}
          className={emptyFields.includes('confirmPW') ? 'error' : ''}
        />

        <button>Update User Info</button>
        {error && <div className="error">{error}</div>}
      </div>
    </form>
  )
}

export default UpdateUserInfo