package com.lifeng.jdxt.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.lifeng.jdxt.po.Project;
import com.lifeng.jdxt.service.ProjectService;

public class QueryProjectServlet extends HttpServlet {

	private ProjectService projectService = new ProjectService();

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html");
		request.setCharacterEncoding("UTF-8");
		String id = request.getParameter("id");
		String year = request.getParameter("year");
		String quarter = request.getParameter("quarter");
		List<Project> projects = new ArrayList<Project>();
		if (id != null) {
			projects = this.projectService.queryProjectById(id);
		} else {
			if (quarter != null && year != null && quarter != "" && year != "") {
				List<Project> projectsTemp = this.projectService
						.queryProjectByQuarter(quarter);
				for (Project project : projectsTemp) {
					if (project.getStartTime().substring(0, 4).equals(year)) {
						projects.add(project);

					}
				}
			} else if (quarter != null && quarter != "") {
				projects = this.projectService.queryProjectByQuarter(quarter);
			} else if (year != null && year != "") {
				List<Project> projectsTemp = this.projectService
						.queryAllProject();
				for (Project project : projectsTemp) {
					if (project.getStartTime().substring(0, 4).equals(year)) {
						projects.add(project);
					}
				}
			} else {
				projects = this.projectService.queryAllProject();

			}
		}
		response.setCharacterEncoding("utf-8");
		response.setDateHeader("Expires", 0);
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Prama", "no-cache");
		Gson gson = new Gson();
		String json = gson.toJson(projects);
		PrintWriter pw = null;
		try {
			pw = response.getWriter();
			pw.write(json);
			pw.flush();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (pw != null) {
				pw.close();

			}
		}
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		this.doGet(request, response);
	}

}
