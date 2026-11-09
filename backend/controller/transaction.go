package controller

import (
	"backend/entity"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TransactionControll struct {
	DB *gorm.DB
}

func NewTransactionControll(db *gorm.DB) *TransactionControll {
	return &TransactionControll{DB: db}
}

func (ctrl *TransactionControll) GetSelecteDateTransaction(c *gin.Context) {
	var transaction []entity.Transaction
	query := ctrl.DB.Preload("Product")
	if c.Query("today") == "true" {
		loc, err := time.LoadLocation("Asia/Bangkok")
		if err != nil {
			loc = time.Local
		}
		now := time.Now().In(loc)
		startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)
		endOfDay := startOfDay.Add(24 * time.Hour)
		query = query.Where("transaction_create_date >= ? AND transaction_create_date < ?", startOfDay, endOfDay)
	}
	query.Order("transaction_create_date DESC").Find(&transaction)
	c.JSON(http.StatusOK, transaction)
}

func (ctrl *TransactionControll) CreateTransaction(c *gin.Context) {
	var dataTransaction entity.Transaction
	if err := c.ShouldBindJSON(&dataTransaction); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error Save Transaction": err.Error()})
		return
	}
	var product entity.Product
	if err := ctrl.DB.First(&product, dataTransaction.ProductID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product not found"})
		return
	}
	dataTransaction.SKU = product.SKU
	if err := ctrl.DB.Create(&dataTransaction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save transaction"})
		return
	}
	ctrl.DB.Preload("Product").First(&dataTransaction, dataTransaction.ID)
	c.JSON(http.StatusCreated, dataTransaction)
}

func (ctrl *TransactionControll) GetTransaction(c *gin.Context) {
	var transactions []entity.Transaction
	var totalRows int64

	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "5")
	search := c.Query("search")
	txType := c.Query("type")
	datePreset := c.Query("preset")
	startDateStr := c.Query("start_date")
	endDateStr := c.Query("end_date")

	p, err := strconv.Atoi(pageStr)
	if err != nil || p <= 0 {
		p = 1
	}
	l, err := strconv.Atoi(limitStr)
	if err != nil || l <= 0 {
		l = 5
	}

	offset := (p - 1) * l

	dbQuery := ctrl.DB.Model(&entity.Transaction{}).Preload("Product")

	if search != "" {
		dbQuery = dbQuery.Where("sku LIKE ? OR reference LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	if txType != "" {
		dbQuery = dbQuery.Where("transaction_Type = ?", txType)
	}

	loc, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		loc = time.Local
	}
	now := time.Now().In(loc)

	if startDateStr != "" {
		startDate, err := time.ParseInLocation("2006-01-02", startDateStr, loc)
		if err == nil {
			dbQuery = dbQuery.Where("transaction_create_date >= ?", startDate)
		}
	}
	if endDateStr != "" {
		endDate, err := time.ParseInLocation("2006-01-02", endDateStr, loc)
		if err == nil {
			endDate = endDate.Add(24 * time.Hour)
			dbQuery = dbQuery.Where("transaction_create_date <= ?", endDate)
		}
	}

	if datePreset == "Today" {
		startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)
		endOfDay := startOfDay.Add(24 * time.Hour)
		dbQuery = dbQuery.Where("transaction_create_date >= ? AND transaction_create_date < ?", startOfDay, endOfDay)
	} else if datePreset == "This Week" {
		weekdayOffset := int(now.Weekday())
		startOfWeek := time.Date(now.Year(), now.Month(), now.Day()-weekdayOffset, 0, 0, 0, 0, loc)
		dbQuery = dbQuery.Where("transaction_create_date >= ?", startOfWeek)
	} else if datePreset == "This Month" {
		startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, loc)
		dbQuery = dbQuery.Where("transaction_create_date >= ?", startOfMonth)
	}

	dbQuery.Count(&totalRows)

	if err := dbQuery.Order("transaction_create_date DESC").Limit(l).Offset(offset).Find(&transactions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	totalPages := (int(totalRows) + l - 1) / l

	c.JSON(http.StatusOK, gin.H{
		"data":         transactions,
		"total_items":  totalRows,
		"total_pages":  totalPages,
		"current_page": p,
		"limit":        l,
	})
}
