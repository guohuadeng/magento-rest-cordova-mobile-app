package com.lifeng.jdxt.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class localJdbcUtil {
	
	
	public String getDriverClassName(){
		
		String driverClassName ; 
		Properties p = this.getP();
		
		driverClassName = (String) p.get("driverClassName") ; 
		return driverClassName ; 
	}
public String getUrl(){
		
		String url ; 
		Properties p = this.getP();
		
		url = (String) p.get("url") ; 
		return url ; 
	}
	
public String getUserName(){
	
	String userName ; 
	Properties p = this.getP();
	
	userName = (String) p.get("username") ; 
	return userName ; 
}
	
	
	
public String getPassword(){
	
	String password ; 
	Properties p = this.getP();
	
	password = (String) p.get("password") ; 
	return password ; 
}
	
	public  Properties getP(){
		ClassLoader ccl = Thread.currentThread().getContextClassLoader();
		InputStream is = ccl.getResourceAsStream("localjdbc.properties");
		Properties p = new Properties();
		try {
			p.load(is);
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return p ; 
		
		
	}
	
	
	

}
