import React from 'react';
import TextInput from "./TextInput.jsx";
import Select from "./Select.jsx";

export default class UserSettings extends React.Component {
    constructor(props) {
        super(props);
        let self = this;

        this.submitForm = this.submitForm.bind(this);
        this.reloadUsers = this.reloadUsers.bind(this);

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

    submitForm()
    {
        const self = this;
        const url = '/api/admin/users';
        const formData = new FormData(document.getElementById('frmAddUser'));

        fetch(url, {method: 'POST',body: formData})
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.reloadUsers();
            });
    }

    render()
    {
        if (!this.state.users)
            return (<div>Loading...</div>);

        const usersTable = this.state.users.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.fullName}</td>
                    <td>{user.roles.map(role => role.role).toString()}</td>
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
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Full Name</th>
                                <th>Roles</th>
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
            </div>);
    }
}