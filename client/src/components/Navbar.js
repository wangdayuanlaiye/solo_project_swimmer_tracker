import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
    logout()
  }

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>ICE CREAM SHOP</h1>
        </Link>
        <nav>
          {user && (
            <div className="nav">
              <span className="material material-symbols-outlined">home</span>
              <Link to="/">Home</Link>
              <span className="material material-symbols-outlined">person</span>
              <Link to="/user">{user.email}</Link>
              <span className="material material-symbols-outlined" onClick={handleClick}>logout</span>              
              <a onClick={handleClick} href="#">Log out</a>
            </div>
          )}
          {!user && (
            <div className="nav">
              <Link className='material' to="/login">Login</Link>
              <Link className='material' to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar