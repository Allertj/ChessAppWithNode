import { Link } from "react-router-dom";


const NavBar = (data: any) => {
    const choseProfile  = () => {  data.profile()  }
    const choseLogin    = () => {  data.handlelogin("Login")  }
    const choseRegister = () => {  data.handlelogin("Register")  }


    // <MenuItem component={Link} to={'/first'}>Team 1</MenuItem>
    // <Link to="profile">Profile</Link>
    const loggedinmenu =   <ul className="nav-item"><li> <Link className="link" to="profile">Profile</Link></li>
                                                    <li onClick={choseLogin}>Logout</li></ul>
    const loggedoutmenu =  <ul className="nav-item"><li><Link className="link" to="login">Login</Link></li>
                                                    <li><Link className="link" to="register">Register</Link></li></ul>
    const loginconf = (data.active === "Profile" || data.active === "Game") ? loggedinmenu : loggedoutmenu
    return (<header>
               <nav className="navbar">
              <div id="title">CHESS - {data.userdata.username} - </div>
                {loginconf}
                </nav> 
            </header>)
//         const loggedinmenu =   <ul className="nav-item"><li onClick={choseProfile}>Profile </li>
//         <li onClick={choseLogin}>Logout</li></ul>
// const loggedoutmenu =  <ul className="nav-item"><li onClick={choseLogin}>Login</li>
//         <li onClick={choseRegister}>Register</li></ul>
// const loginconf = (data.active === "Profile" || data.active === "Game") ? loggedinmenu : loggedoutmenu
// return (<header>
// <nav className="navbar">
// <div id="title">CHESS - {data.userdata.username} - </div>
// {loginconf}
// </nav> 
// </header>)        
  }

export { NavBar }  