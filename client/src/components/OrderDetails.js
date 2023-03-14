import { useEffect, useState }from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
// import { Link } from 'react-router-dom'

const getQueryString = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
      return unescape(r[2]);
  }
  return null;
}

const WorkoutDetails = ({request}) => {
  const {dispatch} = useWorkoutsContext()
  const [workout, setWorkout] = useState()
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch('/api/workouts/' + getQueryString('id'), {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        setWorkout(json)
        dispatch({type: 'SET_WORKOUTS', payload: json})
        // console.log(json)
        // console.log(user)
      }
    }

    if (user) {
      fetchWorkouts()
    }
  }, [dispatch, user])

  if(workout) {
    return (
      <div className="workout-details">
        <h2 style={{margin: 0}}>Record Tracker</h2>
        <p><strong>Style</strong>{workout.title}</p>
        <p><strong>Weight (kg)</strong>{workout.load}</p>
        <p><strong>Laps</strong>{workout.reps}</p>
        <p><strong>Create time</strong>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
        <br />
        <hr />
        <br />
        <p><strong>Name</strong>{user.userinfo.name || ''}</p>
        <p><strong>Email</strong>{user.userinfo.email || ''}</p>
        <p><strong>Address</strong>{user.userinfo.address || ''}</p>
      </div>
    )
  } else {
    <div className="workout-details"></div>
  }
}

export default WorkoutDetails