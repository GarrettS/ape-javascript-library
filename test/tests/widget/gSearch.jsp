<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c"%>
<c:url value="http://suggestqueries.google.com/complete/search" var="url">
    <c:param name="qu" value="${param.q}"/>
    <c:param name="jsonp" value="${param.jsonp}"/>
</c:url>
<c:import url='${url}'/>