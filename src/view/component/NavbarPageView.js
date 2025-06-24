
// import React, { useEffect, useState } from 'react'
// import Logo from "./logo.png"
// import { Link,NavLink } from "react-router-dom"
// import "./navbarView.css"
// import { FaHome } from "react-icons/fa";
// import { FcAbout } from "react-icons/fc";
// import { GrServices } from "react-icons/gr";
// import { IoIosContact } from "react-icons/io";
// import { IoLanguage } from "react-icons/io5";
// import { FaBloggerB } from "react-icons/fa";

// const NavbarPageView = () => {
    
//     const [menuOpen, setMenuOpen] = useState(false);
//     return (
//         <nav className='contianer'>
//         <Link to="/" className="title">
//         <img src={Logo} style={{ width: 270, objectFit: 'contain', borderRadius: 40, marginRight: 10 }} />
          
//         </Link>
//         <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
//           <span></span>
//           <span></span>
//           <span></span>
//         </div>
//         <ul className={menuOpen ? "open" : ""}>
//           <li> <Link to={'/home-page'}> <FaHome /> home</Link></li>
//           <li> <NavLink to="/about"><FcAbout /> About Us</NavLink></li>
//           <li> <NavLink to="/services"><GrServices /> About Patient Care</NavLink>  </li>
//           <li> <NavLink to="/contact"><IoIosContact /> Patient Care</NavLink></li>
//           <li> <NavLink to="/contact"><FaBloggerB /> Blog</NavLink></li>
//           <li><NavLink to="/about"><IoLanguage /> KH | EN</NavLink> </li>
//         </ul>
//       </nav>
        
       
//     )

// };
// export default NavbarPageView;

