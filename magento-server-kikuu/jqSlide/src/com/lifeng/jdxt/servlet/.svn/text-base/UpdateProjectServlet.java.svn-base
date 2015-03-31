package com.lifeng.jdxt.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.lifeng.jdxt.service.ProjectService;

public class UpdateProjectServlet extends HttpServlet {
	private ProjectService projectService = new ProjectService();

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("text/html");
		request.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		String id = request.getParameter("id");
		String name = request.getParameter("name");
		String area = request.getParameter("area");
		String state = request.getParameter("state");
		String startTime = request.getParameter("startTime");
		String quarter = request.getParameter("quarter");
		int number = this.projectService.updateProjectById(id, name, area, state, startTime,
				quarter);
		if(number > 0) {
			out.print("success");
		} else {
			out.print("更新失败，请重新操作！");
		}
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		this.doGet(request, response);
	}

}
