package controller

import(
	"backend/entity"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type VelocityControll struct{
	DB *gorm.DB
}

func NewVelocity(db *gorm.DB)*VelocityControll{
	return &VelocityControll{DB: db}
}

func (ctrl *VelocityControll) GetVelocities(c *gin.Context){
	var velocities []entity.Velocity
	ctrl.DB.Find(&velocities)
	c.JSON(http.StatusOK, velocities)
}

func (ctrl *VelocityControll) CreateVelocity(c *gin.Context){
	var dataNewVelocity entity.Velocity
	if err := c.ShouldBindJSON(&dataNewVelocity); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"Error Save Velocity": err.Error()})
		return
	}
	ctrl.DB.Create(&dataNewVelocity)
	c.JSON(http.StatusCreated, dataNewVelocity)
}

func (ctrl *VelocityControll) DeleteVelocity(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Velocity{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Fail Delete Velocity": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Velocity Deleted Successfully"})
}