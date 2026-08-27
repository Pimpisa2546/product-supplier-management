package main

import (
	"backend/config"
	"backend/controller"

	"backend/middleware"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {
	config.ConnectionDB()
	config.SetupDatabase()
	db := config.DB()

	productCtrl := controller.NewProductControll(db)
	categoryCtrl := controller.NewCategory(db)
	supplierCtrl := controller.NewSupplier(db)
	hazardCtrl := controller.NewHazard(db)
	velocityCtrl := controller.NewVelocity(db)
	userCtrl := controller.NewUser(db)
	roleCtrl := controller.NewRole(db)


	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173","https://product-supplier-management-three.vercel.app",
		},
		AllowMethods: []string{"GET","POST","PUT","DELETE","OPTIONS","PATCH"},
		AllowHeaders: []string{"Origin","Content-Type","Authorization"},
		AllowCredentials: true,
		MaxAge: 12 * time.Hour,
	}))
	r.POST("/login", controller.Login)
	api := r.Group("/")
	api.Use(middleware.AuthenticateJWT())
	{
		api.GET("/products", productCtrl.GetProducts)
		api.POST("/products", productCtrl.CreateProduct)
		api.DELETE("/products/:id", productCtrl.DeleteProduct)
		api.PUT("/products/:id", productCtrl.UpdateProduct)

		api.GET("/categories", categoryCtrl.GetCategories)
		api.POST("/categories", categoryCtrl.CreateCategory)
		api.DELETE("/categories/:id", categoryCtrl.DeleteCategory)
		api.PUT("/categories/:id", categoryCtrl.UpdateCategory)

		api.GET("/suppliers", supplierCtrl.GetSuppliers)
		api.POST("/suppliers", supplierCtrl.CreateSupplier)
		api.DELETE("/suppliers/:id", supplierCtrl.DeleteSupplier)
		api.PUT("/suppliers/:id",supplierCtrl.UpdateSupplier)
		api.GET("/suppliers/:id",supplierCtrl.GetSuppliersByID)

		api.GET("/hazards", hazardCtrl.GetHazards)
		api.POST("/hazards", hazardCtrl.CreateHazard)
		api.DELETE("/hazards/:id", hazardCtrl.DeleteHazard)

		api.GET("/velocities", velocityCtrl.GetVelocities)
		api.POST("/velocities", velocityCtrl.CreateVelocity)
		api.DELETE("/velocities/:id", velocityCtrl.DeleteVelocity)

		api.GET("/user", userCtrl.GetUser)
		api.POST("/user", userCtrl.CreateUser)
		api.DELETE("/user/:id", userCtrl.DeleteUser)

		api.GET("/role", roleCtrl.GetRole)
		api.POST("/role", roleCtrl.CreateRole)
		api.DELETE("/role/:id", roleCtrl.DeleteRole)
	}
	r.Run(":8080")
}
