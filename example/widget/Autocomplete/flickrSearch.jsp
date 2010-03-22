<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page contentType="text/plain; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<c:url var="url" 
    value="http://api.flickr.com/services/rest/?method=flickr.photos.search">
    <c:param name="api_key" value="34c51e09440cab692088d09854b42405"/>
    <c:param name="per_page" value="10"/>
    <c:param name="format" value="json"/>
    <c:param name="sort" value="relevance"/>
    <c:param name="tags" value="${param.tags}"/>
    <c:param name="nojsoncallback" value="1"/>
</c:url>
/* ${url} */
<c:import url='${url}'/>
<%--
nojsoncallback=1;
http://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=34c51e09440cab692088d09854b42405&per_page=24&format=json
http://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=34c51e09440cab692088d09854b42405&per_page=24&format=json

http://www.flickr.com/services/rest/?method=flickr.photos.search&response=json&api_key=34c51e09440cab692088d09854b42405&api_sig=9046ea2b89873717
--%>