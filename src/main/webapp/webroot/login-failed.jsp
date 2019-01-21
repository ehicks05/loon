<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Loon</title>
    <jsp:include page="inc_header.jsp"/>

    <script>
        $(document).ready(function ()
        {
          $('#backButton').focus();
        });
    </script>
</head>
<body>

<section class="hero is-primary is-small">
    <div class="hero-body">
        <div class="container">
            <h1 class="title">
                Login Failed
            </h1>
        </div>
    </div>
</section>

<section class="section">
    <div class="container">
        <div class="columns is-multiline is-centered">
            <div class="column is-centered">
                <div class=""><h5>Sorry, login failed!</h5></div>

                <div class="is-centered">
                    <input type="submit" id="backButton" value="Back" class="button is-primary" onclick="location.href='${pageContext.request.contextPath}/view/library';"/>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
    $(document).ready(showResponseMessage);
</script>
</body>
</html>
