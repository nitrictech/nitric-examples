// [START snippet]

package main

import (
	"encoding/json"
	"fmt"

	"github.com/nitrictech/go-sdk/api/documents"
	"github.com/nitrictech/go-sdk/faas"
	"github.com/nitrictech/go-sdk/resources"
	"nitric.io/rest-api/common"
)

var (
	orders documents.CollectionRef
)

func handler(ctx *faas.HttpContext, next faas.HttpHandler) (*faas.HttpContext, error) {
	params, ok := ctx.Extras["params"].(map[string]string)
	if !ok || params == nil {
		return nil, fmt.Errorf("error retrieving path params")
	}

	id := params["id"]

	doc, err := orders.Doc(id).Get()
	if err != nil {
		ctx.Response.Body = []byte("Error retrieving document " + id)
		ctx.Response.Status = 404
	} else {
		b, err := json.Marshal(doc.Content())
		if err != nil {
			return nil, err
		}

		ctx.Response.Headers["Content-Type"] = []string{"application/json"}
		ctx.Response.Body = b
	}

	return next(ctx)
}

func main() {
	var err error
	orders, err = resources.NewCollection("orders", resources.CollectionReading)
	if err != nil {
		panic(err)
	}
	mainApi := resources.NewApi("rest-api")

	err = mainApi.Get("/orders/:id", common.PathParser("/orders/:id"), handler)
	if err != nil {
		fmt.Println(err)
	}
}

// [END snippet]
