package controller

import(
	"backend/entity"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type HazardControll struct{
	DB *gorm.DB
}

func NewHazard(db *gorm.DB)*HazardControll{
	return &HazardControll{DB: db}
}

func (ctrl *HazardControll) GetHazards(c *gin.Context){
	var hazards []entity.Hazard
	ctrl.DB.Find(&hazards)
	c.JSON(http.StatusOK, hazards)
}

func (ctrl *HazardControll) CreateHazard(c *gin.Context){
	var dataNewHazard entity.Hazard
	if err := c.ShouldBindJSON(&dataNewHazard); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"Error Save Hazard": err.Error()})
		return
	}
	ctrl.DB.Create(&dataNewHazard)
	c.JSON(http.StatusCreated, dataNewHazard)
}

func (ctrl *HazardControll) DeleteHazard(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Hazard{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Fail Delete Hazard": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Hazard Deleted Successfully"})
}