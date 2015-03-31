package com.lifeng.jdxt.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class ManagerFilter implements Filter{

	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		
		HttpServletRequest r = (HttpServletRequest) request;
		HttpServletResponse resp = (HttpServletResponse) response;
		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");
		
		String url = r.getRequestURI();//用户要访问的地址
		
		//System.out.println("当前用户访问地址："+url);
		
		HttpSession session = r.getSession();
		
		String userName = (String) session.getAttribute("session");
		//System.out.println(userName);

		if(!"login".equals(userName) && !url.contains("managerLogin.jsp")&&
					!url.contains("port")&&!url.contains("announceShow!showAllAnnounce.action")&&
					!url.contains("announceShow!queryAnnounceById.action")&&
					!url.contains("loginAction!loginAction.action")&&
					!url.contains("announce/announce_show.jsp")&&
					!url.contains("addUser.jsp")&&
					!url.contains("queryTicket.jsp")&&
					!url.contains("announce/announce_show.jsp")&&
					!url.contains("queryTicket!checkTicket.action")&&
					!url.contains("showUserInfo.jsp")){
			
			//将没登陆的用户重定向到登陆页面
			resp.sendRedirect("login.jsp");
		}else{
			chain.doFilter(request, response);//正常通过
		}
	}

	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		
	}

}
