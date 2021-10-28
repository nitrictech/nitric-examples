// [START snippet]

package main

import (
	"fmt"

	"github.com/nitrictech/go-sdk/api/documents"
	"github.com/nitrictech/go-sdk/faas"
	"nitric.io/example-service/common"
)

func handler(ctx *faas.HttpContext, next faas.HttpHandler) (*faas.HttpContext, error) {
	params, ok := ctx.Extras["params"].(map[string]string)

	if !ok || params == nil {
		return nil, fmt.Errorf("error retrieving path params")
	}

	id := params["id"]

	dc, err := documents.New()
	if err != nil {
		return nil, err
	}

	err = dc.Collection("examples").Doc(id).Delete()
	if err != nil {
		ctx.Response.Body = []byte("Error deleting document")
		ctx.Response.Status = 500
	} else {
		ctx.Response.Body = []byte("Successfully deleted document")
		ctx.Response.Status = 200
	}

	return next(ctx)
}

func main() {
	err := faas.New().Http(
		// Retrieve path parameters if available
		common.PathParser("/examples/:id"),
		// Actual Handler
		handler,
	).Start()

	if err != nil {
		fmt.Println(err)
	}
}

// [END snippet]
