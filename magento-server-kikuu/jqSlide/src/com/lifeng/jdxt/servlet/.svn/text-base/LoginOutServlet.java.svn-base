package com.lifeng.jdxt.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;



import com.lifeng.jdxt.po.User;
import com.lifeng.jdxt.service.UserService;

public class LoginOutServlet extends HttpServlet {

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		

		response.setContentType("text/html");
		request.setCharacterEncoding("UTF-8");

		
		HttpSession session = request.getSession() ; 
		
		session.removeAttribute("loginUser");
		


	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		this.doGet(request, response) ; 

	}

}
