package controller

import (
	"backend/entity"
	"net/http"
	"strconv"

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
	var totalRows int64

	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "5")
	search := c.Query("search")
	categoryID := c.Query("category_id")
	hazardID := c.Query("hazard_id")
	velocityID := c.Query("velocity_id")

	p, err := strconv.Atoi(pageStr)
	if err != nil || p <= 0 {
		p = 1
	}

	l, err := strconv.Atoi(limitStr)
	if err != nil || l <= 0 {
		l = 5
	}

	offset := (p - 1) * l

	dbQuery := ctrl.DB.Model(&entity.Product{}).
		Preload("Supplier").
		Preload("Category").
		Preload("Velocity").
		Preload("Hazard")

	if search != "" {
		dbQuery = dbQuery.Where("name LIKE ? OR sku LIKE ?", "%"+search+"%", "%"+search+"%")
	}
	if categoryID != "" {
		dbQuery = dbQuery.Where("category_id = ?", categoryID)
	}
	if hazardID != "" {
		dbQuery = dbQuery.Where("hazard_id = ?", hazardID)
	}
	if velocityID != "" {
		dbQuery = dbQuery.Where("velocity_id = ?", velocityID)
	}

	dbQuery.Count(&totalRows)

	if err := dbQuery.Order("id DESC").Limit(l).Offset(offset).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	totalPages := (int(totalRows) + l - 1) / l
	c.JSON(http.StatusOK, gin.H{
		"data":         products,
		"total_items":  totalRows,
		"total_pages":  totalPages,
		"current_page": p,
		"limit":        l,
	})
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
	if err := ctrl.DB.First(&updateProduct, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var inputProduct entity.Product
	if err := c.ShouldBindJSON(&inputProduct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctrl.DB.Model(&updateProduct).Updates(entity.Product{
		Name:           inputProduct.Name,
		SKU:            inputProduct.SKU,
		Detail:         inputProduct.Detail,
		ImageURL:       inputProduct.ImageURL,
		Price:          inputProduct.Price,
		Width_Product:  inputProduct.Width_Product,
		Height_Product: inputProduct.Height_Product,
		Length_Product: inputProduct.Length_Product,
		Weight_Product: inputProduct.Weight_Product,
		Color_Product: inputProduct.Color_Product,
		SupplierID: inputProduct.SupplierID,
		CategoryID: inputProduct.CategoryID,
		HazardID:   inputProduct.HazardID,
		VelocityID: inputProduct.VelocityID,
	})

	ctrl.DB.Preload("Supplier").Preload("Category").Preload("Hazard").Preload("Velocity").First(&updateProduct, updateProduct.ID)
	c.JSON(http.StatusOK, updateProduct)
}

func (ctrl *ProductControll) GetProdutByID(c *gin.Context) {
	id := c.Param("id")
	var product []entity.Product
	ctrl.DB.Preload("Supplier").Preload("Category").Preload("Hazard").Preload("Velocity").Find(&product, id)
	c.JSON(http.StatusOK, product)
}
