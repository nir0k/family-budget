// components/NavigationBar.js
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import './css/Auth.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars,
    faRightLeft,
    faCoins,
    faCreditCard,
    faChartLine,
    faHouse,
    faChartBar,
    faUser,
    faRightFromBracket,
    faPeopleRoof,
    faAddressCard
} from '@fortawesome/free-solid-svg-icons';


const NavigationBar = ({ userDetails }) => {
    const { username, familyTitle } = userDetails;
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);
    const menuDropdownRef = useRef(null);
    const isMainPageActive = useMatch('/');
    const isFamilyFinanceStateActive = useMatch('/family-finance-state')
    const isLoggedIn = Boolean(localStorage.getItem('authToken'));
    const isTransactionsActive = useMatch('/transactions');
    const isBudgetsActive = useMatch('/budget');
    const isAccountsActive = useMatch('/accounts');
    const isCategoriesActive = useMatch('/categories');
    const isLogout = useMatch('/logout')

    const toggleUserDropdown = () => {
        setUserDropdownOpen(!userDropdownOpen);
    };

    const toggleMenuDropdown = () => {
        setMenuDropdownOpen(!menuDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOutsideMenu = (event) => {
            if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target)) {
                setMenuDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideMenu);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideMenu);
        };
    }, []);

    return (
        <>
            <div className="nav-panel">
                {isLoggedIn && (
                    <div className="nav-links">
                        <div className="dropdown-container">
                            <span onClick={toggleMenuDropdown} className="menu-trigger">
                                <FontAwesomeIcon icon={faBars} style={{ color: "#ffffff" }} /> Menu
                            </span>
                            {menuDropdownOpen && (
                                <div className="dropdown-menu" ref={menuDropdownRef}>
                                    <NavLink to="/" className={isMainPageActive ? 'nav-link active-link' : 'nav-link'}>
                                        <FontAwesomeIcon icon={faHouse} className="fa-icon"/> Main Page
                                    </NavLink>
                                    <NavLink to="/transactions" className={isTransactionsActive ? 'nav-link active-link' : 'nav-link'}>
                                        <FontAwesomeIcon icon={faRightLeft} className="fa-icon" /> Transactions
                                    </NavLink>
                                    <NavLink to="/budget" className={isBudgetsActive ? 'nav-link active-link' : 'nav-link'}>
                                        <FontAwesomeIcon icon={faCoins} className="fa-icon" /> Budgets
                                    </NavLink>
                                    <NavLink to="/accounts" className={isAccountsActive ? 'nav-link active-link' : 'nav-link'}>
                                        <FontAwesomeIcon icon={faCreditCard} className="fa-icon"/> Accounts
                                    </NavLink>
                                    <NavLink to="/categories" className={isCategoriesActive ? 'nav-link active-link' : 'nav-link'}>
                                        <FontAwesomeIcon icon={faChartBar} className="fa-icon"/> Categories
                                    </NavLink>
                                    <NavLink to="/family-finance-state" className={isFamilyFinanceStateActive ? 'nav-link active-link' : 'nav-link'}>
                                        <FontAwesomeIcon icon={faChartLine} className="fa-icon"/> Family Finance State
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {isLoggedIn && (
                    <div className="dropdown-container" ref={userDropdownRef}>
                        {/* User Dropdown */}
                        {username && (
                            <span onClick={toggleUserDropdown} className="menu-trigger">
                                <FontAwesomeIcon icon={faUser} className="fa-icon"/>
                                {username && ` ${username}`}{familyTitle && ` (${familyTitle})`}
                            </span>
                        )}
                        {userDropdownOpen && (
                            <div className="dropdown-menu">
                                <NavLink to="/profile" className="nav-link">
                                    <FontAwesomeIcon icon={faAddressCard} className="fa-icon"/> Profile
                                </NavLink>
                                <NavLink to="/family" className="nav-link">
                                    <FontAwesomeIcon icon={faPeopleRoof} className="fa-icon"/> Family
                                </NavLink>
                                <NavLink to="/logout" className={isLogout ? 'nav-link active-link' : 'nav-link'}>
                                    <FontAwesomeIcon icon={faRightFromBracket} className="fa-icon"/> Logout
                                </NavLink>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default NavigationBar;
