// FamilyPage.js
import React, { useState, useEffect } from 'react';
import { fetchFamilies, fetchUserById, updateFamilyTitle, removeFamilyMember, addFamilyMember } from './Api';
import './css/Family.css';

const FamilyPage = () => {
    const [families, setFamilies] = useState([]);
    const [editingFamilyId, setEditingFamilyId] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [addingToFamilyId, setAddingToFamilyId] = useState(null);

    const loadFamilies = async () => {
        const familyData = await fetchFamilies();
        const familiesWithMemberDetails = await Promise.all(familyData.map(async (family) => {
            const memberDetails = await Promise.all(family.members.map(fetchUserById));
            return { ...family, members: memberDetails.filter(member => member) };
        }));
        setFamilies(familiesWithMemberDetails);
    };
    
    const addMember = async (familyId) => {
        const response = await addFamilyMember(familyId, newMemberEmail);
        if (response && response.detail === "Member added successfully.") {
            await loadFamilies();
        }
        setAddingToFamilyId(null);
        setNewMemberEmail('');
    };

    useEffect(() => {
        loadFamilies();
    }, []);

    const startEditFamily = (family) => {
        setEditingFamilyId(family.id);
        setEditedTitle(family.title);
    };

    const saveEditFamily = async (familyId) => {
        await updateFamilyTitle(familyId, editedTitle);
        setFamilies(families.map(family => {
            if (family.id === familyId) {
                return { ...family, title: editedTitle };
            }
            return family;
        }));
        setEditingFamilyId(null);
    };
    

    const deleteMember = async (familyId, memberId) => {
        await removeFamilyMember(familyId, memberId);
        setFamilies(families.map(family => {
            if (family.id === familyId) {
                return { 
                    ...family, 
                    members: family.members.filter(member => member.id !== memberId)
                };
            }
            return family;
        }));
    };
    

    return (
        <div className="family-page-container main-page-container">
            {families.map(family => (
                <div key={family.id}>
                    <div className="family-header">
                        {editingFamilyId === family.id ? (
                            <>
                                <input 
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                />
                                <button onClick={() => saveEditFamily(family.id)}>Save</button>
                            </>
                        ) : (
                            <>
                                <h2>{family.title}</h2>
                                <button onClick={() => startEditFamily(family)}>Edit</button>
                            </>
                        )}
                    </div>
                    <ul>
                        {family.members.map(member => (
                            <li key={member.id}>
                                {member.username} ({member.first_name} {member.last_name})
                                <button onClick={() => deleteMember(family.id, member.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    {addingToFamilyId === family.id ? (
                        <>
                            <input 
                                type="email" 
                                value={newMemberEmail} 
                                onChange={(e) => setNewMemberEmail(e.target.value)}
                                placeholder="Enter member's email"
                            />
                            <button onClick={() => addMember(family.id)}>Add Member</button>
                        </>
                    ) : (
                        <button onClick={() => setAddingToFamilyId(family.id)}>Add New Member</button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FamilyPage;
