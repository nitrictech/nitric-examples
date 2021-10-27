// [START snippet]
// functions/create/main.go

package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/mitchellh/mapstructure"
	"github.com/nitrictech/go-sdk/api/documents"
	"github.com/nitrictech/go-sdk/faas"
	"nitric.io/rest-api/common"
)

// Updates context with error information
func httpError(ctx *faas.HttpContext, message string, status int) {
	ctx.Response.Body = []byte(message)
	ctx.Response.Status = status
}

func handler(ctx *faas.HttpContext, next faas.HttpHandler) (*faas.HttpContext, error) {
	order := &common.Order{}
	if err := json.Unmarshal(ctx.Request.Data(), order); err != nil {
		httpError(ctx, "error decoding json body", 400)
		return ctx, nil
	}

	// get the current time and set the order time
	orderTime := time.Now()
	order.DateOrdered = orderTime.Format(time.RFC3339)

	// set the ID of the order
	id := uuid.New().String()
	order.ID = id

	dc, _ := documents.New()

	// Convert the document to a map[string]interface{}
	// for storage, future iterations of the go-sdk may include direct interface{} storage as well
	orderMap := make(map[string]interface{})
	_ = mapstructure.Decode(order, &orderMap)

	if err := dc.Collection("orders").Doc(id).Set(orderMap); err != nil {
		httpError(ctx, "error writing orders document", 400)
		return ctx, nil
	}

	ctx.Response.Status = 200
	ctx.Response.Body = []byte(fmt.Sprintf("Created order with ID: %s", id))

	return next(ctx)
}

func main() {
	err := faas.New().Http(
		// Actual Handler
		handler,
	).Start()

	if err != nil {
		fmt.Println(err)
	}
}

// [END snippet]
