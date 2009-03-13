<%

response.setContentType("text/plain");
String first = request.getParameter("first");
String last = request.getParameter("last");

%><%= last %>, <%= first %>