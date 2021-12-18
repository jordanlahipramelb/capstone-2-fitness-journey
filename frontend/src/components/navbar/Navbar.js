import React, { useContext } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";

/** Site-wide navigation bar
 *
 * Rendered by app.
 * logOut function prop passed in by App.
 *
 */

const Navbar = ({ logout }) => {
  /** currentUser: Provided from UserContext in App in order to obtain currentUser, which verifies if a user is logged in. */
  const { currentUser } = useContext(UserContext);

  // Navigation renders if user is logged in
  const loggedInUser = () => {
    return (
      <nav>
        <ul className="navbar-nav flex-row">
          <NavLink to="/exercises" className="nav-link">
            Exercises
          </NavLink>
          <NavLink to="/routines" className="nav-link">
            Routines
          </NavLink>
          <NavLink to="/forum" className="nav-link">
            Forum
          </NavLink>
          <NavLink to="/profile" className="nav-link">
            Profile
          </NavLink>
          <NavLink to="/" className="nav-link" onClick={logout}>
            Log out {currentUser.first_name || currentUser.username}
          </NavLink>
        </ul>
      </nav>
    );
  };

  // Navigation renders if user is logged out
  const loggedOutUser = () => {
    return (
      <nav>
        <ul className="navbar-nav flex-row">
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
          <NavLink className="nav-link" to="/register">
            Sign Up
          </NavLink>
        </ul>
      </nav>
    );
  };

  return (
    <header className="Navbar px-3 pb-2 mb-5">
      <Link to="/">
        <h1>Fitness Journey</h1>
      </Link>
      <p className="lead">Your one stop to a better you.</p>

      {currentUser ? loggedInUser() : loggedOutUser()}
    </header>
  );
};

export default Navbar;