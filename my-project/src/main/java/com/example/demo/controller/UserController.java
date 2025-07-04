package com.example.demo.controller;

import com.example.demo.exception.CertException;
import com.example.demo.model.dto.ChangePasswordRequestDto;
import com.example.demo.model.dto.LoginRequestDto;
import com.example.demo.model.dto.RegisterRequestDto;
import com.example.demo.model.dto.UserCert;
import com.example.demo.model.dto.UserDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.CertService;
import com.example.demo.service.UserService;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
	private CertService certService;

    // 驗證信箱 
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifyUser(@RequestParam String token) {
        boolean verified = userService.verifyUser(token);
        if (verified) {
            return ResponseEntity.ok(ApiResponse.success("帳號驗證成功，請登入!", null));
        } else {
            return ResponseEntity.status(400).body(ApiResponse.error(400, "驗證連結無效或已過期"));
        }
    }

    // 註冊
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody RegisterRequestDto request) {
        boolean success = userService.register(request.getUsername(), request.getPassword(), request.getEmail());

        if (success) {
            return ResponseEntity.ok(ApiResponse.success("註冊成功，請去信箱收取驗證信！", null));
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.error(400, "使用者名稱已存在!"));
        }
    }

    // 依 name 查詢使用者
    @GetMapping("/name/{username}")
    public ResponseEntity<ApiResponse<?>> getUserByUsername(@PathVariable String username) {
        Optional<UserDto> userOpt = userService.getUserByUsername(username);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success("查詢成功", userOpt.get()));
        } else {
            return ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(404, "找不到使用者"));
        }
    }
    
    // 更改密碼
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestBody ChangePasswordRequestDto request) {

        boolean success = userService.changePassword(
            request.getUsername(), 
            request.getOldPassword(), 
            request.getNewPassword()
        );

        if (success) {
            return ResponseEntity.ok(ApiResponse.success("密碼更新成功", null));
        } else {
            return ResponseEntity.status(400).body(ApiResponse.error(400, "密碼錯誤或使用者不存在"));
        }
    }
    
    // 忘記密碼 - 寄送重設連結
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestParam String username,
                                                            @RequestParam String email) {
        boolean sent = userService.sendResetPasswordEmail(username, email);
        if (sent) {
            return ResponseEntity.ok(ApiResponse.success("重設密碼信件已寄出", null));
        } else {
            return ResponseEntity.status(404).body(ApiResponse.error(404, "找不到該使用者或信箱不正確"));
        }
    }


    // 重設密碼 - 使用 token + 新密碼
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {

        boolean success = userService.resetPassword(token, newPassword);
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("密碼已成功重設", null));
        } else {
            return ResponseEntity.status(400).body(ApiResponse.error(400, "重設連結無效或已過期"));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserDto>> login(
            @RequestBody LoginRequestDto loginRequest,
            HttpSession session) {

        // 從 request 中取得欄位
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        String captcha = loginRequest.getCaptcha();

        // 1. 驗證 captcha
        String expectedCaptcha = (String) session.getAttribute("captcha");
        if (expectedCaptcha == null || !expectedCaptcha.equalsIgnoreCase(captcha)) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, "驗證碼錯誤"));
        }

        try {
            // 2. 驗證帳號密碼
            UserCert cert = certService.getCert(username, password);
            session.setAttribute("userCert", cert);
            session.setAttribute("userId", cert.getUserId());

            // 3. 將 UserCert 轉換成 UserDto 回傳
            UserDto dto = new UserDto();
            dto.setUserId(cert.getUserId());
            dto.setUsername(cert.getUsername());
            dto.setRole(cert.getRole());

            return ResponseEntity.ok(ApiResponse.success("登入成功", dto));

        } catch (CertException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "登入失敗: " + e.getMessage()));
        }
    }

	
	@GetMapping("/logout")
	public ResponseEntity<ApiResponse<Void>> logout(HttpSession session) {
	    if(session.getAttribute("userCert") == null) {
	    	return ResponseEntity
	                .status(HttpStatus.UNAUTHORIZED)
	                .body(ApiResponse.error(401, "登出失敗: 尚未登入 "));
	    }
	    session.invalidate();
	    return ResponseEntity.ok(ApiResponse.success("登出成功", null));
	}
	
	@GetMapping("/check-login")
	public ResponseEntity<ApiResponse<?>> checkLogin(HttpSession session) {
	    UserCert cert = (UserCert) session.getAttribute("userCert");

	    if (cert == null) {
	        return ResponseEntity.ok(ApiResponse.success("尚未登入", 
	            Map.of("loggedIn", false)));
	    }

	    return ResponseEntity.ok(ApiResponse.success("登入中", 
	        Map.of(
	            "loggedIn", true,
	            "role", cert.getRole()
	        )
	    ));
	}
	
	// 刪除帳號
	@DeleteMapping("/delete/{username}")
	public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String username) {
	    boolean deleted = userService.deleteUser(username);
	    if (deleted) {
	        return ResponseEntity.ok(ApiResponse.success("帳號刪除成功", null));
	    } else {
	        return ResponseEntity.status(404).body(ApiResponse.error(404, "找不到該帳號"));
	    }
	}
	
	// 註冊重新發送驗證
	@PostMapping("/resend-verification")
	public ResponseEntity<ApiResponse<Void>> resendVerification(@RequestParam String username) {
	    boolean result = userService.resendVerificationEmail(username);
	    if (result) {
	        return ResponseEntity.ok(ApiResponse.success("驗證信已重新寄出", null));
	    } else {
	        return ResponseEntity.badRequest().body(ApiResponse.error(400, "使用者不存在或已啟用"));
	    }
	}
	
	// 查詢使用者角色
	@GetMapping("/role")
	public ResponseEntity<ApiResponse<String>> getUserRole(HttpSession session) {
	    UserCert cert = (UserCert) session.getAttribute("userCert");
	    if (cert == null) {
	        return ResponseEntity.status(401).body(ApiResponse.error(401, "尚未登入"));
	    }
	    return ResponseEntity.ok(ApiResponse.success("角色查詢成功", cert.getRole()));
	}

	// 查詢目前登入的使用者資訊
	@GetMapping("/me")
	public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(HttpSession session) {
	    UserCert cert = (UserCert) session.getAttribute("userCert");
	    if (cert == null) {
	        return ResponseEntity.status(401).body(ApiResponse.error(401, "尚未登入"));
	    }

	    UserDto dto = new UserDto();
	    dto.setUserId(cert.getUserId());
	    dto.setUsername(cert.getUsername());
	    dto.setRole(cert.getRole());
	    return ResponseEntity.ok(ApiResponse.success("查詢成功", dto));
	}
	
	// 封鎖帳號
	@PutMapping("/block/{username}")
	public ResponseEntity<ApiResponse<Void>> blockUser(@PathVariable String username) {
	    boolean success = userService.blockUser(username);
	    if (success) {
	        return ResponseEntity.ok(ApiResponse.success("帳號已封鎖", null));
	    } else {
	        return ResponseEntity.status(404).body(ApiResponse.error(404, "找不到該帳號"));
	    }
	}

	// 解除封鎖帳號
	@PutMapping("/unblock/{username}")
	public ResponseEntity<ApiResponse<Void>> unblockUser(@PathVariable String username) {
	    boolean success = userService.unblockUser(username);
	    if (success) {
	        return ResponseEntity.ok(ApiResponse.success("帳號已解除封鎖", null));
	    } else {
	        return ResponseEntity.status(404).body(ApiResponse.error(404, "找不到該帳號"));
	    }
	}
	
	// 依 ID 查詢使用者
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getUserById(@PathVariable Integer id) {
        Optional<UserDto> userOpt = userService.getUserById(id);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success("查詢成功", userOpt.get()));
        } else {
            return ResponseEntity
                    .status(404)
                    .body(ApiResponse.error(404, "找不到使用者"));
        }
    }
	
}

