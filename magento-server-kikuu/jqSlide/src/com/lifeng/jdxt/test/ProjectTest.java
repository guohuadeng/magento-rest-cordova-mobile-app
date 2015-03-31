package com.lifeng.jdxt.test;



import com.lifeng.jdxt.dao.BaseDao;
import com.lifeng.jdxt.dao.UserDao;
import com.lifeng.jdxt.po.User;
import com.lifeng.jdxt.service.ProjectService;
import com.lifeng.jdxt.service.UserService;
import com.lifeng.jdxt.util.JdbcUtil;

public class ProjectTest {
	public static void main(String[] args) {
		
		
//		 JdbcUtil ju = new JdbcUtil();
//		 String DRIVERCLASS = ju.getDriverClassName();
//        System.out.println( DRIVERCLASS);
//			 String URL = ju.getUrl();
//		System.out.println(URL);	 
//			 
//			 
//		String USERNAME = ju.getUserName();
//		System.out.println(USERNAME);
//		 String PASSWORD = ju.getPassword();
//		 System.out.println(PASSWORD);
//		
//		
//		
//		ProjectService ps = new ProjectService();
		BaseDao bd = new BaseDao();

//		String name = "name";
//		String area = "area";
//		String state = "state";
//		String startTime = "startTime";
//		String quarter = "quarter";
//		 System.out.println(ps
//		 .saveProject(name, area, state, startTime, quarter));
//		System.out.println(ps.queryAllProject());
		

	
//	UserDao useDao = new UserDao() ; 
//	User user = useDao.getUserBYName("1");
//	System.out.println(user.getUserName());
//	
//		System.out.println(bd.getConnection());
//		bd.closeAll(bd.getConnection(), null, null);
//		UserDao  ud = new UserDao();
		System.out.println(bd.getConnection());
//		System.out.println(ud.getUserBYName("1").getNickName());
		UserService us = new UserService();
		

		
		

	}
}
