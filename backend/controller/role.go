package controller

import(
	"backend/entity"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RoleControll struct{
	DB *gorm.DB
}

func NewRole(db *gorm.DB)*RoleControll{
	return &RoleControll{DB: db}
}

func (ctrl *RoleControll) GetRole(c *gin.Context){
	var role []entity.Role
	ctrl.DB.Find(&role)
	c.JSON(http.StatusOK, role)
}

func (ctrl *RoleControll) CreateRole(c *gin.Context){
	var newRole []entity.Role
	if err := c.ShouldBindJSON(&newRole); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"Error Save Role": err.Error()})
		return
	}
	ctrl.DB.Create(&newRole)
	c.JSON(http.StatusCreated, newRole)
}

func (ctrl *RoleControll) DeleteRole(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Role{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Fail Delete Role": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Role Deleted Successfully"})
}