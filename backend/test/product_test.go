package test

import (
	"testing"

	"backend/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestProduct(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Check all required fields for Product`, func(t *testing.T) {
		product := entity.Product{
			Name:  "Computer",
			Detail: "-",		
			ImageURL:"-",	
			Price: 12000,      
			Stock: 5,      
			SupplierID: 1, 
			CategoryID: 3, 	
			HazardID: 3,   
			VelocityID: 2, 
	
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestProductName(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run(`Product Name is required`, func(t *testing.T) {
		product := entity.Product{
			Name:  "", //ไม่มีชื่อ
			Detail: "-",		
			ImageURL:"-",	
			Price: 12000,      
			Stock: 5,      
			SupplierID: 1, 
			CategoryID: 3, 	
			HazardID: 3,   
			VelocityID: 2,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Product Name is required"))
	})
}


func TestProductPrice(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run(`Product Price is required`, func(t *testing.T) {
		product := entity.Product{
			Name:  "Computer", 
			Detail: "-",		
			ImageURL:"-",	
			Price: 0, // =0     
			Stock: 5,      
			SupplierID: 1, 
			CategoryID: 3, 	
			HazardID: 3,   
			VelocityID: 2,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Product Price must be greater than 0"))
	})
}

func TestProductSupplier(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run(`Supplier is required`, func(t *testing.T) {
		product := entity.Product{
			Name:  "Computer", 
			Detail: "-",		
			ImageURL:"-",	
			Price: 100,     
			Stock: 5,      
			SupplierID: 0, 
			CategoryID: 3, 	
			HazardID: 3,   
			VelocityID: 2,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Supplier is required"))
	})
}

func TestProductCategory(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run(`Category is required`, func(t *testing.T) {
		product := entity.Product{
			Name:  "Computer", 
			Detail: "-",		
			ImageURL:"-",	
			Price: 100,     
			Stock: 5,      
			SupplierID: 1, 
			CategoryID: 0, 	
			HazardID: 3,   
			VelocityID: 2,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Category is required"))
	})
}

func TestProductHazard(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run(`Hazard is required`, func(t *testing.T) {
		product := entity.Product{
			Name:  "Computer", 
			Detail: "-",		
			ImageURL:"-",	
			Price: 100,     
			Stock: 5,      
			SupplierID: 1, 
			CategoryID: 3, 	
			HazardID: 0,   
			VelocityID: 2,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Hazard is required"))
	})
}

func TestProductVelocity(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run(`Velocity is required`, func(t *testing.T) {
		product := entity.Product{
			Name:  "Computer", 
			Detail: "-",		
			ImageURL:"-",	
			Price: 100,     
			Stock: 5,      
			SupplierID: 1, 
			CategoryID: 3, 	
			HazardID: 3,   
			VelocityID: 0,
		}

		ok, err := govalidator.ValidateStruct(product)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Velocity is required"))
	})
}