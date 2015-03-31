package com.lifeng.jdxt.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.lifeng.jdxt.po.Project;
import com.lifeng.jdxt.service.ProjectService;

public class SaveProjectServlet extends HttpServlet {

	private static final long serialVersionUID = 5295857396296630306L;
	private ProjectService projectService = new ProjectService();

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html");
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("utf-8");
		PrintWriter out = response.getWriter();
		String name = request.getParameter("name");
		String area = request.getParameter("area");
		String state = request.getParameter("state");
		String startTime = request.getParameter("startTime");
		String quarter = request.getParameter("quarter");
		int number = this.projectService.saveProject(name, area, state, startTime, quarter);
		if(number != 0 ){
			out.print("success");
		} else {
			out.print("保存失败，请重新操作!");
		}

	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		this.doGet(request, response);
	}

}
