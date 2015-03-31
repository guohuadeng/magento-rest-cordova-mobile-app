package com.lifeng.jdxt.dao;

import java.sql.SQLException;

import com.lifeng.jdxt.po.User;

public class UserDao extends BaseDao {

	// 通过姓名查询用户
	public User login(String userName,String password) {

		User user = null;
		String sql = "select * from tbl_user where username=? and password=?";
		// String sql = "select * from user where username = ?";

		try {
			connection = getConnection();
			preparedStatement = connection.prepareStatement(sql);

			preparedStatement.setString(1, userName);
			preparedStatement.setString(2, password);
			resultSet = preparedStatement.executeQuery();

			String nickName = null;
			if (resultSet.next()) {
				nickName = resultSet.getString("nickname");
				user = new User(userName, password, nickName);

			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			closeAll(connection, preparedStatement, resultSet);
		}
		return user;

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
	public int saveLocation(String latitude, String longitude, String time) {
		String sql = "insert into location values(?,?,?)";
		Object[] params = { latitude, longitude, time };
		return BaseDao.executeUpdate(sql, params);
	}
}
