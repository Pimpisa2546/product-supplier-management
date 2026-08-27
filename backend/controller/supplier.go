package controller

import(
	"backend/entity"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SupplierControll struct{
	DB *gorm.DB
}

func NewSupplier(db *gorm.DB)*SupplierControll{
	return &SupplierControll{DB: db}
}

func (ctrl *SupplierControll) GetSuppliers(c *gin.Context){
	var suppliers []entity.Supplier
	ctrl.DB.Find(&suppliers)
	c.JSON(http.StatusOK, suppliers)
}

func (ctrl *SupplierControll) CreateSupplier(c *gin.Context){
	var dataNewSupplier entity.Supplier
	if err := c.ShouldBindJSON(&dataNewSupplier); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"Error Save Supplier": err.Error()})
		return
	}
	ctrl.DB.Create(&dataNewSupplier)
	c.JSON(http.StatusCreated, dataNewSupplier)
}

func (ctrl *SupplierControll) DeleteSupplier(c *gin.Context) {
	id := c.Param("id")
	if err := ctrl.DB.Delete(&entity.Supplier{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Fail Delete Supplier": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Supplier Deleted Successfully"})
}

func (ctrl *SupplierControll) UpdateSupplier(c *gin.Context) {
	id := c.Param("id")
	var updateSupplier entity.Supplier
	if err := ctrl.DB.First(&updateSupplier,id).Error; err != nil {
		c.JSON(http.StatusNotFound,gin.H{"error": "Supplier not found"})
		return
	}

	var input entity.Supplier
	if err := c.ShouldBindJSON(&input); err != nil{
		c.JSON(http.StatusBadRequest,gin.H{"error": err.Error()})
		return
	}

	ctrl.DB.Model(&updateSupplier).Updates(entity.Supplier{
		Name: input.Name,
		Phone: input.Phone,
		Email: input.Email,
		ImageURL: input.ImageURL,
		Address: input.Address,
		ContactName: input.ContactName,
		ContactPhone: input.ContactPhone,
		ContactEmail: input.ContactEmail,

	})

	ctrl.DB.First(&updateSupplier,updateSupplier.ID)
	c.JSON(http.StatusOK,updateSupplier)
}

func (ctrl *SupplierControll) GetSuppliersByID(c *gin.Context){
	id := c.Param("id")
	var suppliers []entity.Supplier
	ctrl.DB.Find(&suppliers,id)
	c.JSON(http.StatusOK, suppliers)
}