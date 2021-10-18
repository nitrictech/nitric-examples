package common

type Order struct {
	ID          string `json:"id"`
	DateOrdered string `json:"dateOrdered"`
	ItemID      string `json:"itemId"`
	CustomerID  string `json:"customerId"`
}
