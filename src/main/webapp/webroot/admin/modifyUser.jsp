<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:useBean id="user" type="net.ehicks.loon.beans.User" scope="request"/>

<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../inc_title.jsp"/>
    <jsp:include page="../inc_header.jsp"/>

    <script>

    </script>
</head>
<body>

<jsp:include page="../header.jsp"/>

<section class="hero is-primary is-small">
    <div class="hero-body">
        <div class="container">
            <h1 class="title">
                Modify User ${user.logonId}
            </h1>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="columns is-multiline is-centered">
            <div class="column">
                <form id="frmUser" method="post" action="${pageContext.request.contextPath}/view?tab1=admin&tab2=users&tab3=modify&action=modify&userId=${user.id}">
                    <t:text id="userId" label="User Id" value="${user.id}" isStatic="true" />
                    <t:text id="logonId" label="Logon Id" value="${user.logonId}" />
                    <t:text id="firstName" label="First Name" value="${user.firstName}" />
                    <t:text id="lastName" label="Last Name" value="${user.lastName}" />
                    <t:checkbox id="enabled" label="Enabled" checked="${user.enabled}" />

                    <input id="saveUserButton" type="submit" value="Save" class="button is-primary" />
                    <input id="changePasswordButton" type="button" value="Change Password" class="button" />
                </form>
            </div>
        </div>
    </div>
</section>

<div class="modal" id="changePasswordDialog">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Change Password</p>
            <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
            <form id="frmChangePassword" name="frmChangePassword" method="post" action="${pageContext.request.contextPath}/view?tab1=admin&tab2=users&action=changePassword&userId=${user.id}">
                <t:text id="password" label="New Password" required="true"/>
            </form>
        </section>

        <footer class="modal-card-foot">
            <button type="button" class="button is-primary change">Change</button>
            <button type="button" class="button close">Cancel</button>
        </footer>
    </div>
</div>

<script>
    initDialog('changePassword');

    $(function () {
        document.querySelector('#changePasswordDialog .change').addEventListener('click', function ()
        {
            if (!document.querySelector('#password').value)
                alert('Please enter a password.');
            else
                $('#frmChangePassword').submit();
        });
    });
</script>

<jsp:include page="../footer.jsp"/>
</body>
</html>