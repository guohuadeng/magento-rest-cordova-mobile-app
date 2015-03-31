package com.lifeng.jdxt.service;

import java.text.SimpleDateFormat;

import com.lifeng.jdxt.dao.UserDao;
import com.lifeng.jdxt.po.User;

public class UserService {
	private UserDao userDao = new UserDao();

	public UserDao getUserDao() {
		return userDao;
	}

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}



	/**
	 * 
	 * @function:保存地理信息
	 * @date:2013-8-5
	 * @author:Jerry
	 * @param latitude
	 * @param longitude
	 * @param time
	 * @return
	 */
	public int saveLocation(String latitude, String longitude) {
		String time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
				.format(new java.util.Date());
		return this.userDao.saveLocation(latitude, longitude, time);
	}

	public User login(String userName, String password) {
		return this.userDao.login(userName, password);
	}
}
