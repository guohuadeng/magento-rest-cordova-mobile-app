package com.lifeng.jdxt.service;

import java.util.ArrayList;
import java.util.List;

import com.lifeng.jdxt.dao.ProjectDao;
import com.lifeng.jdxt.po.Project;

public class ProjectService {
	private ProjectDao projectDao = new ProjectDao();

	public ProjectDao getProjectDao() {
		return projectDao;
	}

	public void setProjectDao(ProjectDao projectDao) {
		this.projectDao = projectDao;
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
	 * @return
	 */
	public int saveProject(String name, String area, String state,
			String startTime, String quarter) {
		return this.projectDao.saveProject(name, area, state, startTime,
				quarter);
	}

	/**
	 * 
	 * @function:查询所有工程
	 * @date:2013-7-26
	 * @author:Jerry
	 * @return List
	 */
	public List<Project> queryAllProject() {
		return this.projectDao.queryAllProject();
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
		return this.projectDao.queryProjectById(id);
	}
	
	/**
	 * 
	 * @function:通过quarter查询某个工程
	 * @date:2013-7-27
	 * @author:KingPeng
	 * @param quarter
	 * @return List
	 */
	public List<Project> queryProjectByQuarter(String quarter) {
		return this.projectDao.queryProjectByQuarter(quarter);
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
		return this.projectDao.updateProjectById(id, name, area, state,
				startTime, quarter);
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
		return this.projectDao.deleteProjectById(id);
	}
}
