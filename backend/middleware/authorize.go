package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("my-secret-key")

func AuthenticateJWT() gin.HandlerFunc{
	return func(c *gin.Context){
		authHeader := c.GetHeader("Authorization")
		if authHeader == ""{
			c.JSON(http.StatusUnauthorized,gin.H{"error":"Missing Token"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader,"Bearer ")

		token,err := jwt.Parse(tokenString,func(token *jwt.Token)(interface{},error){
			return jwtSecret,nil
		})

		if err != nil || !token.Valid{
			c.JSON(http.StatusUnauthorized,gin.H{"error" : "Invalid or Expired Token"})
			c.Abort()
			return
		}
		if claims,ok := token.Claims.(jwt.MapClaims); ok{
			roleID := uint(claims["role_id"].(float64))
			c.Set("roleID",roleID)
		}
		c.Next()

	}
}

func AuthorizeRoles(allowedRoles ...uint) gin.HandlerFunc{
	return func(c *gin.Context){
		roleIDValue,exists := c.Get("roleID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Role not found"})
			c.Abort()
			return
		}

		userRoleID := roleIDValue.(uint)

		hasPermission := false
		for _, role := range allowedRoles {
			if userRoleID == role {
				hasPermission = true
				break
			}
		}
		if !hasPermission {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access Denied"})
			c.Abort()
			return
		}
		c.Next()
	}
}