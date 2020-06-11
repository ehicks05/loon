import React, {useEffect, useState} from 'react';
import TextInput from "../TextInput";
import Select from "../Select";
import superFetch from "../../common/SuperFetch";

export default function UserSettings()  {

    const [currentUser, setCurrentUser] = useState({});
    const [users, setUsers] = useState([]);
    const [userIdToDelete, setUserIdToDelete] = useState('');

    useEffect(() => {
        function getCurrentUser()
        {
            // todo this logic is duplicated from UiState.js
            return fetch('/api/users/current', {method: 'GET'})
                .then(response => response.json())
                .then(data => setCurrentUser(data));
        }

        getCurrentUser();

        loadUsers();
    }, []);

    // USER CALLS //

    function createUser(formData) {
        return superFetch('/api/admin/users', {method: 'POST', body: formData})
            .then(response => response.json())
            .then(() => loadUsers());
    }

    function updateUser(id, formData) {
        return superFetch('/api/admin/users/' + id, {method: 'PUT', body: formData})
            .then(response => response.json())
            .then(() => loadUsers());
    }

    function deleteUserFETCH(id) {
        return superFetch('/api/admin/users/' + id, {method: 'DELETE'})
            .then(response => response.text())
            .then(() => loadUsers());
    }

    function loadUsers() {
        return fetch('/api/admin/users', {method: 'GET'})
            .then(response => response.json())
            .then(json => setUsers([...json]));
    }

    function showDeleteConfirmation(id)
    {
        setUserIdToDelete(id);
        toggleModal();
    }

    function deleteUser(id)
    {
        toggleModal();
        deleteUserFETCH(id);
    }

    function saveUser(id)
    {
        const formData = new FormData();
        formData.append('username', document.getElementById('username' + id).value);
        formData.append('fullName', document.getElementById('fullName' + id).value);
        formData.append('password', document.getElementById('password' + id).value);

        const selectedRoles = [...document.getElementById('roles' + id).options]
            .filter(option => option.selected)
            .map(option => option.value);
        formData.append('roles', selectedRoles);

        updateUser(id, formData);
    }

    function toggleModal() {
        document.getElementById('confirmDelete').classList.toggle('is-active');
    }

    function submitForm()
    {
        const formData = new FormData(document.getElementById('frmAddUser'));
        createUser(formData);
    }

    if (!users)
        return (<div>Loading...</div>);

    const usersTable = users.map(user => {
        const isCurrentUser = user.id === currentUser.id;
        const deleteButton = isCurrentUser ? '' : <button className="button is-danger" onClick={() => showDeleteConfirmation(user.id)}>Delete</button>;
        const saveButton = <button className="button" onClick={() => saveUser(user.id)}>Save</button>;

        return (
            <tr key={user.id}>
                <td><TextInput id={'username' + user.id} value={user.username}/></td>
                <td><TextInput id={'fullName' + user.id} value={user.fullName}/></td>
                <td><TextInput id={'password' + user.id} value={user.password}/></td>
                <td>
                    <Select id={'roles' + user.id} required={true} multiple={true} value={user.roles.map(role => role.role)}
                            items={[{text: 'USER', value: 'ROLE_USER'}, {text: 'ADMIN', value: 'ROLE_ADMIN'}]} size={2}/>
                </td>
                <td>
                    <div className="buttons">{saveButton}{deleteButton}</div>
                </td>
            </tr>
        );
    });

    return (
        <div>
            <section className={"section"}>
                <h1 className="title">Admin</h1>
                <h2 className="subtitle">
                    Users
                </h2>
            </section>
            <section className="section">
                <table className="table" style={{display: 'block',overflowX: 'auto'}}>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Full Name</th>
                        <th>Password</th>
                        <th>Roles</th>
                        <th> </th>
                    </tr>
                    </thead>
                    <tbody>
                    {usersTable}
                    </tbody>
                </table>
            </section>

            <section className="section">
                <h2 className="subtitle">
                    Add User
                </h2>

                <form id="frmAddUser" method="post" action="">
                    <TextInput id="username" label="Username" value="" />
                    <TextInput id="fullname" label="Full Name" value="" />
                    <TextInput id="password" label="Password" value="" />

                    <span className="buttons">
                            <input id="saveButton" type="button" value="Save" className="button is-primary" onClick={() => submitForm()} />
                        </span>
                </form>
            </section>

            <div id="confirmDelete" className="modal">
                <div className="modal-background" onClick={toggleModal}> </div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Confirm Delete</p>
                        <button className="delete" aria-label="close" onClick={toggleModal}> </button>
                    </header>
                    <section className="modal-card-body">
                        <div>
                            Are you sure you want to delete this user?
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-danger" onClick={() => deleteUser(userIdToDelete)}>Delete</button>
                        <button className="button" onClick={toggleModal}>Cancel</button>
                    </footer>
                </div>
            </div>
        </div>);
}