package entity

import (
	"gorm.io/gorm"
)

type Supplier struct {
	gorm.Model
	//ของบริษัท
	Name  		string	`valid:"required~Supplier Name is required" gorm:"not null"`
	Phone 		string	`valid:"required~Supplier Phone is required" gorm:"not null"`
	Email 		string	`valid:"required~Supplier Email is required" gorm:"not null"`
	ImageURL	string
	Address		string	`valid:"required~Supplier Address is required" gorm:"not null"`
	//ของผู้ที่ประสานงาน
	ContactName	string	`valid:"required~Contact Name is required" gorm:"not null"`
	ContactPhone string	`valid:"required~Contact Phone is required" gorm:"not null"`
	ContactEmail string	`valid:"required~Contact Email is required" gorm:"not null"`

	UserID 		uint
	User   		User `gorm:"foreignKey:UserID"`
	Product 	[]Product `gorm:"foreignKey:SupplierID"`
}
