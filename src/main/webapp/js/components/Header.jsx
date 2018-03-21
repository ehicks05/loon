import React from 'react';

export default class Header extends React.Component {

    getActiveStatus(tab1, shouldEqual)
    {
        if (tab1 === shouldEqual)
            return 'is-active';
        return '';
    }

    componentDidMount() {
        // Get all "navbar-burger" elements
        var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

        // Check if there are any navbar burgers
        if ($navbarBurgers.length > 0) {

            // Add a click event on each of them
            $navbarBurgers.forEach(function ($el) {
                $el.addEventListener('click', function () {

                    // Get the target from the "data-target" attribute
                    var target = $el.dataset.target;
                    var $target = document.getElementById(target);

                    // Toggle the class on both the "navbar-burger" and the "navbar-menu"
                    $el.classList.toggle('is-active');
                    $target.classList.toggle('is-active');

                });
            });
        }
    }

    render()
    {
        const pathName = this.props.pathName;
        const currentTab1 = this.props.currentTab1;
        const currentTab2 = this.props.currentTab2;
        const isAdmin = this.props.isAdmin;

        const adminSubscreens = this.props.adminSubscreens.map((adminSubscreen) =>
            <a key={adminSubscreen.description} className={"navbar-item " + this.getActiveStatus(currentTab2, adminSubscreen.tab2)} href={pathName + adminSubscreen.path}>
                <span className="icon is-medium has-text-info">
                    <i className={"fas fa-lg fa-" + adminSubscreen.icon}/>
                </span>
                {adminSubscreen.description}
            </a>
        );

        let adminSubtabs = null;
        if (isAdmin)
        {
            adminSubtabs =
                <div className={"navbar-item has-dropdown is-hoverable"}>
                    <a className={"navbar-link " + this.getActiveStatus(currentTab1, 'admin')}
                       href={pathName + "/view?tab1=admin&action=form"}>
                        Admin
                    </a>
                    <div className="navbar-dropdown">
                        {adminSubscreens}
                    </div>
                </div>
        }

        return (
            <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
                <div className="container">
                    <div className="navbar-brand">
                        <div className="navbar-item">
                            <img src={"images/loon.png"} alt="Loon" />
                        </div>

                        <button className="button navbar-burger" data-target="navMenu">
                            <span />
                            <span />
                            <span />
                        </button>
                    </div>

                    <div className="navbar-menu" id="navMenu">
                        <div className="navbar-start">
                            <a className={"navbar-item " + this.getActiveStatus(currentTab1, 'library')}
                               href={pathName + "/view?tab1=library&action=form"}>
                                Library
                            </a>
                            <a className={"navbar-item " + this.getActiveStatus(currentTab1, 'playlist')}
                               href={pathName + "/view?tab1=playlist&action=form"}>
                                Playlist
                            </a>
                            {adminSubtabs}
                        </div>
                        <div className="navbar-end">
                            <a className="navbar-item " href={pathName + "/logout"}>
                                <span className="icon is-medium has-text-light">
                                    <i className="fas fa-lg fa-sign-out-alt" />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}