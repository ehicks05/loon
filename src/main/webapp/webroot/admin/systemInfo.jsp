<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="userSession" type="net.ehicks.loon.UserSession" scope="session"/>
<jsp:useBean id="userSessions" type="java.util.List<net.ehicks.loon.UserSession>" scope="request"/>
<jsp:useBean id="connectionInfo" type="net.ehicks.eoi.ConnectionInfo" scope="request"/>

<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../inc_title.jsp"/>
    <jsp:include page="../inc_header.jsp"/>

    <script>
        $('document').ready(function ()
        {
            $('#clearCache').click(function ()
            {
                location.href = '${pageContext.request.contextPath}/view?tab1=admin&tab2=cache&action=clearCache';
            });
        });
    </script>
    <style>
        .flexContainer {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
        }
        .flexItem {
            overflow-x: auto;
            margin: 10px;
        }
    </style>
</head>
<body>

<jsp:include page="../header.jsp"/>

<section class="hero is-primary is-small">
    <div class="hero-body">
        <div class="container">
            <h1 class="title">
                System Info
            </h1>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="columns is-multiline is-centered">
            <div class="column is-one-quarter">
                <div class="box overflowTableContainer">
                    <h5 class="subtitle is-5">Sessions</h5>

                    <table class="table">
                        <tr>
                            <th colspan="3">Sessions: ${fn:length(userSessions)}</th>
                        </tr>
                        <tr>
                            <th>Session Id</th>
                            <th>Logon Id</th>
                            <th>Last Active</th>
                        </tr>
                        <c:forEach var="userSesh" items="${userSessions}">
                            <tr>
                                <td title="${userSesh.sessionId}">${fn:substring(userSesh.sessionId, 0, 4)}...</td>
                                <td>${userSesh.logonId}</td>
                                <td><fmt:formatDate value="${userSesh.lastActivity}" pattern="h:mm:ss a"/></td>
                            </tr>
                        </c:forEach>
                    </table>
                </div>
            </div>
            <div class="column is-one-quarter">
                <div class="box overflowTableContainer">
                    <h5 class="subtitle is-5">System Info</h5>

                    <table class="table">
                        <thead>
                        <tr>
                            <th>Property</th>
                            <th>Value</th>
                        </tr>
                        </thead>

                        <c:forEach var="entry" items="${userSession.systemInfo.stats}">
                            <tr>
                                <td>${entry.key}</td>
                                <td align="right">${entry.value}</td>
                            </tr>
                        </c:forEach>
                    </table>
                </div>
            </div>
            <div class="column is-one-quarter">
                <div class="box overflowTableContainer">
                    <h5 class="subtitle is-5">DB Info</h5>

                    <table class="table">
                        <thead>
                        <tr>
                            <th>Property</th>
                            <th class="alignright">Value</th>
                        </tr>
                        </thead>
                        <c:forEach var="info" items="${dbInfo}">
                            <c:if test="${fn:startsWith(info[0], 'info')}">
                                <tr>
                                    <td>${info[0]}</td>
                                    <td class="alignright">${info[1]}</td>
                                </tr>
                            </c:if>
                        </c:forEach>
                        <c:if test="${!empty dbInfoMap}">
                            <c:forEach var="dbInfoItem" items="${dbInfoMap}">
                                <tr>
                                    <td>${dbInfoItem.key}</td>
                                    <td class="alignright">${dbInfoItem.value}</td>
                                </tr>
                            </c:forEach>
                        </c:if>
                    </table>
                </div>
            </div>
            <div class="column is-one-quarter">
                <div class="box overflowTableContainer">
                    <h5 class="subtitle is-5">Connection Info</h5>

                    <table class="table">
                        <thead>
                        <tr>
                            <th>Property</th>
                            <th class="alignright">Value</th>
                        </tr>
                        </thead>
                        <tr>
                            <td>Mode</td>
                            <td class="alignright">${connectionInfo.dbMode}</td>
                        </tr>
                        <tr>
                            <td>Host</td>
                            <td class="alignright">${connectionInfo.dbHost}</td>
                        </tr>
                        <tr>
                            <td>DB Name</td>
                            <td class="alignright">${connectionInfo.dbName}</td>
                        </tr>
                        <tr>
                            <td>Port</td>
                            <td class="alignright">${connectionInfo.dbPort}</td>
                        </tr>
                        <tr>
                            <td>User</td>
                            <td class="alignright">${connectionInfo.dbUser}</td>
                        </tr>
                        <tr>
                            <td>Pass</td>
                            <td class="alignright">****</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="column is-one-half">
                <div class="box overflowTableContainer">
                    <h5 class="subtitle is-5">DB Pool Info</h5>

                    <table class="table">
                        <thead>
                        <tr>
                            <th>Property</th>
                            <th>Value</th>
                        </tr>
                        </thead>

                        <c:forEach var="cpInfoEntry" items="${cpInfo}">
                            <tr>
                                <td>${cpInfoEntry.key}</td>
                                <td align="right">${cpInfoEntry.value}</td>
                            </tr>
                        </c:forEach>
                    </table>
                </div>
            </div>
            <div class="column is-one-half">
                <div class="box overflowTableContainer">
                    <h5 class="subtitle is-5">Runtime MXBean Arguments</h5>

                    <table class="table">
                        <thead>
                        <tr>
                            <th>Argument</th>
                        </tr>
                        </thead>
                        <c:forEach var="argument" items="${userSession.systemInfo.runtimeMXBeanArguments}">
                            <tr>
                                <td style="break-inside: auto;">${argument}</td>
                            </tr>
                        </c:forEach>
                    </table>
                </div>
            </div>
            <div class="column is-one-half">
                <div class="box overflowTableContainer">
                    <h5 class="subtitle is-5">Application Scope Vars</h5>

                    <table class="table">
                        <thead>
                        <tr>
                            <th>Key</th>
                        </tr>
                        </thead>
                        <c:forEach var="entry" items="${applicationScope}">
                            <tr>
                                <td>${entry.key}</td>
                            </tr>
                        </c:forEach>
                    </table>
                </div>
            </div>
        </div>
    </div>
</section>

<jsp:include page="../footer.jsp"/>
</body>
</html>