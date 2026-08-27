package test

import (
	"testing"

	"backend/entity"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestSupplier(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Check all required fields for Supplier`, func(t *testing.T) {
		supplier := entity.Supplier{
		    Name:         "Acme Industrial Solutions Co., Ltd.",
		    Phone:        "0212345678",
		    Email:        "contact@acmesolutions.com",
		    ImageURL:     "https://example.com/images/suppliers/acme-logo.png",
		    Address:      "742 Evergreen Terrace, Suite 100, Springfield, OR 97477, USA",
		
		    ContactName:  "John Smith",
		    ContactPhone: "0812345678",
		    ContactEmail: "john.smith@acmesolutions.com",
		}

		ok, err := govalidator.ValidateStruct(supplier)

		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestSupplierName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Supplier Name is required`, func(t *testing.T) {
		supplier := entity.Supplier{
		    Name:         "",
		    Phone:        "0212345678",
		    Email:        "contact@acmesolutions.com",
		    ImageURL:     "https://example.com/images/suppliers/acme-logo.png",
		    Address:      "742 Evergreen Terrace, Suite 100, Springfield, OR 97477, USA",
		
		    ContactName:  "John Smith",
		    ContactPhone: "0812345678",
		    ContactEmail: "john.smith@acmesolutions.com",
		}

		ok, err := govalidator.ValidateStruct(supplier)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Supplier Name is required"))
	})
}

func TestSupplierPhone(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Supplier Phone is required`, func(t *testing.T) {
		supplier := entity.Supplier{
		    Name:         "Acme Industrial Solutions Co., Ltd.",
		    Phone:        "",
		    Email:        "contact@acmesolutions.com",
		    ImageURL:     "https://example.com/images/suppliers/acme-logo.png",
		    Address:      "742 Evergreen Terrace, Suite 100, Springfield, OR 97477, USA",
		
		    ContactName:  "John Smith",
		    ContactPhone: "0812345678",
		    ContactEmail: "john.smith@acmesolutions.com",
		}

		ok, err := govalidator.ValidateStruct(supplier)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Supplier Phone is required"))
	})
}

func TestSupplierEmail(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Supplier Email is required`, func(t *testing.T) {
		supplier := entity.Supplier{
		    Name:         "Acme Industrial Solutions Co., Ltd.",
		    Phone:        "0212345678",
		    Email:        "",
		    ImageURL:     "https://example.com/images/suppliers/acme-logo.png",
		    Address:      "742 Evergreen Terrace, Suite 100, Springfield, OR 97477, USA",
		
		    ContactName:  "John Smith",
		    ContactPhone: "0812345678",
		    ContactEmail: "john.smith@acmesolutions.com",
		}

		ok, err := govalidator.ValidateStruct(supplier)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Supplier Email is required"))
	})
}

func TestSupplierAddress(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Supplier Address is required`, func(t *testing.T) {
		supplier := entity.Supplier{
		    Name:         "Acme Industrial Solutions Co., Ltd.",
		    Phone:        "0212345678",
		    Email:        "contact@acmesolutions.com",
		    ImageURL:     "https://example.com/images/suppliers/acme-logo.png",
		    Address:      "",
		
		    ContactName:  "John Smith",
		    ContactPhone: "0812345678",
		    ContactEmail: "john.smith@acmesolutions.com",
		}

		ok, err := govalidator.ValidateStruct(supplier)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Supplier Address is required"))
	})
}

func TestSupplierContactName(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Contact Name is required`, func(t *testing.T) {
		supplier := entity.Supplier{
		    Name:         "Acme Industrial Solutions Co., Ltd.",
		    Phone:        "0212345678",
		    Email:        "contact@acmesolutions.com",
		    ImageURL:     "https://example.com/images/suppliers/acme-logo.png",
		    Address:      "742 Evergreen Terrace, Suite 100, Springfield, OR 97477, USA",
		
		    ContactName:  "",
		    ContactPhone: "0812345678",
		    ContactEmail: "john.smith@acmesolutions.com",
		}

		ok, err := govalidator.ValidateStruct(supplier)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Contact Name is required"))
	})
}

func TestSupplierContactPhone(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Contact Phone is required`, func(t *testing.T) {
		supplier := entity.Supplier{
		    Name:         "Acme Industrial Solutions Co., Ltd.",
		    Phone:        "0212345678",
		    Email:        "contact@acmesolutions.com",
		    ImageURL:     "https://example.com/images/suppliers/acme-logo.png",
		    Address:      "742 Evergreen Terrace, Suite 100, Springfield, OR 97477, USA",
		
		    ContactName:  "John Smith",
		    ContactPhone: "",
		    ContactEmail: "john.smith@acmesolutions.com",
		}

		ok, err := govalidator.ValidateStruct(supplier)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Contact Phone is required"))
	})
}

func TestSupplierContactEmail(t *testing.T) {
	g := NewGomegaWithT(t)

	t.Run(`Contact Email is required`, func(t *testing.T) {
		supplier := entity.Supplier{
		    Name:         "Acme Industrial Solutions Co., Ltd.",
		    Phone:        "0212345678",
		    Email:        "contact@acmesolutions.com",
		    ImageURL:     "https://example.com/images/suppliers/acme-logo.png",
		    Address:      "742 Evergreen Terrace, Suite 100, Springfield, OR 97477, USA",
		
		    ContactName:  "John Smith",
		    ContactPhone: "0812345678",
		    ContactEmail: "",
		}

		ok, err := govalidator.ValidateStruct(supplier)

		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).NotTo(BeNil())
		g.Expect(err.Error()).To(ContainSubstring("Contact Email is required"))
	})
}