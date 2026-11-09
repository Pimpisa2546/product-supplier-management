package entity

import (
	"gorm.io/gorm"
	"time"
)

type Transaction struct {
	gorm.Model
	Transaction_Type       string
	Quantity               int
	Reason                 string
	Reference              string
	MFG_Date               *time.Time
	EXP_Date               *time.Time
	Transaction_CreateDate time.Time

	SKU       string
	ProductID uint
	Product   Product `gorm:"foreignKey:ProductID"`
}
