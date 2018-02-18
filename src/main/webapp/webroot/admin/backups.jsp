<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="backups" type="java.util.List<java.io.File>" scope="request"/>
<jsp:useBean id="userSession" type="net.ehicks.loon.UserSession" scope="session"/>

<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../inc_title.jsp"/>
    <jsp:include page="../inc_header.jsp"/>

    <script>
        function createBackup()
        {
            if (confirm('Are you sure?'))
                location.href="${pageContext.request.contextPath}/view?tab1=admin&tab2=backups&action=create";
        }
        function deleteBackup(name)
        {
            if (confirm('Are you sure?'))
                location.href="${pageContext.request.contextPath}/view?tab1=admin&tab2=backups&action=delete&backupName=" + name;
        }
    </script>
</head>
<body>

<jsp:include page="../header.jsp"/>

<section class="hero is-primary is-small">
    <div class="hero-body">
        <div class="container">
            <h1 class="title">
                Backups - ${userSession.systemInfo.backupDirectoryCanonical}
            </h1>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="columns is-multiline is-centered">
            <div class="column is-narrow">
                <div class="box">
                    <table class="table is-striped is-narrow is-hoverable is-fullwidth">
                        <thead>
                        <tr>
                            <th>
                                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="table-header">
                                    <input type="checkbox" id="table-header" class="mdl-checkbox__input" />
                                </label>
                            </th>
                            <th class="has-text-right"></th>
                            <th class="mdl-data-table__cell--non-numeric">Name</th>
                            <th class="has-text-right">Size</th>
                            <th>Last Modified</th>
                            <th></th>
                        </tr>
                        </thead>
                        <c:forEach var="backup" items="${backups}" varStatus="loop">
                            <tr>
                                <td>
                                    <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="row[${loop.count}]">
                                        <input type="checkbox" id="row[${loop.count}]" class="mdl-checkbox__input" />
                                    </label>
                                </td>
                                <td class="has-text-right">${loop.count}</td>
                                <td>
                                    <a href="${pageContext.request.contextPath}/view?tab1=admin&tab2=backups&action=viewBackup&backupName=${backup.name}">
                                            ${backup.name}</a>
                                </td>
                                <td><a onclick="deleteBackup('${backup.name}');"><i class="fas fa-trash"></i></a></td>
                            </tr>
                        </c:forEach>
                    </table>

                    <input id="create" type="button" value="Create Backup" class="button is-primary" onclick="createBackup();"/>
                </div>
            </div>
        </div>
    </div>
</section>

<jsp:include page="../footer.jsp"/>
</body>
</html>