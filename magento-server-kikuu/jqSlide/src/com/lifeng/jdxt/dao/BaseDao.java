package com.lifeng.jdxt.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

import com.lifeng.jdxt.util.JdbcUtil;

public class BaseDao {

	 static JdbcUtil ju = new JdbcUtil();
//	static localJdbcUtil ju = new localJdbcUtil();
	private final static String DRIVERCLASS = ju.getDriverClassName();

	private final static String URL = ju.getUrl();
	private final static String USERNAME = ju.getUserName();
	private final static String PASSWORD = ju.getPassword();

	protected static Connection connection = null;
	protected static PreparedStatement preparedStatement = null;
	protected static ResultSet resultSet = null;

	/**
	 * 
	 * @function:自动生产各类ID号的方法
	 * @date:2013-7-25
	 * @author:Jerry
	 * @return String
	 */
	protected static String createID() {
		String id;
		id = new SimpleDateFormat("yyyyMMddHHmmss")
				.format(new java.util.Date());
		return id;
	}

	/**
	 * 
	 * @function:此方法可以完成所有的insert，update，delete操作
	 * @date:2013-7-25
	 * @author:Jerry
	 * @param sql
	 * @param params
	 * @return int
	 */
	public static int executeUpdate(String sql, Object[] params) {
		int rowNumber = 0;
		connection = getConnection();
		try {
			preparedStatement = connection.prepareStatement(sql);
			if (params != null) {
				for (int i = 0; i < params.length; i++) {
					preparedStatement.setString(i + 1, params[i].toString());
				}
			}

			rowNumber = preparedStatement.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			BaseDao.closeAll(connection, preparedStatement, null);
		}
		return rowNumber;
	}

	/**
	 * 
	 * @function:连接数据库
	 * @date:2013-7-25
	 * @author:Jerry
	 * @return Connection
	 */
	public static Connection getConnection() {
		try {
			Class.forName(DRIVERCLASS);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		try {
			connection = DriverManager.getConnection(URL, USERNAME, PASSWORD);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return connection;
	}

	/**
	 * 
	 * @function:封装关闭方法
	 * @date:2013-7-25
	 * @author:Jerry
	 * @param connection
	 * @param preparedStatement
	 * @param resultSet
	 */
	public static void closeAll(Connection connection,
			PreparedStatement preparedStatement, ResultSet resultSet) {
		try {
			if (connection != null) {
				connection.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		try {
			if (preparedStatement != null) {
				preparedStatement.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		try {
			if (resultSet != null) {
				resultSet.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}

	}
}
