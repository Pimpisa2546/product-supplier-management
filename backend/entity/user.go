package entity

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name       string 
	Email		string
	Password	string
	RoleID uint
	Role   Role `gorm:"foreignKey:RoleID"`

	Product []Product `gorm:"foreignKey:UserID"`
	Category []Category `gorm:"foreignKey:UserID"`
	Supplier []Supplier `gorm:"foreignKey:UserID"`
	Hazard []Hazard `gorm:"foreignKey:UserID"`
	Velocity []Velocity `gorm:"foreignKey:UserID"`
}
