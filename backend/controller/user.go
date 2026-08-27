package controller

import(
	"backend/entity"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserControll struct{
	DB *gorm.DB
}

func NewUser(db *gorm.DB)*UserControll{
	return &UserControll{DB: db}
}

func (ctrl *UserControll) GetUser(c *gin.Context){
	var user []entity.User
	ctrl.DB.Preload("Role").Find(&user)
	c.JSON(http.StatusOK, user)
}

func (ctrl *UserControll) CreateUser(c *gin.Context){
	var newUser entity.User
	if err := c.ShouldBindJSON(&newUser); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"Error Save New User": err.Error()})
		return
	}
	ctrl.DB.Create(&newUser)
	c.JSON(http.StatusCreated, newUser)
}

func (ctrl *UserControll) DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.User{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Fail Delete User": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User Deleted Successfully"})
}