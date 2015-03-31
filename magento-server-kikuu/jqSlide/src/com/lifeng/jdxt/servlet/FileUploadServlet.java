package com.lifeng.jdxt.servlet;
import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;


public class FileUploadServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	protected void service(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		//获取工程根目录
		String rootPath = req.getRealPath("/WEB-INF");
		//临时存储路径
		File tempFile = new File(rootPath + "/Temp");
		
		if(!tempFile.exists()){
			tempFile.mkdirs();
		}
		//是否是文件上传
		boolean isMultipart = ServletFileUpload.isMultipartContent(req);
		if (isMultipart) {
			try {
				// 创建磁盘工厂，利用构造器实现内存数据储存量和临时储存路径
				DiskFileItemFactory factory = new DiskFileItemFactory(1024 * 4,
						tempFile);
				// 设置最多只允许在内存中存储的数据,单位:字节
				// factory.setSizeThreshold(4096);
				// 设置文件临时存储路径
				//factory.setRepository(new File("D:\\Temp"));
				// 产生一新的文件上传处理程式
				ServletFileUpload upload = new ServletFileUpload(factory);
				// 设置路径、文件名的字符集
				upload.setHeaderEncoding("UTF-8");
				// 设置允许用户上传文件大小,单位:字节
				upload.setSizeMax(1024 * 1024 * 100);
				// 解析请求，开始读取数据
				// Iterator<FileItem> iter = (Iterator<FileItem>)
				// upload.getItemIterator(request);
				// 得到所有的表单域，它们目前都被当作FileItem
				List<FileItem> fileItems = upload.parseRequest(req);
				// 依次处理请求
				Iterator<FileItem> iter = fileItems.iterator();
				while (iter.hasNext()) {
					FileItem item = (FileItem) iter.next();
					if (item.isFormField()) {
						// 如果item是正常的表单域
						String name = item.getFieldName();
						String value = item.getString("UTF-8");
						System.out.println("表单域名为:" + name + "表单域值为:" + value);
					} else {
						// 如果item是文件上传表单域
						// 获得文件名及路径
						String fileName = item.getName();
						if (fileName != null) {
							// 如果文件存在则上传
							File fullFile = new File(item.getName());
							if (!fullFile.exists()) {
								//真实路径
								String realSavePath = makeDir(rootPath + "/img");
								//判断是否存在，不存在，则创建
								if(realSavePath == null){
									System.out.println("文件目录创建失败！");
									return;
								}
								File fileOnServer = new File(
										realSavePath +"/"+fullFile.getName());
								item.write(fileOnServer);
								System.out.println("文件"
										+ fileOnServer.getName() + "上传成功");
							}
						}
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	/**
	 *  组装文件目录，并创建文件目录
	 *  
	 * @param savePath 存储路径
	 * @return String 文件目录
	 */
	private String makeDir(String savePath){
		
		DateFormat sf = new SimpleDateFormat("yyyy-MM-dd");
		String dateStr = sf.format(new Date());
		String saveDirectory = savePath + "/" + dateStr;
		File file = new File(saveDirectory);
		if(!file.exists()){
			if(file.mkdirs()){
				return saveDirectory;
			}else{
				return null;
			}
		}else{
			return saveDirectory;
		}

	}
}