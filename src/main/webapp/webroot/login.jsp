<%--
  Created by IntelliJ IDEA.
  User: eric
  Date: 7/7/2016
  Time: 10:59 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<c:if test="${!empty loonSystem}">
    <jsp:useBean id="loonSystem" type="net.ehicks.loon.beans.LoonSystem" scope="application"/>
</c:if>
<c:if test="${!empty signUpResultMessage}">
    <jsp:useBean id="signUpResultMessage" type="java.lang.String" scope="session"/>
</c:if>
<c:if test="${!empty signUpResultClass}">
    <jsp:useBean id="signUpResultClass" type="java.lang.String" scope="session"/>
</c:if>

<!DOCTYPE html>
<html>
<head>
    <jsp:include page="inc_title.jsp"/>
    <jsp:include page="inc_header.jsp"/>

    <script>
        $(function () {
            $('#j_username').focus();


            $('#j_password').on('keypress', function (e) {
                if (e.keyCode === 13)
                {
                    $('#frmLogin').submit();
                }
            });
        });
    </script>
    <style>
        html,body {
            font-size: 14px;
            font-weight: 300;
        }
        .hero.is-success {
            background: #F2F6FA;
        }
        /*.avatar {*/
            /*margin-top: -70px;*/
            /*padding-bottom: 20px;*/
        /*}*/
        .avatar img {
            /*padding: 5px;*/
            /*background: #fff;*/
            /*border-radius: 0%;*/
            /*-webkit-box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);*/
            /*box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);*/
        }
        /*p.subtitle {*/
            /*padding-top: 1rem;*/
        /*}*/
    </style>
</head>
<body>
<section class="hero is-success is-fullheight">
    <div class="hero-body">
        <div class="container has-text-centered">
            <div class="column is-4 is-offset-4">
                <h3 class="title has-text-grey">${loonSystem.instanceName}</h3>
                <p class="subtitle has-text-grey">Please login to proceed.</p>
                <div class="box">
                    <figure class="avatar">
                        <img src="${pageContext.request.contextPath}/images/puffin-text.png" style="width: 128px">
                    </figure>
                    <form id="frmLogin" method="POST" action="">
                        <div class="field">
                            <div class="control">
                                <input class="input is-medium" type="email" placeholder="Your Email" autofocus="" id="username" name="username">
                            </div>
                        </div>

                        <div class="field">
                            <div class="control">
                                <input class="input is-medium" type="password" placeholder="Your Password" id="password" name="password">
                            </div>
                        </div>
                        <div class="field">
                            <label class="checkbox">
                                <input type="checkbox" name="rememberMe">
                                Remember me
                            </label>
                        </div>
                        <input type="submit" value="Login" class="button is-block is-primary is-medium" onclick="frmLogin.submit();" />
                    </form>
                </div>

                <article id="welcomeMessage" class="message is-primary">
                    <div class="message-header">
                        <p>Welcome Message</p>
                        <button class="delete" aria-label="delete" onclick="$('#welcomeMessage').addClass('is-hidden')"></button>
                    </div>
                    <div class="message-body">
                        ${loonSystem.logonMessage}
                    </div>
                </article>

                <c:if test="${!empty sessionScope['signUpResultMessage']}">
                    <article id="signUpResultMessage" class="message ${sessionScope['signUpResultClass']}">
                        <div class="message-header">
                            <p>Sign Up Result</p>
                            <button class="delete" aria-label="delete" onclick="$('#signUpResultMessage').addClass('is-hidden')"></button>
                        </div>
                        <div class="message-body">
                            ${sessionScope['signUpResultMessage']}
                            <c:if test="${sessionScope['signUpResultClass'] eq 'is-success'}">
                                <i class="fas fa-trophy has-text-warning" ></i>
                                <i class="fas fa-star has-text-warning" ></i>
                            </c:if>
                        </div>
                    </article>

                    <c:remove var="signUpResultMessage" scope="session"/>
                    <c:remove var="signUpResultClass" scope="session"/>
                </c:if>

                <p class="has-text-grey">
                    <a href="#" id="signUpButton">Sign Up</a> &nbsp;·&nbsp;
                    <a href="">Forgot Password</a> &nbsp;·&nbsp;
                    <a href="">Need Help?</a>
                </p>
            </div>
        </div>
    </div>
</section>

<div class="modal" id="signUpDialog">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Sign Up</p>
            <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
            <form id="frmSignUp" name="frmCreateIssue" method="post" action="${pageContext.request.contextPath}/signUp?tab1=registration&action=register">
                <t:text id="fldEmailAddress" label="Email" required="true" />
                <t:text id="fldPassword" label="Password" required="true" />
                <t:text id="fldPassword2" label="Re-enter Password" required="true" />
            </form>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-primary create">Sign Up</button>
            <button class="button close">Cancel</button>
        </footer>
    </div>
</div>

<script>
    initDialog('signUp');

    $(function () {
        var dialog = $('#signUpDialog');

        dialog.find('.create').on('click', function ()
        {
            $('#frmSignUp').submit()
        });
    });
</script>
</body>
</html>
