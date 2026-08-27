package entity

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name       string  `valid:"required~Product Name is required" gorm:"not null"`
	Detail     string
	ImageURL   string
	Price      float64 `valid:"required~Product Price must be greater than 0" gorm:"not null"`
	Stock      int
	

	SupplierID uint    `valid:"required~Supplier is required"`
	CategoryID uint    `valid:"required~Category is required"`
	HazardID   uint    `valid:"required~Hazard is required"`
	VelocityID uint    `valid:"required~Velocity is required"`
	UserID     uint
	
	User       User     `valid:"-" gorm:"foreignKey:UserID"`
	Supplier   Supplier `valid:"-" gorm:"foreignKey:SupplierID"`
	Category   Category `valid:"-" gorm:"foreignKey:CategoryID"`
	Hazard     Hazard   `valid:"-" gorm:"foreignKey:HazardID"`
	Velocity   Velocity `valid:"-" gorm:"foreignKey:VelocityID"`
}