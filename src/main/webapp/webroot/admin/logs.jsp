<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="logs" type="java.util.List<java.io.File>" scope="request"/>
<jsp:useBean id="userSession" type="net.ehicks.loon.UserSession" scope="session"/>

<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../inc_title.jsp"/>
    <jsp:include page="../inc_header.jsp"/>

    <script>
        function deleteLog(name)
        {
            if (confirm('Are you sure?'))
                location.href="${pageContext.request.contextPath}/view?tab1=admin&tab2=logs&action=delete&logName=" + name;
        }
    </script>
</head>
<body>

<jsp:include page="../header.jsp"/>

<section class="hero is-primary is-small">
    <div class="hero-body">
        <div class="container">
            <h1 class="title">
                Logs - ${userSession.systemInfo.logDirectoryCanonical}
            </h1>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="columns is-multiline is-centered">
            <div class="column is-narrow">
                <table class="table is-striped is-narrow is-hoverable">
                    <thead>
                    <tr>
                        <th>
                            <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="table-header">
                                <input type="checkbox" id="table-header" class="mdl-checkbox__input" />
                            </label>
                        </th>
                        <th></th>
                        <th>Name</th>
                        <th class="has-text-right">Size</th>
                        <th>Raw</th>
                        <th>Formatted</th>
                        <th></th>
                    </tr>
                    </thead>
                    <c:forEach var="log" items="${logs}" varStatus="loop">
                        <tr>
                            <td>
                                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select" for="row[${loop.count}]">
                                    <input type="checkbox" id="row[${loop.count}]" class="mdl-checkbox__input" />
                                </label>
                            </td>
                            <td class="has-text-right">${loop.count}</td>
                            <td class="mdl-data-table__cell--non-numeric">
                                ${log.name}
                            </td>
                            <td class="has-text-right">${ct:fileSize(log.length())}</td>

                            <td class="has-text-centered">
                                <a href="${pageContext.request.contextPath}/view?tab1=admin&tab2=logs&action=viewLog&logName=${log.name}">
                                    <i class="fas fa-file-alt"></i></a>
                            </td>
                            <td class="has-text-centered">
                                <a href="${pageContext.request.contextPath}/view?tab1=admin&tab2=logs&action=viewLogPretty&logName=${log.name}">
                                    <i class="fas fa-table"></i></a>
                            </td>
                            <td><a onclick="deleteLog('${log.name}');"><i class="fas fa-trash"></i></a></td>
                        </tr>
                    </c:forEach>
                </table>
            </div>
        </div>
    </div>
</section>

<jsp:include page="../footer.jsp"/>
</body>
</html>