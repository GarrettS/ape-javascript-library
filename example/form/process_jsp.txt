<%@ page import="org.apache.commons.io.*, org.apache.commons.fileupload.*, java.util.*, org.apache.commons.fileupload.disk.DiskFileItemFactory, org.apache.commons.fileupload.servlet.*" %>
<%
// Create a factory for disk-based file items
FileItemFactory factory = new DiskFileItemFactory();

// Create a new file upload handler
ServletFileUpload upload = new ServletFileUpload(factory);

List<FileItem> items = upload.parseRequest(request);
String defaultContentType = "text/plain";

Iterator itr = items.iterator();
long size = 0;
	
while(itr.hasNext()) {
    FileItem item = (FileItem)itr.next();
    if(!item.isFormField()) {
		size = item.getSize();
		if(size > 12000) {
			response.setContentType("text/plain");
			out.write("please choose a file under 10k");
		}
		else {
			String contentType = item.getContentType();
			if(contentType != null && contentType.startsWith("text/"))
				contentType = defaultContentType;
			if(contentType != null)
				response.setContentType(contentType);
			else
				response.setContentType(defaultContentType);
			out.write(item.getString());
		}
		break;
	}
}

if(size < 1) {
	response.setContentType("text/plain");
	out.write("please choose a non-empty file under 10k\nsize: "+size);
}
%>