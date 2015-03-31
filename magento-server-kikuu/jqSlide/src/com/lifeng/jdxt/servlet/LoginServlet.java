package com.lifeng.jdxt.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.lifeng.jdxt.po.User;
import com.lifeng.jdxt.service.UserService;
import com.lifeng.jdxt.vo.UserVo;

public class LoginServlet extends HttpServlet {

	private UserService userServer = new UserService();
	private UserVo userVo;

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("text/html");
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		PrintWriter out = response.getWriter();

		String loginName = request.getParameter("loginName");
		String loginPassword = request.getParameter("loginPassword");
		if (loginName == null || "".equals(loginName) || loginPassword == null
				|| "".equals(loginPassword)) {
			userVo = new UserVo("用户名或密码不能为空");
			userVo.setNickName("1");
			userVo.setPassword("1");
			userVo.setUserName("1");
		} else {
			User user = this.userServer.login(loginName, loginPassword);
			if (user != null) {
				this.userVo = new UserVo(user);
				this.userVo.setMessage("success");
			} else {
				userVo = new UserVo("用户名或密码错误!");
				userVo.setNickName("1");
				userVo.setPassword("1");
				userVo.setUserName("1");
			}
		}
		Gson gson = new Gson();
		String json = gson.toJson(userVo);
		out.write(json);
		out.flush();
		out.close();
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doGet(request, response);

	}

}
