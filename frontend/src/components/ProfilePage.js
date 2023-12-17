// ProfilePage.js
import React, { useState, useEffect } from 'react';
import { fetchUserProfile, updateUserProfile, deleteUserProfile } from './Api';
import './css/Profile.css'
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [originalProfile, setOriginalProfile] = useState(null);
    const navigate = useNavigate();

    const toggleEditMode = () => {
        if (!isEditMode) {
            setOriginalProfile({ username, email, firstName, lastName });
        }
        setIsEditMode(!isEditMode);
    };
    

    const handleDeleteProfile = async () => {
        const confirmation = window.confirm("Are you sure you want to permanently delete your profile? This action cannot be undone.");
        if (confirmation) {
            const response = await deleteUserProfile();
            if (response.ok) {
                // Handle the UI response here, such as redirecting to the login page
                // or showing a success message
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        const loadProfile = async () => {
            const profileData = await fetchUserProfile();
            setProfile(profileData);
            setUsername(profileData.username);
            setEmail(profileData.email);
            setFirstName(profileData.first_name || '');
            setLastName(profileData.last_name || '');
        };

        loadProfile();
    }, []);

    const handleUpdateProfile = async () => {
        const updatedProfile = {
            username,
            email,
            first_name: firstName,
            last_name: lastName
        };
        await updateUserProfile(updatedProfile);
        setIsEditMode(false);
    };

    const handleCancelEdit = () => {
        if (originalProfile) {
            setUsername(originalProfile.username);
            setEmail(originalProfile.email);
            setFirstName(originalProfile.firstName);
            setLastName(originalProfile.lastName);
        }
        setIsEditMode(false);
    };
    

    if (!profile) return <div>Loading...</div>;

    return (
        <div className="profile-page-container main-page-container">
            <h1>Profile</h1>
            {isEditMode ? (
                <>
                    <div className="profile-item">
                        <label>Username:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="profile-item">
                        <label>Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="profile-item">
                        <label>First Name:</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="profile-item">
                        <label>Last Name:</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <button onClick={handleUpdateProfile}>Save Changes</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                </>
            ) : (
                <>
                    <div className="profile-item">
                        <span className="profile-label">Username:</span>
                        <span className="profile-value"> {username}</span>
                    </div>
                    <div className="profile-item">
                        <span className="profile-label">Email:</span>
                        <span className="profile-value"> {email}</span>
                    </div>
                    <div className="profile-item">
                        <span className="profile-label">First name:</span>
                        <span className="profile-value"> {firstName}</span>
                    </div>
                    <div className="profile-item">
                        <span className="profile-label">Last name:</span>
                        <span className="profile-value"> {lastName}</span>
                    </div>
                    <button onClick={toggleEditMode}>Edit Profile</button>
                    <button className="delete-button" onClick={handleDeleteProfile}>Delete Profile</button>

                </>
            )}
        </div>
    );
};

export default ProfilePage;
