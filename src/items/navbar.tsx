import { Link } from "react-router-dom";

const NavBar = ({username, handleLogout} : {username: string, handleLogout: () => void}) => {
    const loggedinmenu =   <ul className="nav-item"><li><Link className="link" to="profile">Profile</Link></li>
                                                    <li onClick={handleLogout}>Logout</li></ul>
    const loggedoutmenu =  <ul className="nav-item"><li><Link className="link" to="login">Login</Link></li>
                                                    <li><Link className="link" to="register">Register</Link></li></ul>
    const loginconf = (username !== "") ? loggedinmenu : loggedoutmenu
    return (<header>
               <nav className="navbar">
              <div id="title">CHESS - {username}</div>
                {loginconf}
                </nav> 
            </header>) 
  }

export { NavBar }  