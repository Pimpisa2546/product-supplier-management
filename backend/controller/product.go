package controller

import (
	"backend/entity"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ProductControll struct {
	DB *gorm.DB
}

func NewProductControll(db *gorm.DB) *ProductControll {
	return &ProductControll{DB: db}
}

func (ctrl *ProductControll) GetProducts(c *gin.Context) {
	var products []entity.Product
	ctrl.DB.Preload("Supplier").Preload("Category").Preload("Velocity").Preload("Hazard").Find(&products)
	c.JSON(http.StatusOK, products)
}

func (ctrl *ProductControll) CreateProduct(c *gin.Context) {
	var dataNewProduct entity.Product
	if err := c.ShouldBindJSON(&dataNewProduct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error Save Product": err.Error()})
		return
	}
	ctrl.DB.Create(&dataNewProduct)
	ctrl.DB.Preload("Supplier").Preload("Category").Preload("Hazard").Preload("Velocity").First(&dataNewProduct, dataNewProduct.ID)
	c.JSON(http.StatusCreated, dataNewProduct)
}

func (ctrl *ProductControll) DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Product{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Fail Delete Product": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Product Deleted Successfully"})
}

func (ctrl *ProductControll) UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var updateProduct entity.Product
	if err := ctrl.DB.First(&updateProduct,id).Error; err != nil {
		c.JSON(http.StatusNotFound,gin.H{"error": "Product not found"})
		return
	}

	var inputProduct entity.Product
	if err := c.ShouldBindJSON(&inputProduct); err != nil{
		c.JSON(http.StatusBadRequest,gin.H{"error": err.Error()})
		return
	}

	ctrl.DB.Model(&updateProduct).Updates(entity.Product{
		Name: inputProduct.Name,
		Detail: inputProduct.Detail,
		ImageURL: inputProduct.ImageURL,
		Price: inputProduct.Price,
		Stock: inputProduct.Stock,
		SupplierID: inputProduct.SupplierID,
		CategoryID: inputProduct.CategoryID,
		HazardID: inputProduct.HazardID,
		VelocityID: inputProduct.VelocityID,
	})

	ctrl.DB.Preload("Supplier").Preload("Category").Preload("Hazard").Preload("Velocity").First(&updateProduct,updateProduct.ID)
	c.JSON(http.StatusOK,updateProduct)
}

func (ctrl *ProductControll) GetProdutByID(c *gin.Context){
	id := c.Param("id")
	var product []entity.Product
	ctrl.DB.Preload("Supplier").Preload("Category").Preload("Hazard").Preload("Velocity").Find(&product,id)
	c.JSON(http.StatusOK, product)
}
