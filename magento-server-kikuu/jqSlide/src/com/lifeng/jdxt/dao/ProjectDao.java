package com.lifeng.jdxt.dao;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.lifeng.jdxt.po.Project;

public class ProjectDao extends UserDao {

	/**
	 * 
	 * @function:查询工程
	 * @date:2013-7-26
	 * @author:Jerry
	 * @param sql
	 * @param params
	 * @return
	 */
	private List<Project> queryProject(String sql, Object[] params) {
		List<Project> projectList = new ArrayList<Project>();
		connection = BaseDao.getConnection();
		try {
			preparedStatement = connection.prepareStatement(sql);
			if (params != null) {
				for (int i = 0; i < params.length; i++) {
					preparedStatement.setString(i + 1, params[i].toString());
				}
			}
			resultSet = preparedStatement.executeQuery();
			while (resultSet.next()) {
				String id = resultSet.getString("id");
				String name = resultSet.getString("name");
				String area = resultSet.getString("area");
				String state = resultSet.getString("state");
				String startTime = resultSet.getString("starttime");
				String quarter = resultSet.getString("quarter");
				Project project = new Project(id, name, area, state, startTime,
						quarter);
				projectList.add(project);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			BaseDao.closeAll(connection, preparedStatement, resultSet);
		}
		return projectList;
	}

	/**
	 * 
	 * @function:创建工程
	 * @date:2013-7-26
	 * @author:Jerry
	 * @param name
	 * @param area
	 * @param state
	 * @param startTime
	 * @param quarter
	 * @return int
	 */
	public int saveProject(String name, String area, String state,
			String startTime, String quarter) {
		String id = BaseDao.createID();
		String sql = "insert into project values(?,?,?,?,?,?)";
		Object[] params = { id, name, area, state, startTime, quarter };
		return BaseDao.executeUpdate(sql, params);

	}

	/**
	 * 
	 * @function:查询所有工程
	 * @date:2013-7-26
	 * @author:Jerry
	 * @return List
	 */
	public List<Project> queryAllProject() {
		String sql = "select * from project order by starttime desc";
		return this.queryProject(sql, null);
	}

	/**
	 * 
	 * @function:通过id查询某个工程
	 * @date:2013-7-26
	 * @author:Jerry
	 * @param id
	 * @return List
	 */
	public List<Project> queryProjectById(String id) {
		String sql = "select * from project where id=?";
		Object[] params = { id };
		return this.queryProject(sql, params);
	}

	/**
	 * 
	 * @function:通过季度查询某个工程
	 * @date:2013-7-27
	 * @author:KingPeng
	 * @param quarter
	 * @return List
	 */
	public List<Project> queryProjectByQuarter(String quarter) {
		String sql = "select * from project where quarter=?";
		Object[] params = { quarter };
		return this.queryProject(sql, params);
	}

	/**
	 * 
	 * @function:通过id修改工程
	 * @date:2013-7-26
	 * @author:Jerry
	 * @param id
	 * @param name
	 * @param area
	 * @param state
	 * @param startTime
	 * @param quarter
	 * @return int
	 */
	public int updateProjectById(String id, String name, String area,
			String state, String startTime, String quarter) {
		String sql = "update project set name=?,area=?,state=?, starttime=?,quarter=? where id=?";
		Object[] params = { name, area, state, startTime, quarter, id };
		return BaseDao.executeUpdate(sql, params);
	}

	/**
	 * 
	 * @function:通过id删除工程
	 * @date:2013-7-26
	 * @author:Jerry
	 * @param id
	 * @return int
	 */
	public int deleteProjectById(String id) {
		String sql = "delete from project where id=?";
		Object[] params = { id };
		return BaseDao.executeUpdate(sql, params);
	}
}
