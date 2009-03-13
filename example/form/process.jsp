<%@ page import="org.apache.commons.io.*, org.apache.commons.fileupload.*, java.util.*, org.apache.commons.fileupload.disk.DiskFileItemFactory, org.apache.commons.fileupload.servlet.*" %>
<%
// Create a factory for disk-based file items
FileItemFactory factory = new DiskFileItemFactory();

// Create a new file upload handler
ServletFileUpload upload = new ServletFileUpload(factory);
upload.setSizeMax(1024 * 11); // 11k.

List<FileItem> items = upload.parseRequest(request);
Map<String, String> results = new HashMap<String,String>(items.size());

String defaultContentType = "text/plain";
response.setContentType("text/plain");

Iterator itr = items.iterator();
	
while(itr.hasNext()) {
    FileItem item = (FileItem) itr.next();
    if(!item.isFormField()) {
		if(item.getSize() > 12000) {
			results.put(item.getName(), "please choose a file under 10k");
			continue;
		}
		results.put(item.getName(), item.getString());
	}
	else {
		results.put(item.getFieldName(), item.getString());
	}
}
%><dl id="resultSet"><%
for(String item : results.keySet()){
%>
<dt><%= item %>:</dt>
<dd><xmp><%= results.get(item) %></xmp></dd>
<%}%>
</dl>