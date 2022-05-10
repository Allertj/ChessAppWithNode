import { Link } from "react-router-dom";

const NavBar = (data: any) => {
    const loggedinmenu =   <ul className="nav-item"><li> <Link className="link" to="profile">Profile</Link></li>
                                                    <li onClick={data.handleLogout}>Logout</li></ul>
    const loggedoutmenu =  <ul className="nav-item"><li><Link className="link" to="login">Login</Link></li>
                                                    <li><Link className="link" to="register">Register</Link></li></ul>
    const loginconf = (Object.keys(data.userdata).length !== 0) ? loggedinmenu : loggedoutmenu
    return (<header>
               <nav className="navbar">
              <div id="title">CHESS - {data.userdata.username} - {data.userdata.id}</div>
                {loginconf}
                </nav> 
            </header>) 
  }

export { NavBar }  