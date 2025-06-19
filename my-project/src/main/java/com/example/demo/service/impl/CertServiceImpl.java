package com.example.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exception.CertException;
import com.example.demo.exception.PasswordInvalidException;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.model.dto.UserCert;
import com.example.demo.model.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CertService;
import com.example.demo.util.Hash;

@Service
public class CertServiceImpl implements CertService {
	@Autowired
	private UserRepository userRepository;

	@Override
	public UserCert getCert(String username, String password) throws CertException {
	// public UserCert getCert(String username, String password) throws UserNotFoundException, PasswordInvalidException {
		// 1. 是否有此人
		User user = userRepository.getUser(username);
		if(user == null) {
			throw new UserNotFoundException("查無此人");
		}
		// 2. 密碼 hash 比對
		String passwordHash = Hash.getHash(password, user.getSalt());
		if(!passwordHash.equals(user.getPasswordHash())) {
			throw new PasswordInvalidException("密碼錯誤");
		}
		
		// 3. 驗證信箱
		if (!Boolean.TRUE.equals(user.getActive())) {
            throw new CertException("帳號尚未啟用，請先完成信箱驗證");
        }
		
		 // 4. 檢查是否被封鎖
	    if (Boolean.TRUE.equals(user.getBlocked())) {
	        throw new CertException("此帳號已被封鎖，無法登入");
	    }

	    // 5. 簽發憑證
	    return new UserCert(user.getUserId(), user.getUsername(), user.getRole());
	}
	
}