package com.lifeng.jdxt.vo;

import com.lifeng.jdxt.po.User;

public class UserVo {
	private String userName;
	private String password;
	private String nickName;
	private String message;

	public UserVo() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserVo(String message) {
		super();
		this.message = message;
	}

	public UserVo(String userName, String password, String nickName,
			String message) {
		super();
		this.userName = userName;
		this.password = password;
		this.nickName = nickName;
		this.message = message;
	}

	public UserVo(User user) {
		this.userName = user.getUserName();
		this.password = user.getPassword();
		this.nickName = user.getNickName();
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
