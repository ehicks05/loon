import React from 'react';
import TextInput from "./TextInput.jsx";
import {inject, observer} from "mobx-react";
import Select from "./Select.jsx";

@inject('store')
@observer
export default class UserSettings extends React.Component {
    constructor(props) {
        super(props);
        let self = this;

        this.submitForm = this.submitForm.bind(this);
        this.reloadUsers = this.reloadUsers.bind(this);
        this.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.saveUser = this.saveUser.bind(this);

        self.state = {};
    }

    componentDidMount()
    {
        this.reloadUsers();
    }

    reloadUsers()
    {
        let self = this;
        fetch('/api/admin/users', {method: 'GET'})
            .then(response => response.json())
            .then(data => self.setState({users: data}));
    }

    showDeleteConfirmation(id)
    {
        this.setState({userIdToDelete: id});
        this.toggleModal();
    }

    deleteUser(id)
    {
        this.toggleModal();

        let self = this;
        fetch('/api/admin/users/' + id, {method: 'DELETE'})
            .then(response => response.text())
            .then(self.reloadUsers);
    }

    saveUser(id)
    {
        const formData = new FormData();
        formData.append('username', document.getElementById('username' + id).value);
        formData.append('fullName', document.getElementById('fullName' + id).value);
        formData.append('password', document.getElementById('password' + id).value);

        const selectedRoles = [...document.getElementById('roles' + id).options]
            .filter(option => option.selected)
            .map(option => option.value);
        formData.append('roles', selectedRoles);

        let self = this;
        fetch('/api/admin/users/' + id, {method: 'PUT', body: formData})
            .then(response => response.json())
            .then(self.reloadUsers);
    }

    toggleModal() {
        document.getElementById('confirmDelete').classList.toggle('is-active');
    }

    submitForm()
    {
        const self = this;
        const url = '/api/admin/users';
        const formData = new FormData(document.getElementById('frmAddUser'));

        fetch(url, {method: 'POST',body: formData})
            .then(response => response.json())
            .then(data => {
                console.log(data);
                self.reloadUsers();
            });
    }

    render()
    {
        if (!this.state.users)
            return (<div>Loading...</div>);

        const usersTable = this.state.users.map(user => {
            const isCurrentUser = user.id === this.props.store.uiState.user.id;
            const deleteButton = isCurrentUser ? '' : <button className="button is-danger" onClick={(e) => this.showDeleteConfirmation(user.id)}>Delete</button>;
            const saveButton = <button className="button" onClick={(e) => this.saveUser(user.id)}>Save</button>;

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
                            <input id="saveButton" type="button" value="Save" className="button is-primary" onClick={(e) => this.submitForm()} />
                        </span>
                    </form>
                </section>

                <div id="confirmDelete" className="modal">
                    <div className="modal-background" onClick={this.toggleModal}> </div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Confirm Delete</p>
                            <button className="delete" aria-label="close" onClick={this.toggleModal}> </button>
                        </header>
                        <section className="modal-card-body">
                            <div>
                                Are you sure you want to delete this user?
                            </div>
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button is-danger" onClick={(e) => this.deleteUser(this.state.userIdToDelete)}>Delete</button>
                            <button className="button" onClick={this.toggleModal}>Cancel</button>
                        </footer>
                    </div>
                </div>
            </div>);
    }
}