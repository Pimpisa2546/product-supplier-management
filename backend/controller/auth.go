package controller

import (
	   "net/http"
	   "time"

	   "backend/config"
	   "backend/entity"

	   "github.com/gin-gonic/gin"
	   "github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("my-secret-key") 

type LoginPayload struct {
	   Email    string `json:"email" binding:"required"`
	   Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	   var payload LoginPayload
	   if err := c.ShouldBindJSON(&payload); err != nil {
		   c.JSON(http.StatusBadRequest, gin.H{"error": "Please complete all required fields."})
		   return
	   }

	   db := config.DB()
	   var user entity.User

	   if err := db.Where("email = ?", payload.Email).First(&user).Error; err != nil {
		   c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		   return
	   }

	   checkPassword := config.CheckPasswordHash(payload.Password,user.Password)
	   if !checkPassword {
		   c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		   return
	   }

	   //สร้าง JWT Token
	   expirationTime := time.Now().Add(10 * time.Minute)
	   claims := jwt.MapClaims{
			"user_id": user.ID,
		   "email": user.Email,
		   "role_id": user.RoleID,
		   "exp":   expirationTime.Unix(),
	   }

	   token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	   tokenString, err := token.SignedString(jwtKey)
	   if err != nil {
		   c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		   return
	   }

	   c.JSON(http.StatusOK, gin.H{
		   "message": "Login successful",
		   "token":   tokenString, //ส่ง JWT Token กลับไป
		   "user": gin.H{
			   "id":     user.ID,
			   "name":   user.Name,
			   "email":  user.Email,
			   "role_id": user.RoleID,
		   },
	   })
}