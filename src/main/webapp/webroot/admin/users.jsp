<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="users" type="java.util.List<net.ehicks.loon.beans.User>" scope="request"/>

<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../inc_title.jsp"/>
    <jsp:include page="../inc_header.jsp"/>

    <script>
        function deleteUser(userId)
        {
            if (confirm('Are you sure?'))
                location.href="${pageContext.request.contextPath}/view?tab1=admin&tab2=users&action=delete&userId=" + userId;
        }
    </script>
</head>
<body>

<jsp:include page="../header.jsp"/>

<section class="hero is-primary is-small">
    <div class="hero-body">
        <div class="container">
            <h1 class="title">
                Manage Users
            </h1>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="columns is-multiline is-centered">
            <div class="column is-narrow">
                <table class="table is-striped is-narrow is-hoverable is-fullwidth">
                    <thead>
                    <tr>
                        <th>
                            <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="table-header">
                                <input type="checkbox" id="table-header" class="mdl-checkbox__input" />
                            </label>
                        </th>
                        <th class="has-text-right">Object Id</th>
                        <th>Logon Id</th>
                        <th>Name</th>
                        <th class="has-text-centered">Enabled</th>
                        <th></th>
                    </tr>
                    </thead>
                    <c:forEach var="user" items="${users}" varStatus="loop">
                        <tr>
                            <td>
                                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="row[${loop.count}]">
                                    <input type="checkbox" id="row[${loop.count}]" class="mdl-checkbox__input" />
                                </label>
                            </td>
                            <td class="has-text-right"><a href="${pageContext.request.contextPath}/view?tab1=profile&action=form&userId=${user.id}">${user.id}</a></td>
                            <td><a href="${pageContext.request.contextPath}/view?tab1=admin&tab2=users&tab3=modify&action=form&userId=${user.id}">${user.logonId}</a></td>
                            <td>${user.name}</td>
                            <td class="has-text-centered">
                                <c:if test="${user.enabled}"><i class="fas fa-check has-text-success" ></i></c:if>
                                <c:if test="${!user.enabled}"><i class="fas fa-ban has-text-danger" ></i></c:if>
                            </td>
                            <td class="has-text-centered"><a onclick="deleteUser('${user.id}');"><i class="fas fa-trash"></i></a></td>
                        </tr>
                    </c:forEach>
                </table>

                <a class="button is-primary" id="addUserButton">
                    <span class="icon">
                        <i class="fas fa-plus"></i>
                    </span>
                    <span>Add User</span>
                </a>
            </div>
        </div>
    </div>
</section>

<dialog id="addUserDialog" class="mdl-dialog">
    <h4 class="mdl-dialog__title">Add User</h4>
    <div class="mdl-dialog__content">
        <form id="frmCreateUser" name="frmCreateUser" method="post" action="${pageContext.request.contextPath}/view?tab1=admin&tab2=users&action=create">
            <table>
                <tr>
                    <td>Logon Id:</td>
                    <td>
                        <input type="text" id="fldLogonId" name="fldLogonId" size="20" maxlength="256" value="" required/>
                    </td>
                </tr>
            </table>
        </form>
    </div>
    <div class="mdl-dialog__actions">
        <button type="button" class="button is-primary create">Create</button>
        <button type="button" class="button close">Cancel</button>
    </div>
</dialog>
<script>
    var addUserDialog = document.querySelector('#addUserDialog');
    var addUserButton = document.querySelector('#addUserButton');
    if (!addUserDialog.showModal)
    {
        dialogPolyfill.registerDialog(addUserDialog);
    }
    addUserButton.addEventListener('click', function ()
    {
        addUserDialog.showModal();
    });
    document.querySelector('#addUserDialog .create').addEventListener('click', function ()
    {
        if (!document.querySelector('#fldLogonId').value)
            alert('Please enter a Logon Id.');
        else
            $('#frmCreateUser').submit();
    });
    addUserDialog.querySelector('#addUserDialog .close').addEventListener('click', function ()
    {
        addUserDialog.close();
    });
</script>

<jsp:include page="../footer.jsp"/>
</body>
</html>