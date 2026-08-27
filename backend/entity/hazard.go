package entity

import (
	"gorm.io/gorm"
)

type Hazard struct {
	gorm.Model
	Name string
	UserID 	uint
	User   User `gorm:"foreignKey:UserID"`
	Product []Product `gorm:"foreignKey:HazardID"`
}
