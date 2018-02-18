<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="lines" type="java.util.List<java.util.List<java.lang.String>>" scope="request"/>
<jsp:useBean id="threadToColorMap" type="java.util.Map<java.lang.String, java.lang.String>" scope="request"/>

<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../inc_title.jsp"/>
    <jsp:include page="../inc_header.jsp"/>
    <style>.mdl-grid {max-width: 100%;}</style>
</head>
<body>

<jsp:include page="../header.jsp"/>

<section class="hero is-primary is-small">
    <div class="hero-body">
        <div class="container">
            <h1 class="title">
                Log ${logName}
            </h1>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="columns is-multiline is-centered">
            <div class="column">
                <table class="table is-striped is-narrow is-hoverable">
                    <thead>
                    <tr class="listheading">
                        <th>Time</th>
                        <th>Thread</th>
                        <th>Level</th>
                        <th>Class</th>
                        <th>Message</th>
                    </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="line" items="${lines}" varStatus="loop">
                            <tr style="background-color: ${threadToColorMap[line[1]]}">
                                <td>${line[0]}</td>
                                <td>${line[1]}</td>
                                <td>${line[2]}</td>
                                <td>${line[3]}</td>
                                <td>${line[4]}</td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>

<jsp:include page="../footer.jsp"/>
</body>
</html>