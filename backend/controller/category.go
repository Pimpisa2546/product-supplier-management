package controller

import(
	"backend/entity"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CategoryControll struct{
	DB *gorm.DB
}

func NewCategory(db *gorm.DB)*CategoryControll{
	return &CategoryControll{DB: db}
}

func (ctrl *CategoryControll) GetCategories(c *gin.Context){
	var categories []entity.Category
	ctrl.DB.Find(&categories)
	c.JSON(http.StatusOK, categories)
}

func (ctrl *CategoryControll) CreateCategory(c *gin.Context){
	var dataNewCategory entity.Category
	if err := c.ShouldBindJSON(&dataNewCategory); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"Error Save Category": err.Error()})
		return
	}
	ctrl.DB.Create(&dataNewCategory)
	c.JSON(http.StatusCreated, dataNewCategory)
}

func (ctrl *CategoryControll) DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Category{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Fail Delete Category": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Category Deleted Successfully"})
}

func (ctrl *CategoryControll) UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	var updateCategory entity.Category
	if err := ctrl.DB.First(&updateCategory,id).Error; err != nil {
		c.JSON(http.StatusNotFound,gin.H{"error": "Category not found"})
		return
	}

	var input entity.Category
	if err := c.ShouldBindJSON(&input); err != nil{
		c.JSON(http.StatusBadRequest,gin.H{"error": err.Error()})
		return
	}

	ctrl.DB.Model(&updateCategory).Updates(entity.Category{
		Name: input.Name,
		UserID: input.UserID,
	})

	ctrl.DB.First(&updateCategory,updateCategory.ID)
	c.JSON(http.StatusOK,updateCategory)
}